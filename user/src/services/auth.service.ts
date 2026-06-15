import Cookies from 'js-cookie';
import { ILoginPayload, IRegisterPayload } from '@interfaces/auth';
import { apiRequest, TOKEN_KEY } from './api-request';

function getTokenCookieOptions() {
  return {
    expires: 1,
    sameSite: 'strict' as const,
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
    path: '/'
  };
}

export interface IAuthResponse {
  _id: string;
  name: string;
  email: string;
  username?: string;
  role: string;
  token: string;
}

function unwrapAuthPayload(body: unknown): IAuthResponse | undefined {
  if (!body || typeof body !== 'object') return undefined;
  const o = body as { data?: IAuthResponse };
  return o.data ?? (body as IAuthResponse);
}

function unwrapData<T>(body: unknown): T {
  if (!body || typeof body !== 'object') return body as T;
  const o = body as { data?: T };
  return (o.data ?? body) as T;
}

class AuthService {
  async login(payload: ILoginPayload): Promise<IAuthResponse> {
    const response = await apiRequest.post<unknown, unknown>('/auth/login', payload);
    const data = unwrapAuthPayload(response);
    if (data?.token) {
      Cookies.set(TOKEN_KEY, data.token, getTokenCookieOptions());
    }
    return data as IAuthResponse;
  }

  async register(payload: IRegisterPayload): Promise<IAuthResponse> {
    const response = await apiRequest.post<unknown, unknown>('/auth/register', payload);
    const data = unwrapAuthPayload(response);
    if (data?.token) {
      Cookies.set(TOKEN_KEY, data.token, getTokenCookieOptions());
    }
    return data as IAuthResponse;
  }

  async loginWithGoogle(idToken: string): Promise<IAuthResponse> {
    const response = await apiRequest.post<unknown, unknown>('/auth/google', { idToken });
    const data = unwrapAuthPayload(response);
    if (data?.token) {
      Cookies.set(TOKEN_KEY, data.token, getTokenCookieOptions());
    }
    return data as IAuthResponse;
  }

  async logout(): Promise<void> {
    try {
      await apiRequest.post('/auth/logout');
    } finally {
      Cookies.remove(TOKEN_KEY, { path: '/' });
    }
  }

  async me(): Promise<any> {
    return apiRequest.get('/auth/me');
  }

  getToken(): string | null {
    return Cookies.get(TOKEN_KEY) || null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ─── Forgot / Reset Password ─────────────────────────────────────────────

  async forgotPassword(identity: string): Promise<{ message: string }> {
    const response = await apiRequest.post<unknown, unknown>('/auth/forgot-password', { identity });
    return unwrapData<{ message: string }>(response);
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean }> {
    const response = await apiRequest.get<unknown>(
      `/auth/reset-password/verify?token=${encodeURIComponent(token)}`
    );
    return unwrapData<{ valid: boolean }>(response);
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiRequest.post<unknown, unknown>('/auth/reset-password', {
      token,
      newPassword
    });
    return unwrapData<{ message: string }>(response);
  }
}

export const authService = new AuthService();
