import React from 'react';
import clsx from 'clsx';

export default function Card({
  children,
  className = '',
  glowing = false,
  bordered = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-xl bg-white dark:bg-brand-charcoal/90 text-slate-900 dark:text-slate-100 backdrop-blur-md transition-all duration-200 shadow-sm dark:shadow-none',
        bordered && 'border border-slate-200 dark:border-slate-800/90',
        glowing && 'hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10',
        onClick && 'cursor-pointer active:scale-[0.99]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
