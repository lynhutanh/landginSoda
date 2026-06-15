'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import SocketIO from 'socket.io-client';
import { authService } from '@services/auth.service';
import { maintenanceService } from '@services/maintenance.service';

export function MaintenanceProvider() {
  const router = useRouter();
  const pathname = usePathname();
  // Use a ref so the socket handler always sees the latest pathname without reconnecting
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_ENDPOINT ||
      process.env.NEXT_PUBLIC_API_ENDPOINT ||
      'http://localhost:5001';

    const token = authService.getToken();
    const socket = SocketIO(socketUrl, {
      auth: token ? { token } : {},
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 15000,
      transports: ['websocket', 'polling']
    });

    const handleMaintenanceUpdate = async () => {
      try {
        const status = await maintenanceService.getStatus();
        const isOnMaintenancePage = pathnameRef.current === '/maintenance';

        if (status.enabled && !status.isAllowedIp) {
          if (!isOnMaintenancePage) {
            router.push('/maintenance');
          }
        } else if (isOnMaintenancePage) {
          router.replace('/');
        }
      } catch {
        // Fail open
      }
    };

    socket.on('maintenance:update', handleMaintenanceUpdate);

    return () => {
      socket.off('maintenance:update', handleMaintenanceUpdate);
      socket.disconnect();
    };
  }, []); // Connect once on mount

  return null;
}

export default MaintenanceProvider;
