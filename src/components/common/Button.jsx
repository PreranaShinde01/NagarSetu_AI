import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  title,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-brand-amber hover:bg-brand-deepAmber text-brand-deepCharcoal font-bold shadow-lg shadow-amber-500/10 active:scale-[0.98]',
    secondary: 'bg-brand-panel hover:bg-slate-800 text-slate-200 border border-slate-700 active:scale-[0.98]',
    outline: 'bg-transparent border border-amber-500/40 hover:bg-amber-500/10 text-amber-400 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-slate-100',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-600/20 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      title={title}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
