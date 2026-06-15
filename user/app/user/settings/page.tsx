'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Settings,
  Image as ImageIcon,
  Camera,
  Save,
  X as XIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import { useCurrentUserStore } from 'src/stores';
import { profileService, type IProfileUpdatePayload } from '@services/profile.service';
import { fileService } from '@services/file.service';
import { toast } from '@lib/toast';
import type { IUser } from '@interfaces/user';

const API_BASE =
  typeof window !== 'undefined'
    ? '/api-backend'
    : process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5001';

function resolveMediaUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}

function normalizeAvatarId(user: IUser | null): string {
  if (!user?.avatarId) return '';
  const v = user.avatarId as unknown;
  if (typeof v === 'string') return v;
  return String(v);
}

export default function UserSettingsPage() {
  const { currentUser, setCurrentUser, isLoading: authLoading } = useCurrentUserStore();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarId, setAvatarId] = useState('');
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) return;
    setName(currentUser.name ?? '');
    setUsername(currentUser.username ?? '');
    setEmail(currentUser.email ?? '');
    setPhone(currentUser.phone ?? '');
    setAvatarId(normalizeAvatarId(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (!avatarId) {
      setAvatarPreviewUrl(undefined);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = (await fileService.findById(avatarId)) as { data?: { url?: string } };
        const url = res?.data?.url;
        if (!cancelled && url) {
          setAvatarPreviewUrl(resolveMediaUrl(url));
        }
      } catch {
        if (!cancelled) {
          setAvatarPreviewUrl(undefined);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [avatarId]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }
    setUploadingAvatar(true);
    try {
      const res = (await fileService.upload(file, 'avatar')) as {
        data?: { _id?: string; url?: string };
        _id?: string;
        url?: string;
      };
      const data = res?.data ?? res;
      const idRaw = data?._id ?? (res as { _id?: string })?._id;
      const id = idRaw != null ? String(idRaw) : '';
      const url = data?.url ?? (res as { url?: string }).url;
      if (id) {
        setAvatarId(id);
        if (url) {
          setAvatarPreviewUrl(resolveMediaUrl(url));
        }
      } else {
        toast.error('Tải ảnh thất bại');
      }
    } catch {
      toast.error('Tải ảnh thất bại');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    try {
      const payload: IProfileUpdatePayload = {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatarId: avatarId.trim()
      };

      // Chỉ gửi mật khẩu nếu người dùng nhập
      if (password.trim().length > 0) {
        payload.password = password.trim();
      }

      const updated = await profileService.update(payload);
      setCurrentUser(updated as IUser);
      toast.success('Đã lưu thông tin');
      setPassword(''); // clear password after save
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    } finally {
      setSaving(false);
    }
  };

  const userInitial = currentUser?.name?.charAt(0)?.toUpperCase() || 'U';

  if (authLoading || !currentUser) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          <p className="text-sm text-slate-500 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-6 sm:py-8 lg:py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors mb-6 animate-fade-in-up"
        >
          <ArrowLeft className="h-4 w-4" />
          Về trang chủ
        </Link>

        {/* Page header */}
        <div className="flex items-start gap-4 mb-8 animate-fade-in-up stagger-1">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-primary-glow"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Settings className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Cài đặt tài khoản
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Cập nhật ảnh đại diện và thông tin cá nhân.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="glass-card p-6 sm:p-8 lg:p-10 shadow-glass-lg animate-fade-in-up stagger-2">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-6"
          >
            {/* ── Avatar ── */}
            <div className="lg:col-span-12">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Ảnh đại diện
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 hover:bg-slate-50 hover:border-primary-200 transition-colors">
                <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                  {avatarPreviewUrl ? (
                    <>
                      <div className="relative group shrink-0">
                        <img
                          src={avatarPreviewUrl}
                          alt=""
                          className="h-20 w-20 rounded-2xl border border-slate-200 object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Hover overlay */}
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          aria-label="Đổi ảnh"
                        >
                          <Camera className="w-5 h-5 text-white" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          disabled={uploadingAvatar}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow disabled:opacity-50"
                        >
                          {uploadingAvatar ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full loading-spinner mr-2" />
                              Đang tải...
                            </>
                          ) : (
                            'Đổi ảnh khác'
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarId('');
                            setAvatarPreviewUrl(undefined);
                          }}
                          className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-all hover:bg-red-50 hover:shadow"
                        >
                          <XIcon className="w-3.5 h-3.5 mr-1.5" />
                          Xóa ảnh
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-transparent bg-white py-8 text-sm text-slate-600 transition-all hover:border-primary-300 hover:bg-primary-50/50 hover:shadow-sm disabled:opacity-50 sm:flex-row sm:py-6"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                        <ImageIcon className="h-6 w-6" aria-hidden />
                      </span>
                      <div className="text-center sm:text-left">
                        <span className="block font-semibold text-slate-700">
                          {uploadingAvatar ? 'Đang tải...' : 'Chọn ảnh đại diện'}
                        </span>
                        <span className="text-xs text-slate-400">JPG, PNG. Tối đa 5MB</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Name ── */}
            <div className="lg:col-span-6">
              <label
                htmlFor="settings-name"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Họ và tên
              </label>
              <input
                id="settings-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input w-full py-2.5 px-3.5 text-sm text-slate-900 outline-none font-medium"
                required
              />
            </div>

            {/* ── Username ── */}
            <div className="lg:col-span-6">
              <label
                htmlFor="settings-username"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Tên đăng nhập
              </label>
              <input
                id="settings-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-input w-full py-2.5 px-3.5 text-sm text-slate-900 outline-none font-medium"
                placeholder="a-z, 0-9, _"
                required
                minLength={3}
                maxLength={30}
              />
            </div>

            {/* ── Password ── */}
            <div className="lg:col-span-12">
              <label
                htmlFor="settings-password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Mật khẩu mới (Bỏ trống nếu không đổi)
              </label>
              <div className="relative group">
                <input
                  id="settings-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full py-2.5 pl-3.5 pr-11 text-sm text-slate-900 outline-none font-medium"
                  placeholder="Nhập ít nhất 6 ký tự"
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* ── Email ── */}
            <div className="lg:col-span-12">
              <label
                htmlFor="settings-email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full py-2.5 px-3.5 text-sm text-slate-900 outline-none font-medium"
                required
              />
            </div>

            {/* ── Phone ── */}
            <div className="lg:col-span-12">
              <label
                htmlFor="settings-phone"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Số điện thoại
              </label>
              <input
                id="settings-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="glass-input w-full py-2.5 px-3.5 text-sm text-slate-900 outline-none font-medium"
                placeholder="Ví dụ: 0901234567"
              />
            </div>

            {/* ── Action buttons ── */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:justify-end lg:col-span-12">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow sm:min-w-[7.5rem]"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="gradient-btn inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold sm:min-w-[7.5rem] gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full loading-spinner" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
