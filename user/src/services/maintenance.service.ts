import { apiRequest } from './api-request';

export interface MaintenanceStatus {
  enabled: boolean;
  message: string;
  isAllowedIp: boolean;
}

class MaintenanceService {
  async getStatus(): Promise<MaintenanceStatus> {
    try {
      const res = await apiRequest.get('/settings/public/maintenance');
      return (res as any)?.data ?? res;
    } catch {
      // Fail open: if API unreachable, assume maintenance is off
      return { enabled: false, message: '', isAllowedIp: true };
    }
  }
}

export const maintenanceService = new MaintenanceService();
