import { NextRequest, NextResponse } from 'next/server';

const EXCLUDED_PREFIXES = ['/_next', '/favicon', '/maintenance', '/api/', '/logo'];

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isExcluded(pathname)) {
    return NextResponse.next();
  }

  const apiBase =
    process.env.API_SERVER_ENDPOINT ||
    process.env.NEXT_PUBLIC_API_ENDPOINT ||
    'http://localhost:5001';

  try {
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '127.0.0.1';

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    let res: Response;
    try {
      res = await fetch(`${apiBase}/settings/public/maintenance`, {
        headers: {
          'x-forwarded-for': clientIp,
          'x-real-ip': clientIp,
          'cache-control': 'no-store'
        },
        signal: controller.signal
      });
    } finally {
      clearTimeout(timer);
    }

    if (res.ok) {
      const json = (await res.json()) as any;
      const data = json?.data ?? json;
      const { enabled, isAllowedIp } = data as { enabled: boolean; isAllowedIp: boolean };

      if (enabled && !isAllowedIp) {
        const url = request.nextUrl.clone();
        url.pathname = '/maintenance';
        return NextResponse.redirect(url);
      }
    }
  } catch {
    // Fail open: API unavailable -> allow access.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|maintenance|api/).*)']
};
