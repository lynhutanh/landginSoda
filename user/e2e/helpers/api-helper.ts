import { APIRequestContext } from '@playwright/test';

const BACKEND_URL = 'http://localhost:5001';

/**
 * Helper to interact with the backend API to seed and cleanup test data.
 */
export class ApiHelper {
  private requestContext: APIRequestContext;
  private adminToken: string | null = null;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
  }

  /**
   * Log in as default admin and retrieve token.
   */
  async getAdminToken(): Promise<string> {
    if (this.adminToken) return this.adminToken;

    const response = await this.requestContext.post(`${BACKEND_URL}/auth/admin/login`, {
      data: {
        username: 'admin',
        password: 'adminadmin',
      },
    });

    if (!response.ok()) {
      throw new Error(`Failed to log in as admin: ${response.status()} - ${response.statusText()}`);
    }

    const body = (await response.json()) as any;
    const data = body.data || body;
    this.adminToken = data.token;
    return this.adminToken!;
  }

  /**
   * Get login token for a custom user.
   */
  async getUserToken(usernameOrEmail: string, password: string): Promise<string> {
    const isEmail = usernameOrEmail.includes('@');
    const payload = isEmail
      ? { email: usernameOrEmail, password }
      : { username: usernameOrEmail, password };

    const response = await this.requestContext.post(`${BACKEND_URL}/auth/login`, {
      data: payload,
    });

    if (!response.ok()) {
      throw new Error(`Failed to log in as user ${usernameOrEmail}: ${response.status()} - ${response.statusText()}`);
    }

    const body = (await response.json()) as any;
    const data = body.data || body;
    return data.token;
  }

  /**
   * Seed a new user.
   */
  async createTestUser(payload: {
    name: string;
    username: string;
    email: string;
    password?: string;
  }): Promise<any> {
    const token = await this.getAdminToken();
    const response = await this.requestContext.post(`${BACKEND_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        ...payload,
        password: payload.password || 'Password123!',
        role: 'user',
        status: 'active',
      },
    });

    if (!response.ok()) {
      const text = await response.text();
      throw new Error(`Failed to create test user: ${response.status()} - ${text}`);
    }

    const body = (await response.json()) as any;
    return body.data || body;
  }

  /**
   * Delete user by ID.
   */
  async deleteUser(userId: string): Promise<void> {
    const token = await this.getAdminToken();
    const response = await this.requestContext.delete(`${BACKEND_URL}/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok() && response.status() !== 404) {
      throw new Error(`Failed to delete user ${userId}: ${response.statusText()}`);
    }
  }

  /**
   * Purges all users whose username or email starts with 'e2e_test'.
   */
  async cleanupTestUsers(): Promise<void> {
    try {
      const token = await this.getAdminToken();
      const response = await this.requestContext.get(`${BACKEND_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: '1',
          limit: '100',
          q: 'e2e_test',
        },
      });

      if (!response.ok()) return;

      const body = (await response.json()) as any;
      const usersData = body.data?.data || body.data?.users || body.data;
      const users = (Array.isArray(usersData) ? usersData : []) as any[];
      for (const user of users) {
        if (user.username?.startsWith('e2e_test') || user.email?.startsWith('e2e_test')) {
          await this.deleteUser(user._id);
        }
      }
    } catch (e) {
      console.warn('E2E cleanup warn: logs cleanup failed', e);
    }
  }

  /**
   * Toggles the system maintenance mode programmatically.
   */
  async toggleMaintenance(enabled: boolean): Promise<void> {
    const token = await this.getAdminToken();
    
    // First, verify current maintenance status
    const currentResponse = await this.requestContext.get(`${BACKEND_URL}/admin/maintenance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!currentResponse.ok()) {
      throw new Error(`Failed to fetch current maintenance setting: ${currentResponse.status()}`);
    }
    
    const body = (await currentResponse.json()) as any;
    const setting = body.data || body;
    const currentEnabled = setting.enabled;
    
    if (currentEnabled !== enabled) {
      // Toggle
      const toggleResponse = await this.requestContext.put(`${BACKEND_URL}/admin/maintenance/toggle`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!toggleResponse.ok()) {
        throw new Error(`Failed to toggle maintenance: ${toggleResponse.status()}`);
      }
    }
  }
}
