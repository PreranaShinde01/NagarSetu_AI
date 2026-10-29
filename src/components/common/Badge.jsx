import React from 'react';
import clsx from 'clsx';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
}) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    p1: 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold',
    p2: 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold',
    p3: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-md border backdrop-blur-sm select-none',
        variants[variant] || variants.default,
        sizes[size],
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
