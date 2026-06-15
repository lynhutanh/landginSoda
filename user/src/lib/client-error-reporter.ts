/**
 * Lightweight client error reporter — sends to /logs/client-error.
 * Fail-silent: never blocks UI or throws.
 */
const API_ENDPOINT =
  typeof window !== 'undefined'
    ? '/api-backend'
    : process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5001';

const SOURCE: 'admin' | 'user' = 'user';

interface ReportPayload {
  message?: string;
  stack?: string;
  level?: 'info' | 'warn' | 'error' | 'fatal';
  type?: 'client_error' | 'user_action';
  eventName?: string;
  page?: string;
  metadata?: Record<string, any>;
}

const SENSITIVE = /(password|token|secret|authorization|cookie|refresh|credential)/i;
function mask(value: any, depth = 0): any {
  if (depth > 6 || value == null) return value;
  if (Array.isArray(value)) return value.map((v) => mask(v, depth + 1));
  if (typeof value !== 'object') return value;
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = SENSITIVE.test(k) ? '[REDACTED]' : mask(v, depth + 1);
  }
  return out;
}

function sessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = sessionStorage.getItem('__app_session_id');
    if (!id) {
      id =
        (crypto as any)?.randomUUID?.() ||
        `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem('__app_session_id', id);
    }
    return id;
  } catch {
    return '';
  }
}

let installed = false;
let inFlight = 0;
const MAX_IN_FLIGHT = 5;

export function reportClientError(payload: ReportPayload): void {
  if (typeof window === 'undefined') return;
  if (inFlight >= MAX_IN_FLIGHT) return;
  inFlight += 1;
  try {
    const body = JSON.stringify({
      source: SOURCE,
      sessionId: sessionId(),
      level: payload.level || 'error',
      type: payload.type || 'client_error',
      message: payload.message?.slice(0, 2000),
      stack: payload.stack?.slice(0, 8000),
      page: payload.page || (typeof location !== 'undefined' ? location.pathname : undefined),
      eventName: payload.eventName,
      metadata: mask(payload.metadata)
    });
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(`${API_ENDPOINT}/logs/client-error`, blob);
      inFlight -= 1;
      return;
    }
    fetch(`${API_ENDPOINT}/logs/client-error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true
    })
      .catch(() => {
        /* fail silently */
      })
      .finally(() => {
        inFlight -= 1;
      });
  } catch {
    inFlight -= 1;
  }
}

export function installGlobalErrorReporter() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  window.addEventListener('error', (e) => {
    reportClientError({
      message: e.message || 'window.onerror',
      stack: e.error?.stack,
      metadata: {
        filename: (e as any).filename,
        lineno: (e as any).lineno,
        colno: (e as any).colno
      }
    });
  });

  window.addEventListener('unhandledrejection', (e) => {
    const reason: any = e.reason;
    reportClientError({
      message: reason?.message || String(reason) || 'unhandledrejection',
      stack: reason?.stack,
      metadata: { kind: 'unhandledrejection' }
    });
  });
}

export function logUserAction(eventName: string, metadata?: Record<string, any>) {
  reportClientError({ level: 'info', type: 'user_action', eventName, metadata });
}
