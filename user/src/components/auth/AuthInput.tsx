import React from 'react';

interface AuthInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  leftIcon: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
}

export function AuthInput({ label, leftIcon, rightElement, id, error, ...props }: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 mb-1.5 tracking-tight"
      >
        {label}
      </label>
      <div className="relative group">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary-500">
          {leftIcon}
        </span>
        <input
          id={id}
          className={`glass-input w-full pl-11 pr-${rightElement ? '11' : '4'} py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium ${
            error ? '!border-red-400 !shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : ''
          }`}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors duration-200">
            {rightElement}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
