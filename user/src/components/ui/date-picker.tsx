'use client';

import React, { useId, useRef, useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { addMonths, startOfMonth } from 'date-fns';
import { CalendarDays, X, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── shared day-picker Tailwind classNames ─────────────────────────────────
export const DAY_PICKER_CLASSNAMES = {
  root: 'p-3 select-none',
  months: 'flex flex-row gap-6',
  month: 'flex flex-col gap-4',
  month_caption: 'flex items-center justify-between px-1 mb-1',
  caption_label: 'text-sm font-semibold text-slate-800',
  nav: 'flex items-center gap-1',
  button_previous: [
    'inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-500',
    'hover:bg-indigo-50 hover:text-indigo-600 transition-colors disabled:opacity-30 disabled:pointer-events-none'
  ].join(' '),
  button_next: [
    'inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-500',
    'hover:bg-indigo-50 hover:text-indigo-600 transition-colors disabled:opacity-30 disabled:pointer-events-none'
  ].join(' '),
  month_grid: 'w-full border-collapse',
  weekdays: 'flex mb-1',
  weeks: 'block min-h-[216px]',
  weekday: 'w-9 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider',
  week: 'flex w-full',
  day: 'relative p-0 flex items-center justify-center',
  day_button: [
    'w-9 h-9 rounded-xl text-sm font-medium transition-all duration-100 outline-none',
    'hover:bg-indigo-50 hover:text-indigo-700',
    'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1'
  ].join(' '),
  selected:
    '[&>button]:bg-indigo-600 [&>button]:text-white [&>button]:hover:bg-indigo-700 [&>button]:shadow-sm',
  today:
    '[&>button]:ring-2 [&>button]:ring-indigo-400 [&>button]:ring-offset-1 [&>button]:font-bold',
  outside:
    '[&>button]:text-slate-300 [&>button]:hover:text-slate-400 [&>button]:hover:bg-transparent',
  disabled: '[&>button]:text-slate-300 [&>button]:pointer-events-none',
  range_start: '[&>button]:rounded-r-none [&>button]:bg-indigo-600 [&>button]:text-white',
  range_end: '[&>button]:rounded-l-none [&>button]:bg-indigo-600 [&>button]:text-white',
  range_middle: '[&>button]:rounded-none [&>button]:bg-indigo-50 [&>button]:text-indigo-700',
  hidden: 'invisible'
};

// ─── helpers ───────────────────────────────────────────────────────────────
function formatDisplay(date?: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ─── Popover wrapper ────────────────────────────────────────────────────────
interface PopoverCalendarProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

type PopoverSide = 'bottom' | 'top';

function PopoverCalendar({ open, onClose, anchorRef, children }: PopoverCalendarProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState<PopoverSide>('bottom');

  // Detect available space above/below on open
  useEffect(() => {
    if (!open || !anchorRef.current) return;

    const POPOVER_HEIGHT = 360; // conservative estimate (px)
    const GAP = 8;
    const rect = anchorRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - GAP;
    const spaceAbove = rect.top - GAP;

    setSide(spaceBelow >= POPOVER_HEIGHT || spaceBelow >= spaceAbove ? 'bottom' : 'top');
  }, [open, anchorRef]);

  // Re-check on scroll / resize while open
  useEffect(() => {
    if (!open) return;
    const recalc = () => {
      if (!anchorRef.current) return;
      const POPOVER_HEIGHT = 360;
      const GAP = 8;
      const rect = anchorRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - GAP;
      const spaceAbove = rect.top - GAP;
      setSide(spaceBelow >= POPOVER_HEIGHT || spaceBelow >= spaceAbove ? 'bottom' : 'top');
    };
    window.addEventListener('scroll', recalc, true);
    window.addEventListener('resize', recalc);
    return () => {
      window.removeEventListener('scroll', recalc, true);
      window.removeEventListener('resize', recalc);
    };
  }, [open, anchorRef]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        popoverRef.current?.contains(e.target as Node) ||
        anchorRef.current?.contains(e.target as Node)
      )
        return;
      onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const positionClass = side === 'bottom' ? 'top-[calc(100%+6px)]' : 'bottom-[calc(100%+6px)]';

  const animationClass =
    side === 'bottom'
      ? 'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150'
      : 'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-150';

  return (
    <div
      ref={popoverRef}
      className={[
        'absolute z-[200] left-0',
        positionClass,
        'rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/10',
        'ring-1 ring-slate-900/5',
        animationClass
      ].join(' ')}
    >
      {children}
    </div>
  );
}

// ─── Single DatePicker ──────────────────────────────────────────────────────
interface DatePickerProps {
  label?: string;
  value?: Date | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Chọn ngày',
  disabled = false,
  error,
  className = '',
  minDate,
  maxDate
}: DatePickerProps) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`relative flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={uid} className="text-xs font-semibold text-slate-600 select-none">
          {label}
        </label>
      )}
      <div ref={wrapRef}>
        <button
          id={uid}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={[
            'group relative flex h-9 w-full items-center gap-2 rounded-xl border px-3 py-2',
            'bg-white text-sm transition-all duration-150 outline-none cursor-pointer',
            'hover:border-indigo-400 hover:shadow-sm',
            'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            open ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm' : '',
            error ? 'border-rose-400' : 'border-slate-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          ].join(' ')}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <span
            className={`flex-1 text-left truncate ${value ? 'text-slate-800 font-medium' : 'text-slate-400'}`}
          >
            {value ? formatDisplay(value) : placeholder}
          </span>
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
              onKeyDown={(e) => e.key === 'Enter' && (e.stopPropagation(), onChange(undefined))}
              className="rounded p-0.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </button>

        <PopoverCalendar open={open} onClose={() => setOpen(false)} anchorRef={wrapRef}>
          <DayPicker
            mode="single"
            selected={value ?? undefined}
            onSelect={(d) => {
              onChange(d);
              setOpen(false);
            }}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : [])
            ]}
            classNames={DAY_PICKER_CLASSNAMES}
            components={{
              Chevron: ({ orientation }) =>
                orientation === 'left' ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
            }}
          />
        </PopoverCalendar>
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// ─── Date Range Picker ──────────────────────────────────────────────────────
export interface DateRange {
  from?: Date;
  to?: Date;
}

interface DateRangePickerProps {
  label?: string;
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const NAV_BTN = [
  'inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-500',
  'hover:bg-indigo-50 hover:text-indigo-600 transition-colors',
  'disabled:opacity-30 disabled:pointer-events-none'
].join(' ');

export function DateRangePicker({
  label,
  value,
  onChange,
  placeholder = 'Chọn khoảng thời gian',
  disabled = false,
  error,
  className = ''
}: DateRangePickerProps) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const today = startOfMonth(new Date());
  const [leftMonth, setLeftMonth] = useState(today);
  const [rightMonth, setRightMonth] = useState(addMonths(today, 1));

  const display = value.from
    ? value.to
      ? `${formatDisplay(value.from)} – ${formatDisplay(value.to)}`
      : `${formatDisplay(value.from)} – ...`
    : '';

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    onChange({ from: range?.from, to: range?.to });
    if (range?.from && range?.to) setOpen(false);
  };

  const sharedProps = {
    mode: 'range' as const,
    selected: { from: value.from, to: value.to },
    onSelect: handleSelect as any,
    classNames: DAY_PICKER_CLASSNAMES,
    components: {
      Chevron: ({ orientation }: { orientation?: string }) =>
        orientation === 'left' ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )
    }
  };

  return (
    <div className={`relative flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={uid} className="text-xs font-semibold text-slate-600 select-none">
          {label}
        </label>
      )}
      <div ref={wrapRef}>
        <button
          id={uid}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={[
            'group relative flex h-9 w-full items-center gap-2 rounded-xl border px-3 py-2',
            'bg-white text-sm transition-all duration-150 outline-none cursor-pointer',
            'hover:border-indigo-400 hover:shadow-sm',
            'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            open ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm' : '',
            error ? 'border-rose-400' : 'border-slate-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          ].join(' ')}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <span
            className={`flex-1 text-left truncate ${display ? 'text-slate-800 font-medium' : 'text-slate-400'}`}
          >
            {display || placeholder}
          </span>
          {(value.from || value.to) && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange({});
              }}
              onKeyDown={(e) => e.key === 'Enter' && (e.stopPropagation(), onChange({}))}
              className="rounded p-0.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </button>

        <PopoverCalendar open={open} onClose={() => setOpen(false)} anchorRef={wrapRef}>
          <div className="flex divide-x divide-slate-100">
            {/* ── Left calendar ── */}
            <div className="p-3">
              <div className="flex items-center justify-between px-1 mb-2">
                <button
                  type="button"
                  className={NAV_BTN}
                  onClick={() => setLeftMonth((m) => addMonths(m, -1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-slate-800 capitalize">
                  {leftMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  className={NAV_BTN}
                  onClick={() => setLeftMonth((m) => addMonths(m, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <DayPicker
                {...sharedProps}
                month={leftMonth}
                onMonthChange={setLeftMonth}
                hideNavigation
                classNames={{
                  ...DAY_PICKER_CLASSNAMES,
                  root: 'select-none',
                  month_caption: 'hidden'
                }}
              />
            </div>

            {/* ── Right calendar ── */}
            <div className="p-3">
              <div className="flex items-center justify-between px-1 mb-2">
                <button
                  type="button"
                  className={NAV_BTN}
                  onClick={() => setRightMonth((m) => addMonths(m, -1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-slate-800 capitalize">
                  {rightMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  className={NAV_BTN}
                  onClick={() => setRightMonth((m) => addMonths(m, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <DayPicker
                {...sharedProps}
                month={rightMonth}
                onMonthChange={setRightMonth}
                hideNavigation
                classNames={{
                  ...DAY_PICKER_CLASSNAMES,
                  root: 'select-none',
                  month_caption: 'hidden'
                }}
              />
            </div>
          </div>
        </PopoverCalendar>
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
