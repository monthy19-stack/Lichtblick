# Lichtblick – Die schönste Nachricht des Tages

Statische Webseite (GitHub Pages). Jeden Morgen um ca. 6:00 Uhr (deutsche Zeit) sucht ein
GitHub-Actions-Job per KI mit Websuche eine aktuelle positive Nachricht, schiebt die vorherige
ins Archiv und veröffentlicht die Seite neu.

## Einrichtung (einmalig)

1. **API-Schlüssel hinterlegen:** Settings → Secrets and variables → Actions → *New repository secret*
   - Name `ANTHROPIC_API_KEY` (Claude) **oder** `PERPLEXITY_API_KEY` (Perplexity), Wert = dein Schlüssel.
2. **GitHub Pages einschalten:** Settings → Pages → *Source*: **GitHub Actions**.
3. **Ersten Lauf starten:** Actions → „Tägliche Nachricht & Veröffentlichung“ → *Run workflow*
   (Häkchen „force“ setzen, damit sofort eine neue Nachricht geholt wird).

Die Seite liegt danach unter `https://<benutzername>.github.io/Lichtblick/`.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html`, `archiv.html`, `app.js`, `*.css` | Die Webseite |
| `data/news.json` | Aktuelle Nachricht + Archiv (wird automatisch geändert) |
| `scripts/update_news.py` | Sucht und prüft die neue Nachricht |
| `.github/workflows/daily-news.yml` | Zeitplan und Veröffentlichung |

## Optionale Einstellungen

Unter Settings → Secrets and variables → Actions → *Variables*:

- `LICHTBLICK_PROVIDER` – `claude` oder `perplexity`, falls beide Schlüssel hinterlegt sind
- `ANTHROPIC_MODEL` – Standard `claude-sonnet-5-5`
- `PERPLEXITY_MODEL` – Standard `sonar-pro`

Eine falsche Nachricht korrigieren: `data/news.json` direkt auf GitHub bearbeiten, oder den
Workflow mit „force“ erneut starten.
