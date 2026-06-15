'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@services/auth.service';
import { useCurrentUserStore, usePublicSiteSettingsStore } from 'src/stores';
import { LazyHydrate } from '@components/common';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@components/ui';
import { Menu, X, Home, Settings, LogOut, ChevronDown, User } from 'lucide-react';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const USER_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');

function resolveUrl(url: string) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${USER_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, clearCurrentUser } = useCurrentUserStore();
  const { site_name, site_logo } = usePublicSiteSettingsStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Track scroll for sticky header shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      clearCurrentUser();
      router.push('/auth/login');
    }
  };

  const navLinks = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/user/settings', label: 'Cài đặt', icon: Settings }
  ];

  const userInitial = currentUser?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-surface)' }}>
      {/* ──── Header ──── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-nav shadow-glass' : 'glass-nav'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              {site_logo ? (
                <img
                  src={resolveUrl(site_logo)}
                  alt=""
                  className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  B
                </div>
              )}
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                {site_name || 'Base Code'}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* User dropdown (desktop) */}
              {currentUser ? (
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-primary-glow"
                          style={{ background: 'var(--gradient-primary)' }}
                        >
                          {userInitial}
                        </div>
                        <span className="text-slate-700 font-medium max-w-[120px] truncate">
                          {currentUser?.name || currentUser?.email}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Đăng nhập bởi</p>
                        <p className="text-sm text-slate-700 font-semibold truncate">
                          {currentUser?.email}
                        </p>
                      </div>
                      <DropdownMenuItem
                        onSelect={() => router.push('/user/settings')}
                        className="gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Cài đặt
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700"
                        onSelect={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link href="/auth/register" className="gradient-btn px-4 py-2 text-sm">
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              >
                {menuOpen ? (
                  <X className="w-5 h-5 text-slate-700" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ──── Mobile Menu Drawer ──── */}
        {menuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-slate-100 animate-drawer-in"
          >
            <div className="px-4 py-3 space-y-1" style={{ background: 'rgba(255,255,255,0.95)' }}>
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}

              {currentUser ? (
                <>
                  <div className="border-t border-slate-100 my-2" />
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      {userInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-slate-100 my-2" />
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center justify-center gap-2 mx-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-btn"
                    onClick={() => setMenuOpen(false)}
                  >
                    Đăng ký miễn phí
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ──── Main Content ──── */}
      <main className="flex-1">
        <LazyHydrate whenIdle>
          <div>{children}</div>
        </LazyHydrate>
      </main>

      {/* ──── Footer ──── */}
      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'var(--gradient-primary)' }}
              >
                B
              </div>
              <span className="text-sm text-slate-500">
                © {new Date().getFullYear()} {site_name || 'Base Code'}. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/terms"
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Điều khoản
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Bảo mật
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
