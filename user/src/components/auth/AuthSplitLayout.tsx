import React from 'react';
import { Sparkles } from 'lucide-react';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
}

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ──── Left Panel: Animated Gradient ──── */}
      <div
        className="relative w-full lg:w-[45%] min-h-[240px] md:min-h-[300px] lg:min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        {/* Animated decorative shapes */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full animate-float"
          style={{
            top: '-15%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)'
          }}
          aria-hidden
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full animate-float"
          style={{
            bottom: '-10%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
            animationDelay: '2s'
          }}
          aria-hidden
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)'
          }}
          aria-hidden
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
          aria-hidden
        />

        {/* Content */}
        <div className="relative z-10 px-6 sm:px-8 py-10 lg:py-16 text-center max-w-md animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mb-6 backdrop-blur-sm animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Chào mừng bạn
          </h1>
          <p className="mt-4 text-base lg:text-lg text-white/80 leading-relaxed">
            Đăng nhập hoặc tạo tài khoản để sử dụng đầy đủ tính năng của nền tảng.
          </p>

          {/* Decorative dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-400/60" />
            <span className="w-8 h-2 rounded-full bg-primary-400/80" />
            <span className="w-2 h-2 rounded-full bg-primary-400/60" />
          </div>
        </div>
      </div>

      {/* ──── Right Panel: Form ──── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-5 sm:px-8 py-8 md:py-12">
        <div
          className="w-full max-w-[420px] animate-fade-in-up"
          style={{ animationDelay: '0.15s' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
