# Lichtblick – Die schönste Nachricht des Tages

Statische Webseite (GitHub Pages) mit einer neuen positiven Nachricht pro Tag.

## So funktioniert das Update

Jeden Morgen gegen 6 Uhr recherchiert eine geplante Claude-Aufgabe eine aktuelle positive
Nachricht, schreibt sie in eine JSON-Datei und trägt sie mit

    python3 scripts/update_news.py --from-file neu.json

in `data/news.json` ein (die bisherige wandert ins Archiv). Der Push auf `main` löst
GitHub Actions aus, das die Seite auf GitHub Pages veröffentlicht.

Einmalig nötig: Settings → Pages → *Source*: **GitHub Actions**.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html`, `archiv.html`, `app.js`, `*.css` | Die Webseite |
| `data/news.json` | Aktuelle Nachricht + Archiv (wird automatisch geändert) |
| `scripts/update_news.py` | Sucht und prüft die neue Nachricht |
| `.github/workflows/daily-news.yml` | Veröffentlichung auf GitHub Pages |

## Optional: vollautomatisch per API

`scripts/update_news.py` ohne `--from-file` sucht selbst per Claude- oder Perplexity-API
(Secret `ANTHROPIC_API_KEY` bzw. `PERPLEXITY_API_KEY`). Wird aktuell nicht genutzt.

Eine falsche Nachricht korrigieren: `data/news.json` direkt auf GitHub bearbeiten.
