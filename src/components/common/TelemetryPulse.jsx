import React from 'react';
import clsx from 'clsx';

export default function TelemetryPulse({ status = 'operational', label = 'SYSTEM OPERATIONAL' }) {
  const colors = {
    operational: 'bg-emerald-500 shadow-emerald-500/50 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500 shadow-amber-500/50 text-amber-400 border-amber-500/30',
    critical: 'bg-rose-500 shadow-rose-500/50 text-rose-400 border-rose-500/30',
  };

  const dotColors = {
    operational: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-rose-500',
  };

  return (
    <div className={clsx('inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[11px] font-mono font-semibold tracking-wide backdrop-blur-md select-none', colors[status])}>
      <span className="relative flex h-2 w-2">
        <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', dotColors[status])} />
        <span className={clsx('relative inline-flex rounded-full h-2 w-2', dotColors[status])} />
      </span>
      <span>{label}</span>
    </div>
  );
}
