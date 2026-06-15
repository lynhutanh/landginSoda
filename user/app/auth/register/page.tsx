'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from '@lib/toast';
import { authService } from '@services/auth.service';
import { settingService } from '@services/setting.service';
import { useCurrentUserStore } from 'src/stores';
import { AuthSplitLayout, AuthInput, GoogleSignInButton } from '@components/auth';
import type { PublicAuthSettings } from '@services/setting.service';

export default function RegisterPage() {
  const router = useRouter();
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [authSettings, setAuthSettings] = useState<PublicAuthSettings | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    settingService
      .getPublicAuth()
      .then(setAuthSettings)
      .catch(() => setAuthSettings(null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    try {
      const data = await authService.register({
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
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
        toast.success('Đăng ký thành công');
        router.push('/');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  /* Simple password strength indicator */
  const getPasswordStrength = () => {
    const pw = formData.password;
    if (!pw) return { level: 0, text: '', color: '' };
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    if (score <= 2) return { level: score, text: 'Yếu', color: 'bg-red-400' };
    if (score <= 3) return { level: score, text: 'Trung bình', color: 'bg-amber-400' };
    return { level: score, text: 'Mạnh', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength();

  return (
    <AuthSplitLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Tạo tài khoản
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Điền thông tin bên dưới để bắt đầu sử dụng dịch vụ.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="opacity-0 animate-fade-in-up stagger-1">
            <AuthInput
              id="reg-name"
              label="Họ và tên"
              type="text"
              autoComplete="name"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              leftIcon={<User className="w-5 h-5" />}
              required
            />
          </div>

          <div className="opacity-0 animate-fade-in-up stagger-2">
            <AuthInput
              id="reg-username"
              label="Tên đăng nhập"
              type="text"
              autoComplete="username"
              placeholder="ten_dang_nhap"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              leftIcon={<User className="w-5 h-5" />}
              minLength={3}
              maxLength={30}
              pattern="^[a-zA-Z0-9_]+$"
              required
            />
          </div>

          <div className="opacity-0 animate-fade-in-up stagger-3">
            <AuthInput
              id="reg-email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />
          </div>

          <div className="opacity-0 animate-fade-in-up stagger-4">
            <label
              htmlFor="reg-password"
              className="block text-sm font-semibold text-slate-700 mb-1.5 tracking-tight"
            >
              Mật khẩu
            </label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="glass-input w-full pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                minLength={6}
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
            {/* Password strength indicator */}
            {formData.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= strength.level ? strength.color : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-500">{strength.text}</span>
              </div>
            )}
          </div>

          <div className="opacity-0 animate-fade-in-up stagger-5">
            <label
              htmlFor="reg-confirm"
              className="block text-sm font-semibold text-slate-700 mb-1.5 tracking-tight"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                id="reg-confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="glass-input w-full pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full loading-spinner" />
                  Đang tạo tài khoản...
                </>
              ) : (
                <>
                  Đăng ký
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Google Sign Up */}
        {authSettings?.enable_google_login && authSettings?.google_oauth_client_id && (
          <>
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
              label="Đăng ký bằng Google"
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
                    toast.success('Đăng ký thành công');
                    router.push('/');
                  }
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : 'Đăng ký Google thất bại');
                } finally {
                  setGoogleLoading(false);
                }
              }}
              onError={() => toast.error('Không thể tải Google Sign-In')}
            />
          </>
        )}

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
          Bằng việc đăng ký, bạn đồng ý với{' '}
          <Link href="/terms" className="font-semibold text-primary-600 hover:text-primary-700">
            Điều khoản dịch vụ
          </Link>{' '}
          và{' '}
          <Link href="/privacy" className="font-semibold text-primary-600 hover:text-primary-700">
            Chính sách bảo mật
          </Link>
          .
        </p>

        {/* Login link */}
        <p className="mt-5 text-center text-sm text-slate-500">
          Đã có tài khoản?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
