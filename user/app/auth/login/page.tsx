'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from '@lib/toast';
import { authService } from '@services/auth.service';
import { settingService } from '@services/setting.service';
import { useCurrentUserStore } from 'src/stores';
import { AuthSplitLayout, AuthInput, GoogleSignInButton } from '@components/auth';
import type { PublicAuthSettings } from '@services/setting.service';

export default function LoginPage() {
  const router = useRouter();
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authSettings, setAuthSettings] = useState<PublicAuthSettings | null>(null);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });

  useEffect(() => {
    settingService
      .getPublicAuth()
      .then(setAuthSettings)
      .catch(() => setAuthSettings(null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const value = formData.emailOrUsername.trim();
    const isEmail = value.includes('@');
    const payload = isEmail
      ? { email: value, password: formData.password }
      : { username: value, password: formData.password };

    try {
      const data = await authService.login(payload);
      if (data?.token) {
        setCurrentUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          username: data.username,
          role: data.role,
          status: 'active',
          createdAt: '',
          updatedAt: ''
        });
        toast.success('Đăng nhập thành công');
        router.push('/');
      } else {
        toast.error('Email/username hoặc mật khẩu không đúng');
      }
    } catch {
      toast.error('Email/username hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Đăng nhập
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Nhập email hoặc tên đăng nhập và mật khẩu để tiếp tục.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="opacity-0 animate-fade-in-up stagger-1">
            <AuthInput
              id="login-email-or-username"
              label="Email hoặc tên đăng nhập"
              type="text"
              autoComplete="username"
              placeholder="you@example.com hoặc username"
              value={formData.emailOrUsername}
              onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />
          </div>

          <div className="opacity-0 animate-fade-in-up stagger-2">
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-slate-700 mb-1.5 tracking-tight"
            >
              Mật khẩu
            </label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="glass-input w-full pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="mt-2 flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div className="opacity-0 animate-fade-in-up stagger-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full loading-spinner" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Google Login */}
        {authSettings?.enable_google_login && authSettings?.google_oauth_client_id && (
          <div className="opacity-0 animate-fade-in-up stagger-4">
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  hoặc
                </span>
              </div>
            </div>

            <GoogleSignInButton
              clientId={authSettings.google_oauth_client_id}
              label="Đăng nhập bằng Google"
              disabled={googleLoading}
              onSuccess={async (idToken) => {
                setGoogleLoading(true);
                try {
                  const data = await authService.loginWithGoogle(idToken);
                  if (data?.token) {
                    setCurrentUser({
                      _id: data._id,
                      name: data.name,
                      email: data.email,
                      username: data.username,
                      role: data.role,
                      status: 'active',
                      createdAt: '',
                      updatedAt: ''
                    });
                    toast.success('Đăng nhập thành công');
                    router.push('/');
                  }
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : 'Đăng nhập Google thất bại');
                } finally {
                  setGoogleLoading(false);
                }
              }}
              onError={() => toast.error('Không thể tải Google Sign-In')}
            />
          </div>
        )}

        {/* Register link */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Chưa có tài khoản?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
