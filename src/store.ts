import { create } from 'zustand';
import type { Col, Collections, DB, Settings } from './types';

type SyncState = 'idle' | 'saving' | 'error';

interface State {
  db: DB | null;
  loadError: string | null;
  sync: SyncState;
  syncError: string | null;

  openTaskId: string | null;
  paletteOpen: boolean;
  quickAddOpen: boolean;
  sidebarOpen: boolean;
  favorites: string[];
  peekMode: 'side' | 'center' | 'full';
  theme: 'dark' | 'light';

  load: () => Promise<void>;
  create: <K extends Col>(col: K, item: Partial<Collections[K]>) => Collections[K];
  update: <K extends Col>(col: K, id: string, patch: Partial<Collections[K]>) => void;
  remove: (col: Col, id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  replaceDb: (db: DB) => Promise<void>;
  resetDb: () => Promise<void>;

  setOpenTask: (id: string | null) => void;
  setPaletteOpen: (open: boolean) => void;
  setQuickAddOpen: (open: boolean) => void;
  toggleSidebar: (open?: boolean) => void;
  toggleFavorite: (id: string) => void;
  setPeekMode: (mode: 'side' | 'center' | 'full') => void;
  toggleTheme: (theme?: 'dark' | 'light') => void;
}

// --- network helpers -------------------------------------------------------
let inflight = 0;
async function api(method: string, url: string, body?: unknown) {
  inflight++;
  useStore.setState({ sync: 'saving' });
  try {
    const res = await fetch(url, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`${method} ${url} → ${res.status} ${await res.text()}`);
    inflight--;
    if (inflight === 0) useStore.setState({ sync: 'idle', syncError: null });
    return res.json();
  } catch (e) {
    inflight--;
    useStore.setState({ sync: 'error', syncError: e instanceof Error ? e.message : String(e) });
    throw e;
  }
}

// Debounced PATCHes: typing in a description sends one request, not hundreds.
const pending = new Map<string, { col: Col; id: string; patch: Record<string, unknown>; timer: number }>();
function schedulePatch(col: Col, id: string, patch: Record<string, unknown>) {
  const key = `${col}:${id}`;
  const existing = pending.get(key);
  if (existing) {
    clearTimeout(existing.timer);
    Object.assign(existing.patch, patch);
  }
  const entry = existing ?? { col, id, patch: { ...patch }, timer: 0 };
  entry.timer = window.setTimeout(() => {
    pending.delete(key);
    api('PATCH', `/api/${col}/${id}`, entry.patch).catch(() => {});
  }, 350);
  pending.set(key, entry);
}
function flushPending() {
  for (const [key, entry] of pending) {
    clearTimeout(entry.timer);
    pending.delete(key);
    // keepalive lets the request finish even while the tab is closing.
    fetch(`/api/${entry.col}/${entry.id}`, {
      method: 'PATCH',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry.patch),
    }).catch(() => {});
  }
}
window.addEventListener('beforeunload', flushPending);

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));

function descendantIds(db: DB, rootId: string) {
  const ids = new Set([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const t of db.tasks) {
      if (t.parentId && ids.has(t.parentId) && !ids.has(t.id)) {
        ids.add(t.id);
        grew = true;
      }
    }
  }
  return ids;
}

export const useStore = create<State>((set, get) => ({
  db: null,
  loadError: null,
  sync: 'idle',
  syncError: null,
  openTaskId: null,
  paletteOpen: false,
  quickAddOpen: false,
  sidebarOpen: typeof window !== 'undefined' ? localStorage.getItem('notion_sidebar') !== 'false' : true,
  favorites: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('notion_favorites') || '["economics", "strategy", "metrics"]') : ['economics', 'strategy', 'metrics'],
  peekMode: (typeof window !== 'undefined' ? (localStorage.getItem('notion_peek_mode') as 'side' | 'center' | 'full') : null) || 'side',
  theme: typeof window !== 'undefined' ? ((localStorage.getItem('notion_theme') as 'dark' | 'light') || 'dark') : 'dark',

  load: async () => {
    try {
      const res = await fetch('/api/db');
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      set({ db: (await res.json()) as DB, loadError: null });
    } catch (e) {
      set({ loadError: e instanceof Error ? e.message : String(e) });
    }
  },

  create: (col, item) => {
    const now = new Date().toISOString();
    const full = { ...item, id: (item as { id?: string }).id ?? uid(), createdAt: now, updatedAt: now } as Collections[typeof col];
    set((s) => (s.db ? { db: { ...s.db, [col]: [...s.db[col], full] } } : s));
    api('POST', `/api/${col}`, full).catch(() => {});
    return full;
  },

  update: (col, id, patch) => {
    const now = new Date().toISOString();
    set((s) => {
      if (!s.db) return s;
      const list = s.db[col] as Array<{ id: string }>;
      return { db: { ...s.db, [col]: list.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: now } : x)) } };
    });
    schedulePatch(col, id, patch as Record<string, unknown>);
  },

  remove: (col, id) => {
    const db = get().db;
    if (!db) return;
    let next: DB = { ...db };
    if (col === 'tasks') {
      const ids = descendantIds(db, id);
      next.tasks = db.tasks.filter((t) => !ids.has(t.id));
    } else {
      next = { ...next, [col]: (db[col] as Array<{ id: string }>).filter((x) => x.id !== id) } as DB;
      if (col === 'topics') {
        next.tasks = next.tasks.filter((t) => t.topicId !== id);
        next.docs = next.docs.filter((d) => d.topicId !== id);
        next.fields = next.fields.filter((f) => f.topicId !== id);
      }
      if (col === 'fields') {
        next.tasks = next.tasks.map((t) => {
          if (!(id in (t.fields || {}))) return t;
          const { [id]: _drop, ...rest } = t.fields;
          return { ...t, fields: rest };
        });
      }
      if (col === 'sprints') next.tasks = next.tasks.map((t) => (t.sprintId === id ? { ...t, sprintId: null } : t));
      if (col === 'epics') next.tasks = next.tasks.map((t) => (t.epicId === id ? { ...t, epicId: null } : t));
    }
    set({ db: next, openTaskId: get().openTaskId === id ? null : get().openTaskId });
    api('DELETE', `/api/${col}/${id}`).catch(() => {});
  },

  updateSettings: (patch) => {
    set((s) => (s.db ? { db: { ...s.db, settings: { ...s.db.settings, ...patch } } } : s));
    api('PATCH', '/api/settings', patch).catch(() => {});
  },

  replaceDb: async (db) => {
    const saved = (await api('PUT', '/api/db', db)) as DB;
    set({ db: saved, openTaskId: null });
  },

  resetDb: async () => {
    const saved = (await api('POST', '/api/reset')) as DB;
    set({ db: saved, openTaskId: null });
  },

  setOpenTask: (id) => set({ openTaskId: id }),
  setPaletteOpen: (open) => set({ paletteOpen: open }),
  setQuickAddOpen: (open) => set({ quickAddOpen: open }),

  toggleSidebar: (open) => {
    set((s) => {
      const next = open !== undefined ? open : !s.sidebarOpen;
      try { localStorage.setItem('notion_sidebar', String(next)); } catch {}
      return { sidebarOpen: next };
    });
  },

  toggleFavorite: (id) => {
    set((s) => {
      const exists = s.favorites.includes(id);
      const next = exists ? s.favorites.filter((f) => f !== id) : [...s.favorites, id];
      try { localStorage.setItem('notion_favorites', JSON.stringify(next)); } catch {}
      return { favorites: next };
    });
  },

  setPeekMode: (mode) => {
    try { localStorage.setItem('notion_peek_mode', mode); } catch {}
    set({ peekMode: mode });
  },

  toggleTheme: (targetTheme) => {
    set((s) => {
      const next = targetTheme ? targetTheme : (s.theme === 'dark' ? 'light' : 'dark');
      try {
        localStorage.setItem('notion_theme', next);
        if (typeof document !== 'undefined') {
          if (next === 'light') {
            document.documentElement.classList.add('light');
            document.documentElement.setAttribute('data-theme', 'light');
          } else {
            document.documentElement.classList.remove('light');
            document.documentElement.setAttribute('data-theme', 'dark');
          }
        }
      } catch {}
      return { theme: next };
    });
  },
}));

// Apply initial theme on script evaluation
if (typeof document !== 'undefined') {
  try {
    const saved = localStorage.getItem('notion_theme');
    if (saved === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch {}
}

/** Non-null DB accessor for components rendered after load. */
export function useDb(): DB {
  const db = useStore((s) => s.db);
  if (!db) throw new Error('Database not loaded');
  return db;
}
