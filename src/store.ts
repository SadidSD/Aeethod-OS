import { create } from 'zustand';
import type { Col, Collections, DB, Settings } from './types';
import { supabase } from './lib/supabase';
import { INITIAL_DB } from './data/initialDb';
import { INITIAL_SAAS_PRODUCTS } from './data/devPlanningData';

type SyncState = 'idle' | 'saving' | 'error';

interface State {
  db: DB | null;
  loadError: string | null;
  sync: SyncState;
  syncError: string | null;
  source: 'supabase' | 'local_server' | 'seed';

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
    if (!res.ok) {
      // On hosted environments like Vercel, /api may not exist; don't break the client
      console.warn(`[Local Server API] ${method} ${url} → ${res.status}`);
      inflight--;
      if (inflight === 0) useStore.setState({ sync: 'idle', syncError: null });
      return null;
    }
    inflight--;
    if (inflight === 0) useStore.setState({ sync: 'idle', syncError: null });
    return res.json();
  } catch (e) {
    inflight--;
    // Silent failover if local node server is offline
    console.warn(`[Local Server API Offline]`, e);
    if (inflight === 0) useStore.setState({ sync: 'idle' });
    return null;
  }
}

// Write helper for Supabase
async function supabaseSyncCreate<K extends Col>(col: K, item: Collections[K]) {
  try {
    const { error } = await supabase.from(col).insert(item as any);
    if (error) console.warn(`[Supabase insert ${col}]`, error.message);
  } catch (err) {
    console.warn(`[Supabase error]`, err);
  }
}

async function supabaseSyncUpdate<K extends Col>(col: K, id: string, patch: Partial<Collections[K]>) {
  try {
    const { error } = await supabase.from(col).update(patch as any).eq('id', id);
    if (error) console.warn(`[Supabase update ${col}]`, error.message);
  } catch (err) {
    console.warn(`[Supabase error]`, err);
  }
}

async function supabaseSyncDelete(col: Col, id: string) {
  try {
    const { error } = await supabase.from(col).delete().eq('id', id);
    if (error) console.warn(`[Supabase delete ${col}]`, error.message);
  } catch (err) {
    console.warn(`[Supabase error]`, err);
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
    supabaseSyncUpdate(entry.col, entry.id, entry.patch).catch(() => {});
  }, 350);
  pending.set(key, entry);
}
function flushPending() {
  for (const [key, entry] of pending) {
    clearTimeout(entry.timer);
    pending.delete(key);
    fetch(`/api/${entry.col}/${entry.id}`, {
      method: 'PATCH',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry.patch),
    }).catch(() => {});
    supabaseSyncUpdate(entry.col, entry.id, entry.patch).catch(() => {});
  }
}
window.addEventListener('beforeunload', flushPending);

// Collections that don't have dedicated tables in Supabase public schema:
// We persist them to the Supabase 'docs' table as a robust JSON document.
const docSyncTimers = new Map<string, number>();

export function syncCollectionToSupabaseDoc(col: Col, list: unknown[]) {
  // 1. Immediately cache in localStorage for instant retrieval across browser reloads
  try {
    localStorage.setItem(`aeethod_col_${col}`, JSON.stringify(list));
  } catch {}

  // 2. Debounced save to Supabase docs table
  const existingTimer = docSyncTimers.get(col);
  if (existingTimer) clearTimeout(existingTimer);

  const timer = window.setTimeout(async () => {
    docSyncTimers.delete(col);
    try {
      await supabase.from('docs').upsert({
        id: `collection_${col}`,
        topicId: 'internal_system_storage',
        title: `Internal DB: ${col}`,
        content: JSON.stringify(list),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn(`[Supabase doc sync error for ${col}]:`, err);
    }
  }, 200);

  docSyncTimers.set(col, timer);
}

function flushPendingDocSyncs() {
  for (const [col, timer] of docSyncTimers) {
    clearTimeout(timer);
    docSyncTimers.delete(col);
    const db = useStore.getState().db;
    if (db && db[col as Col]) {
      Promise.resolve(
        supabase.from('docs').upsert({
          id: `collection_${col}`,
          topicId: 'internal_system_storage',
          title: `Internal DB: ${col}`,
          content: JSON.stringify(db[col as Col]),
          updatedAt: new Date().toISOString(),
        })
      ).catch(() => {});
    }
  }
}
window.addEventListener('beforeunload', flushPendingDocSyncs);

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
  source: 'seed',
  openTaskId: null,
  paletteOpen: false,
  quickAddOpen: false,
  sidebarOpen: typeof window !== 'undefined' ? localStorage.getItem('notion_sidebar') !== 'false' : true,
  favorites: typeof window !== 'undefined' 
    ? (() => {
        try {
          const list = JSON.parse(localStorage.getItem('notion_favorites') || '[]');
          if (Array.isArray(list) && list.length > 0) {
            return list.includes('whiteboard') ? list : [...list, 'whiteboard'];
          }
        } catch {}
        return ['whiteboard', 'economics', 'strategy', 'metrics'];
      })()
    : ['whiteboard', 'economics', 'strategy', 'metrics'],
  peekMode: (typeof window !== 'undefined' ? (localStorage.getItem('notion_peek_mode') as 'side' | 'center' | 'full') : null) || 'side',
  theme: typeof window !== 'undefined' ? ((localStorage.getItem('notion_theme') as 'dark' | 'light') || 'dark') : 'dark',

  load: async () => {
    const collections: Col[] = [
      'topics',
      'tasks',
      'docs',
      'fields',
      'metrics',
      'sprints',
      'epics',
      'content_videos',
      'saas_products',
      'dev_items',
      'ui_ux_items',
      'whiteboard_elements',
    ];
    const supabaseResults: Partial<Record<Col, any[]>> = {};

    let hasSupabaseData = false;

    // 1. Fetch live data from Supabase
    try {
      const promises = collections.map(async (c) => {
        // A. Try direct Supabase table first
        const { data, error } = await supabase.from(c).select('*');
        if (!error && Array.isArray(data) && data.length > 0) {
          supabaseResults[c] = data;
          hasSupabaseData = true;
          try {
            localStorage.setItem(`aeethod_col_${c}`, JSON.stringify(data));
          } catch {}
        } else {
          // B. If direct table does not exist or returned no rows, check Supabase 'docs' table storage
          try {
            const docRes = await supabase
              .from('docs')
              .select('content')
              .eq('id', `collection_${c}`)
              .single();
            if (!docRes.error && docRes.data?.content) {
              const parsed = JSON.parse(docRes.data.content);
              if (Array.isArray(parsed)) {
                supabaseResults[c] = parsed;
                hasSupabaseData = true;
                try {
                  localStorage.setItem(`aeethod_col_${c}`, JSON.stringify(parsed));
                } catch {}
                return;
              }
            }
          } catch {}

          // C. Also check browser localStorage fallback cache
          try {
            const cached = localStorage.getItem(`aeethod_col_${c}`);
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) {
                supabaseResults[c] = parsed;
                hasSupabaseData = true;
                syncCollectionToSupabaseDoc(c, parsed);
              }
            }
          } catch {}
        }
      });
      await Promise.all(promises);
    } catch (err) {
      console.warn('Supabase query error:', err);
    }

    // Filter out internal system documents from general strategy/docs views
    if (supabaseResults.docs) {
      supabaseResults.docs = supabaseResults.docs.filter(
        (d) =>
          d.topicId !== 'internal_system_storage' &&
          !d.id.startsWith('collection_') &&
          d.id !== 'whiteboard_state'
      );
    }

    // 2. If Supabase has data, use it as primary source of truth
    if (hasSupabaseData) {
      const mergedDb: DB = { ...INITIAL_DB };
      for (const c of collections) {
        if (supabaseResults[c] !== undefined) {
          (mergedDb as any)[c] = supabaseResults[c];
        }
      }
      // Ensure saas_products has all detailed pillars populated if empty or from legacy cache
      if (mergedDb.saas_products && Array.isArray(mergedDb.saas_products)) {
        mergedDb.saas_products = mergedDb.saas_products.map((p: any) => {
          const fallback = INITIAL_SAAS_PRODUCTS.find((init) => init.id === p.id);
          if (!fallback) return p;
          return {
            ...fallback,
            ...p,
            targetCustomerProblem:
              p.targetCustomerProblem && p.targetCustomerProblem.length > 150
                ? p.targetCustomerProblem
                : fallback.targetCustomerProblem,
            problemsToBuild: p.problemsToBuild || fallback.problemsToBuild,
            competitorAnalysis: p.competitorAnalysis || fallback.competitorAnalysis,
            targetAudience: p.targetAudience || fallback.targetAudience,
            pricingModel: p.pricingModel || fallback.pricingModel,
            theAeethodSolution: p.theAeethodSolution ?? fallback.theAeethodSolution,
          };
        });
      }
      set({ db: mergedDb, loadError: null, source: 'supabase' });
      return;
    }

    // 3. Try local express backend if available
    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const serverDb = (await res.json()) as DB;
        set({ db: serverDb, loadError: null, source: 'local_server' });
        return;
      }
    } catch {
      // Local server is not reachable (e.g. running statically on Vercel)
    }

    // 4. Standalone / Cloud fallback with complete INITIAL_DB
    set({ db: INITIAL_DB, loadError: null, source: 'seed' });
  },

  create: (col, item) => {
    const now = new Date().toISOString();
    const full = { ...item, id: (item as { id?: string }).id ?? uid(), createdAt: now, updatedAt: now } as Collections[typeof col];
    set((s) => {
      if (!s.db) return s;
      const updatedList = [...s.db[col], full];
      syncCollectionToSupabaseDoc(col, updatedList);
      return { db: { ...s.db, [col]: updatedList } };
    });
    api('POST', `/api/${col}`, full).catch(() => {});
    supabaseSyncCreate(col, full).catch(() => {});
    return full;
  },

  update: (col, id, patch) => {
    const now = new Date().toISOString();
    set((s) => {
      if (!s.db) return s;
      const list = s.db[col] as Array<{ id: string }>;
      const updatedList = list.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: now } : x));
      syncCollectionToSupabaseDoc(col, updatedList);
      return { db: { ...s.db, [col]: updatedList } };
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
      for (const taskId of ids) {
        supabaseSyncDelete('tasks', taskId).catch(() => {});
      }
    } else {
      const updatedList = (db[col] as Array<{ id: string }>).filter((x) => x.id !== id);
      next = { ...next, [col]: updatedList } as DB;
      syncCollectionToSupabaseDoc(col, updatedList);
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
      supabaseSyncDelete(col, id).catch(() => {});
    }
    set({ db: next, openTaskId: get().openTaskId === id ? null : get().openTaskId });
    api('DELETE', `/api/${col}/${id}`).catch(() => {});
  },

  updateSettings: (patch) => {
    set((s) => (s.db ? { db: { ...s.db, settings: { ...s.db.settings, ...patch } } } : s));
    api('PATCH', '/api/settings', patch).catch(() => {});
    Promise.resolve(supabase.from('settings').upsert({ id: 'current', ...patch } as any)).catch(() => {});
  },

  replaceDb: async (db) => {
    const saved = (await api('PUT', '/api/db', db)) as DB;
    set({ db: saved || db, openTaskId: null });
  },

  resetDb: async () => {
    const saved = (await api('POST', '/api/reset')) as DB;
    set({ db: saved || INITIAL_DB, openTaskId: null });
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
