'use client';

import React, { Suspense, useCallback, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { SWRConfig } from 'swr';

import DefaultLayout from '@layouts/DefaultLayout';
import SiteSettingsHead from '@components/SiteSettingsHead';
import { authService } from '@services/auth.service';
import { useCurrentUserStore } from 'src/stores';
import { MaintenanceProvider } from 'src/components/MaintenanceProvider';
import { AppErrorBoundary } from '@components/common';
import { installGlobalErrorReporter } from '@lib/client-error-reporter';
import { LenisProvider } from 'src/components/common/LenisProvider';

const Toasty = dynamic(() => import('src/components/common/toasty'), {
  ssr: false,
  loading: () => null
});

/** Routes that do NOT require authentication */
const PUBLIC_ROUTES = ['/auth', '/'];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setCurrentUser, clearCurrentUser, setLoading } = useCurrentUserStore();

  const checkAuth = useCallback(async () => {
    const isPublic = isPublicRoute(pathname);
    const token = authService.getToken();

    if (!token) {
      clearCurrentUser();
      // Only redirect to login when accessing a PROTECTED route without token
      if (!isPublic) {
        router.push('/auth/login');
      }
      return;
    }

    try {
      const response = await authService.me();
      if (response?.data) {
        setCurrentUser(response.data);
      } else {
        clearCurrentUser();
        if (!isPublic) {
          router.push('/auth/login');
        }
      }
    } catch {
      clearCurrentUser();
      if (!isPublic) {
        router.push('/auth/login');
      }
    }
  }, [setCurrentUser, clearCurrentUser, router, pathname]);

  useEffect(() => {
    setLoading(true);
    checkAuth();
  }, [checkAuth, setLoading]);

  return children;
}

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, isLoading } = useCurrentUserStore();
  const isAuthPage = pathname.startsWith('/auth');
  const isHomePage = pathname === '/';
  const isMaintenancePage = pathname === '/maintenance';

  // Auth pages: render without layout
  // Home page when not logged in: render without layout (landing page)
  // Maintenance page: render without layout/header
  const shouldSkipLayout =
    isAuthPage || isMaintenancePage || (isHomePage && !isLoading && !currentUser);

  return (
    <>
      <SiteSettingsHead />
      <Toasty />
      <MaintenanceProvider />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-primary-50">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full" />
              <p className="text-sm text-slate-500 font-medium">Đang tải...</p>
            </div>
          </div>
        }
      >
        {shouldSkipLayout ? children : <DefaultLayout>{children}</DefaultLayout>}
      </Suspense>
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    installGlobalErrorReporter();
  }, []);

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'production' ||
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          const scriptUrl =
            registration.active?.scriptURL ||
            registration.installing?.scriptURL ||
            registration.waiting?.scriptURL ||
            '';
          if (scriptUrl.includes('/sw.js')) {
            registration.unregister();
          }
        });
      })
      .catch(() => undefined);
  }, []);

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: true
      }}
    >
      <LenisProvider>
        <AppErrorBoundary>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </AppErrorBoundary>
      </LenisProvider>
    </SWRConfig>
  );
}
