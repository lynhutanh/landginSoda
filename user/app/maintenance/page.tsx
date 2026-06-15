'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { maintenanceService } from '@services/maintenance.service';

export default function MaintenancePage() {
  const router = useRouter();
  const [message, setMessage] = useState(
    'Hệ thống đang trong quá trình bảo trì. Vui lòng quay lại sau.'
  );
  const [checking, setChecking] = useState(false);

  const checkAndRedirect = async () => {
    setChecking(true);
    try {
      const status = await maintenanceService.getStatus();
      if (!status.enabled || status.isAllowedIp) {
        router.replace('/');
      } else {
        setMessage(status.message || message);
      }
    } catch {
      // stay on maintenance page
    } finally {
      setChecking(false);
    }
  };

  // Poll every 30s as fallback (realtime via socket is primary)
  useEffect(() => {
    const interval = setInterval(checkAndRedirect, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-orange-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <ShieldAlert className="h-10 w-10" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đang bảo trì</h1>
          <p className="mt-3 text-slate-500 leading-relaxed">{message}</p>
        </div>

        <button
          type="button"
          onClick={checkAndRedirect}
          disabled={checking}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
        </button>
      </div>
    </div>
  );
}
