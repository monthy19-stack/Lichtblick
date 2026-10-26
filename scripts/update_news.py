#!/usr/bin/env python3
"""Lichtblick – tägliches Update der "schönsten Nachricht des Tages".

Läuft jeden Morgen per GitHub Actions. Ablauf:
  1. Prüfen, ob heute schon aktualisiert wurde (dann nichts tun).
  2. Per KI mit Websuche eine aktuelle, positive Nachricht finden.
  3. Ergebnis prüfen (Pflichtfelder, Kategorie, Quelle erreichbar, keine Dopplung).
  4. Bisherige Tagesnachricht ins Archiv schieben, neue eintragen, news.json speichern.

KI-Anbieter (je nachdem, welcher Schlüssel als Secret hinterlegt ist):
  ANTHROPIC_API_KEY   -> Claude mit Websuche
  PERPLEXITY_API_KEY  -> Perplexity Sonar
Sind beide gesetzt, wird Claude genommen (änderbar über LICHTBLICK_PROVIDER).

Nur Python-Standardbibliothek, keine Installation nötig.
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
NEWS_FILE = ROOT / "data" / "news.json"
TZ = ZoneInfo("Europe/Berlin")

# Ab dieser Stunde (deutsche Zeit) darf aktualisiert werden. GitHub startet den
# Job zweimal (Sommer-/Winterzeit), der zu frühe Lauf beendet sich hier.
PUBLISH_HOUR = int(os.environ.get("LICHTBLICK_HOUR", "6"))
ARCHIVE_LIMIT = 730  # ca. zwei Jahre
MAX_ATTEMPTS = 3

CATEGORIES = {
    "wissenschaft": "Wissenschaft",
    "umwelt": "Umwelt & Klima",
    "gesundheit": "Gesundheit",
    "gesellschaft": "Gesellschaft",
    "kultur": "Kultur",
    "sport": "Sport",
    "wirtschaft": "Wirtschaft",
    "technologie": "Technologie",
    "tiere": "Tiere & Natur",
}

REQUIRED = ["headline", "summary", "why_positive", "category", "category_key",
            "source_name", "source_url", "published_at"]

UA = "Mozilla/5.0 (compatible; LichtblickBot/1.0; +https://github.com/)"


def log(msg):
    print(msg, flush=True)


# ---------------------------------------------------------------- Prompt

def build_prompt(today, recent, extra_hint=""):
    since = (datetime.fromisoformat(today) - timedelta(days=3)).date().isoformat()
    recent_lines = "\n".join(
        f"- {i.get('headline', '')} ({i.get('source_url', '')})" for i in recent
    ) or "- (noch keine)"
    cats = ", ".join(f'"{k}" ({v})' for k, v in CATEGORIES.items())
    return f"""Du bist Redakteur der deutschsprachigen Webseite „Lichtblick – Die schönste Nachricht des Tages“.

Heute ist der {today}. Suche im Web nach EINER echten, aktuellen, positiven Nachricht, die frühestens am {since} veröffentlicht wurde.

Anforderungen:
- Eine konstruktive, hoffnungsvolle Meldung (Fortschritt, Durchbruch, Erfolg, gute Tat, Naturschutz-Erfolg, medizinischer Fortschritt o. Ä.).
- Keine Werbung, keine Pressemitteilung eines Unternehmens über sich selbst, keine Parteipolitik, nichts Spekulatives.
- Quelle: ein seriöses Nachrichtenmedium, bevorzugt deutschsprachig (z. B. tagesschau.de, zdfheute.de, spiegel.de, zeit.de, sueddeutsche.de, faz.net, deutschlandfunk.de, br.de, ndr.de, wdr.de, swr.de, mdr.de, orf.at, srf.ch, dw.com). Internationale Qualitätsmedien sind erlaubt, wenn nichts Passendes auf Deutsch zu finden ist.
- source_url muss die exakte URL des konkreten Artikels sein, die du in der Suche gefunden hast – keine Startseite, keine erfundene URL.
- Nicht eine dieser bereits veröffentlichten Nachrichten (auch nicht dasselbe Ereignis):
{recent_lines}
{extra_hint}
Schreibe alle Texte auf Deutsch, sachlich und warm, ohne Übertreibung. Halte dich strikt an die Fakten aus dem Artikel.

Antworte AUSSCHLIESSLICH mit einem JSON-Objekt (ohne Markdown, ohne Erklärung) in genau diesem Format:
{{
  "headline": "Überschrift, max. 90 Zeichen",
  "summary": "3–5 Sätze Zusammenfassung",
  "why_positive": "1–2 Sätze, warum das eine gute Nachricht ist",
  "category": "Anzeigename der Kategorie",
  "category_key": "einer von: {cats}",
  "source_name": "Domain des Mediums, z. B. tagesschau.de",
  "source_url": "https://…",
  "published_at": "YYYY-MM-DD"
}}"""


# ---------------------------------------------------------------- HTTP

def post_json(url, headers, payload, timeout=180):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST",
                                 headers={"Content-Type": "application/json", **headers})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")[:500]
            if e.code in (429, 500, 502, 503, 529) and attempt < 2:
                log(f"  API {e.code}, neuer Versuch in 20 s …")
                time.sleep(20)
                continue
            raise RuntimeError(f"API-Fehler {e.code}: {body}") from None
        except urllib.error.URLError as e:
            if attempt < 2:
                time.sleep(10)
                continue
            raise RuntimeError(f"Netzwerkfehler: {e}") from None


# ---------------------------------------------------------------- Anbieter

def ask_claude(prompt):
    key = os.environ["ANTHROPIC_API_KEY"].strip()
    model = os.environ.get("ANTHROPIC_MODEL", "").strip() or "claude-sonnet-5-5"
    headers = {"x-api-key": key, "anthropic-version": "2023-06-01"}
    messages = [{"role": "user", "content": prompt}]
    tools = [{"type": "web_search_20250305", "name": "web_search", "max_uses": 6}]
    found_urls = set()
    text = ""
    for _ in range(5):  # pause_turn-Schleife
        resp = post_json("https://api.anthropic.com/v1/messages", headers, {
            "model": model, "max_tokens": 2500, "messages": messages, "tools": tools,
        })
        content = resp.get("content", [])
        for block in content:
            if block.get("type") == "web_search_tool_result" and isinstance(block.get("content"), list):
                for r in block["content"]:
                    if r.get("url"):
                        found_urls.add(r["url"])
            if block.get("type") == "text":
                for c in block.get("citations") or []:
                    if c.get("url"):
                        found_urls.add(c["url"])
        text = "".join(b.get("text", "") for b in content if b.get("type") == "text")
        if resp.get("stop_reason") == "pause_turn":
            messages = [messages[0], {"role": "assistant", "content": content}]
            continue
        break
    return text, found_urls


def ask_perplexity(prompt):
    key = os.environ["PERPLEXITY_API_KEY"].strip()
    model = os.environ.get("PERPLEXITY_MODEL", "").strip() or "sonar-pro"
    resp = post_json("https://api.perplexity.ai/chat/completions",
                     {"Authorization": f"Bearer {key}"}, {
                         "model": model,
                         "messages": [
                             {"role": "system", "content": "Antworte nur mit gültigem JSON."},
                             {"role": "user", "content": prompt},
                         ],
                         "search_recency_filter": "week",
                     })
    text = resp["choices"][0]["message"]["content"]
    urls = set(resp.get("citations") or [])
    for r in resp.get("search_results") or []:
        if r.get("url"):
            urls.add(r["url"])
    return text, urls


def pick_provider():
    forced = os.environ.get("LICHTBLICK_PROVIDER", "").strip().lower()
    has_a = bool(os.environ.get("ANTHROPIC_API_KEY", "").strip())
    has_p = bool(os.environ.get("PERPLEXITY_API_KEY", "").strip())
    if forced == "perplexity" and has_p:
        return "perplexity", ask_perplexity
    if forced == "claude" and has_a:
        return "claude", ask_claude
    if has_a:
        return "claude", ask_claude
    if has_p:
        return "perplexity", ask_perplexity
    return None, None


# ---------------------------------------------------------------- Prüfen

def extract_json(text):
    text = re.sub(r"```(?:json)?", "", text)
    start = text.find("{")
    end = text.rfind("}")
    if start < 0 or end <= start:
        raise ValueError("Keine JSON-Antwort gefunden")
    return json.loads(text[start:end + 1])


def norm_url(u):
    u = (u or "").strip().split("#")[0].split("?")[0].rstrip("/").lower()
    return re.sub(r"^https?://(www\.)?", "", u)


def url_reachable(url):
    """True = erreichbar, False = sicher kaputt (404/410), None = unklar (z. B. Bot-Sperre)."""
    for method in ("HEAD", "GET"):
        req = urllib.request.Request(url, method=method, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return r.status < 400
        except urllib.error.HTTPError as e:
            if e.code in (404, 410):
                return False
            if method == "GET":
                return None
        except Exception:
            if method == "GET":
                return None
    return None


def validate(item, today, known_urls, search_urls):
    for f in REQUIRED:
        if not str(item.get(f, "")).strip():
            raise ValueError(f"Feld fehlt: {f}")
    item = {k: str(item[k]).strip() for k in REQUIRED}

    key = item["category_key"].lower()
    if key not in CATEGORIES:
        # Versuch, über den Anzeigenamen zuzuordnen
        match = [k for k, v in CATEGORIES.items() if v.lower() == item["category"].lower()]
        key = match[0] if match else "gesellschaft"
    item["category_key"] = key
    if not item["category"]:
        item["category"] = CATEGORIES[key]

    url = item["source_url"]
    if not url.startswith("https://") and not url.startswith("http://"):
        raise ValueError(f"Ungültige URL: {url}")
    if re.match(r"^https?://[^/]+/?$", url):
        raise ValueError("source_url ist nur eine Startseite")
    if norm_url(url) in known_urls:
        raise ValueError("Nachricht war schon einmal dran")
    if search_urls and norm_url(url) not in {norm_url(u) for u in search_urls}:
        log("  Hinweis: URL stammt nicht direkt aus den Suchergebnissen – wird geprüft.")

    reach = url_reachable(url)
    if reach is False:
        raise ValueError(f"Quelle nicht erreichbar (404): {url}")
    if reach is None and search_urls and norm_url(url) not in {norm_url(u) for u in search_urls}:
        raise ValueError("Quelle weder prüfbar noch in den Suchergebnissen – verworfen")

    if not re.match(r"^\d{4}-\d{2}-\d{2}$", item["published_at"]):
        item["published_at"] = today
    if item["published_at"] > today:
        item["published_at"] = today

    item["source_name"] = re.sub(r"^https?://(www\.)?", "", item["source_name"]).strip("/")
    return item


# ---------------------------------------------------------------- Hauptablauf

def main():
    force = os.environ.get("LICHTBLICK_FORCE", "").lower() in ("1", "true", "yes")
    now = datetime.now(TZ)
    today = now.date().isoformat()

    data = json.loads(NEWS_FILE.read_text(encoding="utf-8"))
    current = data.get("current") or {}

    if "--force" in sys.argv:
        force = True
    if not force and current.get("date") == today:
        log(f"Heute ({today}) bereits aktualisiert – nichts zu tun.")
        return 0
    if not force and now.hour < PUBLISH_HOUR and "--from-file" not in sys.argv:
        log(f"Erst {now:%H:%M} Uhr – Update ab {PUBLISH_HOUR}:00 Uhr. Nichts zu tun.")
        return 0

    # Modus "--from-file datei.json": Die Nachricht wurde bereits recherchiert
    # (z. B. von der täglichen Claude-Aufgabe) – nur prüfen und eintragen.
    from_file = None
    if "--from-file" in sys.argv:
        from_file = Path(sys.argv[sys.argv.index("--from-file") + 1])

    archive = data.get("archive") or []
    all_items = ([current] if current else []) + archive
    known_urls = {norm_url(i.get("source_url")) for i in all_items if i.get("source_url")}

    if from_file:
        raw = extract_json(from_file.read_text(encoding="utf-8"))
        try:
            item = validate(raw, today, known_urls, set())
        except Exception as e:  # noqa: BLE001
            log(f"FEHLER: Nachricht ungültig: {e}")
            return 2
        return save(data, current, archive, item, today)

    name, ask = pick_provider()
    if not ask:
        log("FEHLER: Kein API-Schlüssel gefunden. Bitte ANTHROPIC_API_KEY oder "
            "PERPLEXITY_API_KEY als Repository-Secret anlegen.")
        return 1
    log(f"Suche Nachricht für {today} mit {name} …")

    recent = all_items[:30]

    hint = ""
    item = None
    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            text, search_urls = ask(build_prompt(today, recent, hint))
            item = validate(extract_json(text), today, known_urls, search_urls)
            break
        except Exception as e:  # noqa: BLE001
            log(f"  Versuch {attempt} verworfen: {e}")
            hint = f"\nWICHTIG: Ein vorheriger Vorschlag wurde verworfen ({e}). Wähle eine andere Nachricht mit einer echten, funktionierenden Artikel-URL.\n"
            item = None
    if not item:
        log("FEHLER: Keine gültige Nachricht gefunden. Die bisherige bleibt stehen.")
        return 1

    return save(data, current, archive, item, today)


def save(data, current, archive, item, today):
    item = {"date": today, **item, "added_at": today}

    if current and current.get("date") and current.get("date") != today:
        archive.insert(0, current)
    data["current"] = item
    data["archive"] = archive[:ARCHIVE_LIMIT]
    data.setdefault("site", {})["updated_at"] = today

    NEWS_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    log(f"Neu: {item['headline']} ({item['source_url']})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
