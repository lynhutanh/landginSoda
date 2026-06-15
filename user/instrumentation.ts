/**
 * Next.js 15 Instrumentation - runs before anything else on the server.
 *
 * Promblem: Next.js dev server passes `--localstorage-file` to Node.js without
 * a valid path, which causes Node to create `global.localStorage = {}` — an
 * empty object with NO getItem/setItem/removeItem methods.
 * Any SSR code (including next-themes, zustand persist, etc.) that calls
 * localStorage.getItem() will crash with:
 *   TypeError: localStorage.getItem is not a function
 *
 * Fix: Replace the broken global with a proper no-op implementation.
 */
export async function register() {
  if (typeof globalThis.localStorage !== 'undefined') {
    if (typeof (globalThis.localStorage as any).getItem !== 'function') {
      // Patch the broken localStorage with a no-op implementation
      (globalThis as any).localStorage = {
        length: 0,
        key: (_index: number) => null,
        getItem: (_key: string) => null,
        setItem: (_key: string, _value: string) => {},
        removeItem: (_key: string) => {},
        clear: () => {}
      };
    }
  }
}
