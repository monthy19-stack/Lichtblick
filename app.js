// app.js — Lichtblick shared logic

const CATEGORY_ICONS = {
  wissenschaft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6M10 2v6.2a2 2 0 0 1-.4 1.2L5 16.5A3 3 0 0 0 7.4 21h9.2a3 3 0 0 0 2.4-4.5l-4.6-7.1A2 2 0 0 1 14 8.2V2"/><path d="M8.5 14.5h7"/></svg>`,
  umwelt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 3c1 2.35 2.5 6.65-1 10.8C15.5 17.8 12 20 12 20z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.6 14.5 12 15.5 12 20"/></svg>`,
  gesundheit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>`,
  gesellschaft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6"/><path d="M14.5 14.3c2.4.3 4 2.3 4 5.7"/></svg>`,
  kultur: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-4.4 0-8 1.8-8 4v9c0 2.2 3.6 4 8 4s8-1.8 8-4V7c0-2.2-3.6-4-8-4Z"/><path d="M4 7c0 2.2 3.6 4 8 4s8-1.8 8-4"/></svg>`,
  sport: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3c2.5 2.6 2.5 15.4 0 18M3 12h18M5 6.5c3 1.6 11 1.6 14 0M5 17.5c3-1.6 11-1.6 14 0"/></svg>`,
  wirtschaft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V10l4-3 4 3v11"/><path d="M13 21V6l4-3 4 3v15"/></svg>`,
  technologie: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M19.5 4.5l-2 2M6.5 17.5l-2 2"/></svg>`,
  tiere: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="9" r="2"/><circle cx="9.5" cy="5.5" r="2"/><circle cx="14.5" cy="5.5" r="2"/><circle cx="18.5" cy="9" r="2"/><path d="M12 11c3 0 6 2.2 6 5.2 0 2-1.8 3.3-4 3.3-.9 0-1.4-.5-2-.5s-1.1.5-2 .5c-2.2 0-4-1.3-4-3.3C6 13.2 9 11 12 11Z"/></svg>`,
};

const CATEGORY_LABELS = {
  wissenschaft: 'Wissenschaft',
  umwelt: 'Umwelt & Klima',
  gesundheit: 'Gesundheit',
  gesellschaft: 'Gesellschaft',
  kultur: 'Kultur',
  sport: 'Sport',
  wirtschaft: 'Wirtschaft',
  technologie: 'Technologie',
  tiere: 'Tiere & Natur',
};

const ICON_SUN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8"/></svg>`;
const ICON_ARCHIVE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="4.5" rx="1"/><path d="M4.5 8.5V19a1.5 1.5 0 0 0 1.5 1.5h12A1.5 1.5 0 0 0 19.5 19V8.5"/><path d="M10 13h4"/></svg>`;
const ICON_SPARK = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 3.7 1.6 6 3.2 7.7C16.8 11.3 19 12.3 22 13c-3 .7-5.2 1.7-6.8 3.3C13.6 18 12.6 20.3 12 24c-.6-3.7-1.6-6-3.2-7.7C7.2 14.7 5 13.7 2 13c3-.7 5.2-1.7 6.8-3.3C10.4 8 11.4 5.7 12 2Z"/></svg>`;
const ICON_LINK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.1"/><path d="M14 10a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/></svg>`;
const ICON_EYE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const ICON_THUMB_UP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3Zm0 0 4.5-8a2 2 0 0 1 3.6 1.4L14.2 9H19a2 2 0 0 1 1.9 2.7l-2.5 7A2 2 0 0 1 16.5 20H9a2 2 0 0 1-2-2v-7Z"/></svg>`;
const ICON_THUMB_DOWN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 13V4h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-3Zm0 0-4.5 8a2 2 0 0 1-3.6-1.4l1.9-4.6H6a2 2 0 0 1-1.9-2.7l2.5-7A2 2 0 0 1 8.5 4H15a2 2 0 0 1 2 2v7Z"/></svg>`;
const ICON_SHARE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.6l7.3-4.3M8.3 13.4l7.3 4.3"/></svg>`;
const ICON_CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

const SHARE_PLATFORMS = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'x', label: 'X' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'pinterest', label: 'Pinterest' },
  { id: 'snapchat', label: 'Snapchat' },
  { id: 'mastodon', label: 'Mastodon' },
  { id: 'bluesky', label: 'Bluesky' },
  { id: 'threads', label: 'Threads' },
];

const SHARE_ICONS = {
  facebook: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14 21v-7h2.2l.3-2.6H14v-1.7c0-.8.2-1.4 1.4-1.4h1.3V6c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3v1.9H9.5v2.6H11.6v7"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/><path d="M8.3 10.3c0 3.5 2.4 5.9 5.9 5.9" stroke-width="1.8"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.3 8.3l7.4 7.4M15.7 8.3l-7.4 7.4"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="8.6" cy="8.8" r="0.9" fill="currentColor" stroke="none"/><path d="M8.6 11.2v5.5M12.6 11.2v5.5M12.6 13.6c0-1.4 1-2.4 2.2-2.4 1.3 0 2.1 1 2.1 2.6v2.9"/></svg>`,
  pinterest: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10.2 18c.4-1.7 1.6-6.6 1.6-6.6M9.4 12.9s-.4-1.1.2-2.4c.7-1.6 3.6-1.7 4.2.2.5 1.9-1 3.6-2.6 3.1"/></svg>`,
  snapchat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.3c2.2 0 3.6 1.7 3.6 3.8v1.5c.9.3 1.6-.2 1.6-.2.3.4 0 .8-.6 1.2-.5.3-.5.7-.2 1 .6.9 1.6 1.5 2.7 1.8-.1.5-1 .8-2.2 1-.1.4-.2.7-.3 1-1.1.1-1.8-.2-2.7-.2-1 0-1.6.9-2.9.9s-1.9-.9-2.9-.9c-.9 0-1.6.3-2.7.2-.1-.3-.2-.6-.3-1-1.2-.2-2.1-.5-2.2-1 1.1-.3 2.1-.9 2.7-1.8.3-.3.3-.7-.2-1-.6-.4-.9-.8-.6-1.2 0 0 .7.5 1.6.2V7.1c0-2.1 1.4-3.8 3.6-3.8Z"/></svg>`,
  mastodon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6.5l-2.8 2.8V15H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M9 8.6v2.8M12 8.6v2.8M15 8.6v2.8"/></svg>`,
  bluesky: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8.3c-1.2-2.3-3.5-4-5.6-4.2-1-.1-1.5.4-1.2 1.5.3 1.2 1.3 3.9 4.3 5.4-2.3.2-4.5 1.2-4.5 2.8s1.4 2.3 2.6 2c1.4-.3 3.2-1.5 3.9-3 .7 1.5 2.5 2.7 3.9 3 1.2.3 2.6-.4 2.6-2s-2.2-2.6-4.5-2.8c3-1.5 4-4.2 4.3-5.4.3-1.1-.2-1.6-1.2-1.5-2.1.2-4.4 1.9-5.6 4.2Z"/></svg>`,
  threads: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 9 9c0-2.3-.7-4.1-1.9-5.4"/><path d="M12 8a4 4 0 1 0 .4 8c1.8-.1 3.1-1.2 3.5-3 .3-1.1.1-2.4-.4-3.4"/></svg>`,
};

function catColor(key) {
  return `var(--cat-${key}, var(--color-primary))`;
}

function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function safeUrl(url) {
  try {
    const u = new URL(String(url), window.location.href);
    return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : '#';
  } catch (e) {
    return '#';
  }
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}
function formatDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ---------- News laden ----------
// Die Daten liegen als statische Datei im Repository und werden jeden
// Morgen von einem GitHub-Actions-Job (scripts/update_news.py) erneuert.
async function loadNews() {
  const res = await fetch('./data/news.json?t=' + Date.now(), { cache: 'no-store' });
  if (!res.ok) throw new Error('news.json not found');
  return res.json();
}

// Heutiges Datum in deutscher Zeit als YYYY-MM-DD.
function todayBerlinIso() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' });
}

// Ganze Tage zwischen einem ISO-Datum und heute (deutsche Zeit).
function daysSince(iso) {
  if (!iso) return 0;
  const a = new Date(iso + 'T00:00:00Z');
  const b = new Date(todayBerlinIso() + 'T00:00:00Z');
  return Math.round((b - a) / 86400000);
}

function formatCount(n) {
  return Number(n || 0).toLocaleString('de-DE');
}

// ---------- Farbmodus ----------
// Startet mit der Systemeinstellung; eine manuelle Wahl wird im Browser
// gemerkt (falls Speicher verfügbar ist).
(function initTheme() {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('lichtblick-theme'); } catch (e) {}
  let dark = saved ? saved === 'dark'
    : !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.setAttribute('data-theme', dark ? 'dark' : 'light');

  function updateToggleIcon(t, isDark) {
    t.setAttribute('aria-label', 'Zu ' + (isDark ? 'hellem' : 'dunklem') + ' Modus wechseln');
    t.innerHTML = isDark
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const t = document.querySelector('[data-theme-toggle]');
    if (!t) return;
    updateToggleIcon(t, dark);
    t.addEventListener('click', () => {
      dark = !dark;
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      updateToggleIcon(t, dark);
      try { localStorage.setItem('lichtblick-theme', dark ? 'dark' : 'light'); } catch (e) {}
    });
  });
})();

// ---------- Abstimmung (Daumen hoch/runter) ----------
// Die Stimmen liegen in einer Firebase Realtime Database (kostenloser Tarif).
// Struktur: /votes/<YYYY-MM-DD> = { up: Zahl, down: Zahl }
// Die eigene Stimme wird im Browser gemerkt, damit jeder pro Nachricht nur
// einmal abstimmt. Ist keine Datenbank eingetragen, bleibt die Abstimmung aus.
const VOTES_DB_URL = 'https://lichtblick-3106a-default-rtdb.europe-west1.firebasedatabase.app';

let VOTES_CACHE = null;
let VOTES_PROMISE = null;

function votesEnabled() {
  return /^https:\/\/[a-z0-9.-]+\.(firebaseio\.com|firebasedatabase\.app)\/?$/i.test(VOTES_DB_URL);
}
function votesBase() {
  return VOTES_DB_URL.replace(/\/$/, '');
}

function getMyVote(date) {
  try { return localStorage.getItem('lichtblick-vote-' + date); } catch (e) { return null; }
}
function setMyVote(date, vote) {
  try {
    if (vote) localStorage.setItem('lichtblick-vote-' + date, vote);
    else localStorage.removeItem('lichtblick-vote-' + date);
  } catch (e) {}
}

async function fetchAllVotes(force) {
  if (!votesEnabled()) return {};
  if (!force && VOTES_PROMISE) return VOTES_PROMISE;
  VOTES_PROMISE = (async () => {
    try {
      const res = await fetch(`${votesBase()}/votes.json`, { cache: 'no-store' });
      if (!res.ok) throw new Error('votes not ok');
      VOTES_CACHE = (await res.json()) || {};
    } catch (e) {
      VOTES_CACHE = VOTES_CACHE || {};
    }
    return VOTES_CACHE;
  })();
  return VOTES_PROMISE;
}

// Zählt einen Wert in der Datenbank serverseitig um +1 oder -1 hoch.
async function bumpVote(date, field, delta) {
  const res = await fetch(`${votesBase()}/votes/${encodeURIComponent(date)}/${field}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ '.sv': { increment: delta } }),
  });
  if (!res.ok) throw new Error('vote failed');
  return res.json();
}

function voteWidgetHtml(item) {
  if (!votesEnabled()) return '';
  const date = escapeHtml(item.date || '');
  return `
    <div class="vote-widget" data-vote-widget data-date="${date}">
      <span class="vote-widget__label">War das ein Lichtblick für dich?</span>
      <div class="vote-buttons">
        <button type="button" class="vote-btn vote-btn--up" data-vote-btn="up" aria-pressed="false" aria-label="Gefällt mir">
          ${ICON_THUMB_UP}<span class="vote-count" data-vote-count="up">0</span>
        </button>
        <button type="button" class="vote-btn vote-btn--down" data-vote-btn="down" aria-pressed="false" aria-label="Gefällt mir nicht">
          ${ICON_THUMB_DOWN}<span class="vote-count" data-vote-count="down">0</span>
        </button>
      </div>
    </div>`;
}

function paintVoteWidget(widget, entry) {
  const data = entry || {};
  const my = getMyVote(widget.dataset.date);
  const set = (sel, v) => { const el = widget.querySelector(sel); if (el) el.textContent = formatCount(v); };
  set('[data-vote-count="up"]', Math.max(0, data.up || 0));
  set('[data-vote-count="down"]', Math.max(0, data.down || 0));
  const upBtn = widget.querySelector('[data-vote-btn="up"]');
  const downBtn = widget.querySelector('[data-vote-btn="down"]');
  if (upBtn) upBtn.setAttribute('aria-pressed', String(my === 'up'));
  if (downBtn) downBtn.setAttribute('aria-pressed', String(my === 'down'));
}

function wireVoteWidget(widget) {
  if (!widget || widget.dataset.wired) return;
  widget.dataset.wired = '1';
  const date = widget.dataset.date;
  widget.querySelectorAll('[data-vote-btn]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const want = btn.dataset.voteBtn;
      const prev = getMyVote(date);
      const next = prev === want ? null : want; // nochmal klicken = Stimme zurücknehmen
      const buttons = widget.querySelectorAll('[data-vote-btn]');
      buttons.forEach((b) => (b.disabled = true));
      const entry = Object.assign({ up: 0, down: 0 }, (VOTES_CACHE || {})[date]);
      try {
        if (prev) { await bumpVote(date, prev, -1); entry[prev] = Math.max(0, (entry[prev] || 0) - 1); }
        if (next) { await bumpVote(date, next, 1); entry[next] = (entry[next] || 0) + 1; }
        setMyVote(date, next);
        if (VOTES_CACHE) VOTES_CACHE[date] = entry;
        paintVoteWidget(widget, entry);
      } catch (e) {
        // Abstimmung ist ein Extra – Fehler dürfen die Seite nicht stören.
      } finally {
        buttons.forEach((b) => (b.disabled = false));
      }
    });
  });
}

async function hydrateVoteWidgets(root) {
  const widgets = Array.from(root.querySelectorAll('[data-vote-widget]'));
  if (!widgets.length) return;
  const votes = await fetchAllVotes();
  widgets.forEach((w) => {
    wireVoteWidget(w);
    paintVoteWidget(w, votes[w.dataset.date]);
  });
}

function netScore(votesMap, date) {
  const v = votesMap && votesMap[date];
  return v ? Math.max(0, v.up || 0) - Math.max(0, v.down || 0) : 0;
}
function upCount(votesMap, date) {
  const v = votesMap && votesMap[date];
  return v ? Math.max(0, v.up || 0) : 0;
}

// ============ SHARE MENU ============
// Builds a share button + popover for a piece of content. `targetPath` is the
// page the share should point back to ('index.html' or 'archiv.html'); the
// absolute URL is resolved at render time from the current origin.
function shareButtonHtml(headline, targetPath, compact) {
  const url = new URL(targetPath, window.location.href).href;
  const text = `${headline} — Lichtblick`;
  const cls = compact ? 'share-btn share-btn--compact' : 'share-btn';
  const label = compact ? '' : '<span>Teilen</span>';
  return `
    <button type="button" class="${cls}" data-share-toggle data-url="${escapeHtml(url)}" data-text="${escapeHtml(text)}" aria-haspopup="true" aria-expanded="false" aria-label="Teilen">
      ${ICON_SHARE}${label}
    </button>`;
}

function ensureShareLayer() {
  let layer = document.getElementById('share-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'share-layer';
    layer.className = 'share-layer';
    document.body.appendChild(layer);
  }
  return layer;
}

let _activeSharePanel = null;
let _activeShareButton = null;

function closeSharePanel() {
  if (_activeSharePanel) _activeSharePanel.remove();
  if (_activeShareButton) _activeShareButton.setAttribute('aria-expanded', 'false');
  _activeSharePanel = null;
  _activeShareButton = null;
}

function positionSharePanel(panel, btn) {
  const rect = btn.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const pw = panel.offsetWidth || 300;
  const ph = panel.offsetHeight || 320;
  let left = rect.right - pw;
  left = Math.max(12, Math.min(left, vw - pw - 12));
  let top = rect.bottom + 8;
  if (top + ph > vh - 12 && rect.top - ph - 8 > 12) {
    top = rect.top - ph - 8;
  }
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
}

function copyViaExecCommand(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
}

async function copyToClipboard(text) {
  // The execCommand fallback is synchronous and works even where the async
  // Clipboard API is blocked or hangs (e.g. inside a sandboxed preview iframe
  // without the clipboard-write permission policy), so try it first.
  if (copyViaExecCommand(text)) return true;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      const result = await Promise.race([
        navigator.clipboard.writeText(text).then(() => true),
        new Promise((resolve) => setTimeout(() => resolve(false), 1200)),
      ]);
      return result;
    } catch (e) {
      return false;
    }
  }
  return false;
}

function showShareToast(panel, message) {
  const toast = panel.querySelector('[data-share-toast]');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function openSharePopup(shareUrl) {
  window.open(shareUrl, 'lichtblick-share', 'width=600,height=640,noopener,noreferrer');
}

function shareUrlFor(id, url, text) {
  const eu = encodeURIComponent(url);
  const et = encodeURIComponent(text);
  switch (id) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${eu}`;
    case 'x':
      return `https://twitter.com/intent/tweet?text=${et}&url=${eu}`;
    case 'whatsapp':
      return `https://api.whatsapp.com/send?text=${et}%20${eu}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${eu}`;
    case 'pinterest':
      return `https://pinterest.com/pin/create/button/?url=${eu}&description=${et}`;
    case 'bluesky':
      return `https://bsky.app/intent/compose?text=${et}%20${eu}`;
    case 'threads':
      return `https://www.threads.net/intent/post?text=${et}%20${eu}`;
    default:
      return null;
  }
}

async function shareViaNativeOrCopy(url, text, panel) {
  if (navigator.share) {
    try {
      await navigator.share({ title: text, url });
      return;
    } catch (e) {
      // user cancelled the native share sheet — fall through to copy
    }
  }
  const ok = await copyToClipboard(url);
  showShareToast(panel, ok ? 'Link kopiert – in der App einfügen' : 'Kopieren nicht möglich');
}

function shareToMastodon(url, text) {
  const instance = window.prompt('Auf welcher Mastodon-Instanz bist du? (z. B. mastodon.social)', 'mastodon.social');
  if (!instance) return;
  const clean = instance.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!clean) return;
  openSharePopup(`https://${clean}/share?text=${encodeURIComponent(`${text} ${url}`)}`);
}

async function handleShareClick(id, url, text, panel) {
  if (id === 'instagram' || id === 'snapchat') {
    await shareViaNativeOrCopy(url, text, panel);
    return;
  }
  if (id === 'mastodon') {
    shareToMastodon(url, text);
    return;
  }
  const target = shareUrlFor(id, url, text);
  if (target) openSharePopup(target);
}

function shareChipHtml(platform) {
  const icon = SHARE_ICONS[platform.id] || ICON_SHARE;
  return `
    <button type="button" class="share-chip" data-platform="${platform.id}" style="--chip-color: var(--share-${platform.id})" role="menuitem">
      <span class="share-chip__icon">${icon}</span>
      <span>${escapeHtml(platform.label)}</span>
    </button>`;
}

function buildSharePanel(url, text) {
  const panel = document.createElement('div');
  panel.className = 'share-panel';
  panel.setAttribute('role', 'menu');
  panel.innerHTML = `
    <div class="share-grid">${SHARE_PLATFORMS.map(shareChipHtml).join('')}</div>
    <button type="button" class="share-copy" data-share-copy>${ICON_LINK}<span>Link kopieren</span></button>
    <span class="share-toast" data-share-toast hidden></span>`;
  panel.querySelectorAll('[data-platform]').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      handleShareClick(chip.dataset.platform, url, text, panel);
    });
  });
  panel.querySelector('[data-share-copy]').addEventListener('click', async (e) => {
    e.stopPropagation();
    const ok = await copyToClipboard(url);
    showShareToast(panel, ok ? 'Link kopiert!' : 'Kopieren nicht möglich');
    if (ok) setTimeout(closeSharePanel, 1200);
  });
  return panel;
}

function toggleSharePanel(btn) {
  const wasOpenForThisBtn = _activeShareButton === btn;
  closeSharePanel();
  if (wasOpenForThisBtn) return;
  const layer = ensureShareLayer();
  const panel = buildSharePanel(btn.dataset.url, btn.dataset.text);
  layer.appendChild(panel);
  positionSharePanel(panel, btn);
  btn.setAttribute('aria-expanded', 'true');
  _activeSharePanel = panel;
  _activeShareButton = btn;
}

function initShareButtons(root) {
  const buttons = Array.from((root || document).querySelectorAll('[data-share-toggle]'));
  buttons.forEach((btn) => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSharePanel(btn);
    });
  });
}

document.addEventListener('click', (e) => {
  if (_activeSharePanel && !_activeSharePanel.contains(e.target)) closeSharePanel();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSharePanel();
});
window.addEventListener('scroll', () => closeSharePanel(), { passive: true });
window.addEventListener('resize', () => closeSharePanel());
