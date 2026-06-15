'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, ArrowRight, UserX } from 'lucide-react';
import { authService } from '@services/auth.service';
import { AuthSplitLayout, AuthInput } from '@components/auth';

type PageState = 'idle' | 'loading' | 'success' | 'not-found' | 'rate-limit' | 'error';

export default function ForgotPasswordPage() {
  const [identity, setIdentity] = useState('');
  const [pageState, setPageState] = useState<PageState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.trim()) return;

    setPageState('loading');
    setErrorMessage('');

    try {
      await authService.forgotPassword(identity.trim());
      setPageState('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra';

      if (message.includes('không tồn tại')) {
        setPageState('not-found');
      } else if (message.includes('Quá nhiều') || message.includes('429')) {
        setErrorMessage(message);
        setPageState('rate-limit');
      } else if (message.includes('Google')) {
        setErrorMessage(message);
        setPageState('error');
      } else {
        setErrorMessage(message);
        setPageState('error');
      }
    }
  };

  return (
    <AuthSplitLayout>
      <div>
        {/* ── Success state ── */}
        {pageState === 'success' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
              Email đã được gửi!
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Chúng tôi đã gửi link đặt lại mật khẩu đến email của tài khoản{' '}
              <span className="font-semibold text-slate-700">&ldquo;{identity}&rdquo;</span>.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
              <p className="text-xs text-amber-700 leading-relaxed">
                ⏱️ Link sẽ hết hạn sau <span className="font-bold">15 phút</span>. Kiểm tra cả thư
                mục Spam nếu không thấy email.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPageState('idle');
                setIdentity('');
              }}
              className="w-full py-3 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Gửi lại email
            </button>
            <p className="mt-4 text-center text-sm text-slate-400">
              <Link
                href="/auth/login"
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                Quay lại đăng nhập
              </Link>
            </p>
          </div>
        )}

        {/* ── Account not found state ── */}
        {pageState === 'not-found' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 border border-red-200 mb-6">
              <UserX className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
              Tài khoản không tồn tại
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-2">
              Không tìm thấy tài khoản với email hoặc tên đăng nhập{' '}
              <span className="font-semibold text-slate-700">&ldquo;{identity}&rdquo;</span>.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.
            </p>
            <button
              type="button"
              onClick={() => setPageState('idle')}
              className="gradient-btn w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mb-3"
            >
              Thử lại
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/auth/register"
              className="w-full py-3 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center"
            >
              Đăng ký tài khoản mới
            </Link>
          </div>
        )}

        {/* ── Rate limit / Generic error state ── */}
        {(pageState === 'rate-limit' || pageState === 'error') && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 mb-6">
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
              {pageState === 'rate-limit' ? 'Quá nhiều yêu cầu' : 'Không thể gửi email'}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setPageState('idle')}
              className="w-full py-3 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* ── Form state (idle + loading) ── */}
        {(pageState === 'idle' || pageState === 'loading') && (
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
                <Mail className="w-7 h-7 text-indigo-500" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Quên mật khẩu?
              </h1>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Nhập email hoặc tên đăng nhập. Chúng tôi sẽ gửi link đặt lại mật khẩu đến email của
                tài khoản.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="opacity-0 animate-fade-in-up stagger-1">
                <AuthInput
                  id="forgot-password-identity"
                  label="Email hoặc tên đăng nhập"
                  type="text"
                  autoComplete="username"
                  placeholder="you@example.com hoặc username"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  leftIcon={<Mail className="w-5 h-5" />}
                  required
                  disabled={pageState === 'loading'}
                />
              </div>

              <div className="opacity-0 animate-fade-in-up stagger-2 pt-1">
                <button
                  type="submit"
                  disabled={pageState === 'loading' || !identity.trim()}
                  className="gradient-btn w-full py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pageState === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full loading-spinner" />
                      Đang kiểm tra...
                    </>
                  ) : (
                    <>
                      Gửi link đặt lại mật khẩu
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Nhớ mật khẩu rồi?{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        )}
      </div>
    </AuthSplitLayout>
  );
}
