import { useEffect, useState } from 'react';

/** Minimal hash router: #/topic/strategy, #/dev/board, #/metrics ... */
export function useRoute(): string[] {
  const read = () => (window.location.hash.replace(/^#\/?/, '') || 'home').split('/').filter(Boolean);
  const [parts, setParts] = useState<string[]>(read);
  useEffect(() => {
    const on = () => setParts(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return parts;
}

export function navigate(path: string) {
  window.location.hash = path.startsWith('/') ? path : `/${path}`;
}

export const href = (path: string) => `#${path.startsWith('/') ? path : `/${path}`}`;
