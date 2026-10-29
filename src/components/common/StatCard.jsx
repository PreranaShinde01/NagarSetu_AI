import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import clsx from 'clsx';

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendUpIsGood = true,
  icon: Icon,
  accentColor = 'amber',
}) {
  const borderAccents = {
    amber: 'border-l-4 border-l-amber-500',
    critical: 'border-l-4 border-l-rose-500',
    emerald: 'border-l-4 border-l-emerald-500',
    blue: 'border-l-4 border-l-blue-500',
    purple: 'border-l-4 border-l-purple-500',
  };

  const iconBg = {
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    critical: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  };

  return (
    <Card className={clsx('p-4 hover:border-slate-400 dark:hover:border-slate-700 transition-all', borderAccents[accentColor])}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">{title}</span>
          <div className="mt-1 flex items-baseline gap-2">
            <motion.h3
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100"
            >
              {value}
            </motion.h3>
            {trend && (
              <span className={`text-xs font-mono ${trend.startsWith('+') ? (trendUpIsGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400') : 'text-slate-400'}`}>
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="text-[11px] text-slate-500 mt-1">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl border ${iconBg[accentColor]}`}>
            <Icon className="w-5 h-5 shrink-0" />
          </div>
        )}
      </div>
    </Card>
  );
}
