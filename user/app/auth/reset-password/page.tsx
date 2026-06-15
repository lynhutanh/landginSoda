'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { authService } from '@services/auth.service';
import { AuthSplitLayout } from '@components/auth';

// ── Password strength ─────────────────────────────────────────────────────────

interface StrengthLevel {
  label: string;
  color: string;
  barColor: string;
  score: number;
}

function getPasswordStrength(password: string): StrengthLevel {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1)
    return { label: 'Rất yếu', color: 'text-red-500', barColor: 'bg-red-500', score: 1 };
  if (score === 2)
    return { label: 'Yếu', color: 'text-orange-500', barColor: 'bg-orange-500', score: 2 };
  if (score === 3)
    return { label: 'Trung bình', color: 'text-amber-500', barColor: 'bg-amber-500', score: 3 };
  if (score === 4)
    return { label: 'Mạnh', color: 'text-emerald-500', barColor: 'bg-emerald-500', score: 4 };
  return { label: 'Rất mạnh', color: 'text-emerald-600', barColor: 'bg-emerald-600', score: 5 };
}

// ── Main page ─────────────────────────────────────────────────────────────────

type TokenState = 'verifying' | 'valid' | 'invalid' | 'expired' | 'used';
type FormState = 'idle' | 'loading' | 'success' | 'error';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [tokenState, setTokenState] = useState<TokenState>('verifying');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState('');

  const strength = getPasswordStrength(newPassword);

  // Verify token on mount
  const verifyToken = useCallback(async () => {
    if (!token) {
      setTokenState('invalid');
      return;
    }
    try {
      await authService.verifyResetToken(token);
      setTokenState('valid');
    } catch (err) {
      const message = err instanceof Error ? err.message.toLowerCase() : '';
      if (message.includes('đã được sử dụng') || message.includes('used')) {
        setTokenState('used');
      } else if (message.includes('hết hạn') || message.includes('expired')) {
        setTokenState('expired');
      } else {
        setTokenState('invalid');
      }
    }
  }, [token]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (newPassword !== confirmPassword) {
      setValidationError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (strength.score < 2) {
      setValidationError('Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.');
      return;
    }

    setFormState('loading');
    try {
      await authService.resetPassword(token, newPassword);
      setFormState('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
      setErrorMessage(message);
      setFormState('error');

      // Nếu token hết hạn/đã dùng trong khi submit → cập nhật token state
      if (message.toLowerCase().includes('hết hạn')) setTokenState('expired');
      if (message.toLowerCase().includes('đã được sử dụng')) setTokenState('used');
    }
  };

  // ── Loading / Verifying state
  if (tokenState === 'verifying') {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
          <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full loading-spinner" />
        </div>
        <h2 className="text-lg font-semibold text-slate-700">Đang xác thực...</h2>
        <p className="text-sm text-slate-400 mt-1">Vui lòng chờ trong giây lát</p>
      </div>
    );
  }

  // ── Invalid / Expired / Used token states
  const tokenErrorConfig: Record<
    Exclude<TokenState, 'verifying' | 'valid'>,
    {
      icon: React.ReactNode;
      title: string;
      description: string;
      cta?: React.ReactNode;
    }
  > = {
    invalid: {
      icon: <AlertCircle className="w-8 h-8 text-red-500" />,
      title: 'Link không hợp lệ',
      description:
        'Link đặt lại mật khẩu này không hợp lệ hoặc đã bị xoá. Vui lòng yêu cầu gửi lại.'
    },
    expired: {
      icon: <AlertCircle className="w-8 h-8 text-amber-500" />,
      title: 'Link đã hết hạn',
      description: 'Link đặt lại mật khẩu đã hết hạn (hiệu lực 15 phút). Vui lòng yêu cầu gửi lại.'
    },
    used: {
      icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
      title: 'Link đã được sử dụng',
      description:
        'Mật khẩu của bạn đã được thay đổi thành công bằng link này. Bạn có thể đăng nhập ngay.'
    }
  };

  if (tokenState !== 'valid') {
    const cfg = tokenErrorConfig[tokenState];
    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
          {cfg.icon}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">{cfg.title}</h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">{cfg.description}</p>
        <Link
          href="/auth/forgot-password"
          className="gradient-btn w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
        >
          Yêu cầu đặt lại mật khẩu mới
          <ArrowRight className="w-4 h-4" />
        </Link>
        {tokenState === 'used' && (
          <Link
            href="/auth/login"
            className="mt-3 w-full py-3 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    );
  }

  // ── Success state
  if (formState === 'success') {
    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
          Đổi mật khẩu thành công!
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          Mật khẩu của bạn đã được cập nhật. Tất cả phiên đăng nhập cũ đã bị thu hồi. Vui lòng đăng
          nhập lại bằng mật khẩu mới.
        </p>
        <button
          type="button"
          onClick={() => router.push('/auth/login')}
          className="gradient-btn w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
        >
          Đăng nhập ngay
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ── Form state (valid token)
  return (
    <div>
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Quay lại đăng nhập
      </Link>

      <div className="mb-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 mb-5">
          <Lock className="w-7 h-7 text-indigo-500" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Đặt mật khẩu mới
        </h1>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Tạo mật khẩu mạnh cho tài khoản của bạn.
        </p>
      </div>

      {/* Error message */}
      {formState === 'error' && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 animate-fade-in-up">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New password */}
        <div className="opacity-0 animate-fade-in-up stagger-1">
          <label
            htmlFor="reset-new-password"
            className="block text-sm font-semibold text-slate-700 mb-1.5 tracking-tight"
          >
            Mật khẩu mới
          </label>
          <div className="relative group">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500">
              <Lock className="w-5 h-5" />
            </span>
            <input
              id="reset-new-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Tối thiểu 8 ký tự, có chữ và số"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="glass-input w-full pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
              required
              disabled={formState === 'loading'}
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

          {/* Strength indicator */}
          {newPassword && (
            <div className="mt-2 animate-fade-in-up">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.score ? strength.barColor : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs font-semibold ${strength.color}`}>{strength.label}</p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="opacity-0 animate-fade-in-up stagger-2">
          <label
            htmlFor="reset-confirm-password"
            className="block text-sm font-semibold text-slate-700 mb-1.5 tracking-tight"
          >
            Xác nhận mật khẩu
          </label>
          <div className="relative group">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500">
              <Lock className="w-5 h-5" />
            </span>
            <input
              id="reset-confirm-password"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`glass-input w-full pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium ${
                validationError ? '!border-red-400 !shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : ''
              } ${confirmPassword && confirmPassword === newPassword ? '!border-emerald-400' : ''}`}
              required
              disabled={formState === 'loading'}
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
          {validationError && (
            <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {validationError}
            </p>
          )}
        </div>

        <div className="opacity-0 animate-fade-in-up stagger-3 pt-1">
          <button
            type="submit"
            disabled={formState === 'loading' || !newPassword || !confirmPassword}
            className="gradient-btn w-full py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formState === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full loading-spinner" />
                Đang cập nhật...
              </>
            ) : (
              <>
                Đặt mật khẩu mới
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout>
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-2 border-indigo-300 border-t-indigo-600 rounded-full loading-spinner" />
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </AuthSplitLayout>
  );
}
