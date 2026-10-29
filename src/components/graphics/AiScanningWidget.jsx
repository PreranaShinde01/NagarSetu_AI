import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Zap } from 'lucide-react';

export default function AiScanningWidget({ isScanning = true, metrics = {} }) {
  return (
    <div className="relative p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-amber-500/20 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
      {/* Scanning laser beam overlay */}
      {isScanning && (
        <motion.div
          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#F59E0B]"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">AI Civic Intelligence Engine</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Triage & Duplicate Detection Operational</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
          <Zap className="w-3 h-3" /> Realtime Analysis
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-deepCharcoal/90 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-mono">Confidence Level</span>
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">{metrics.confidence || '94.2%'}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Semantic & Visual Match</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-deepCharcoal/90 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-mono">Auto Routing</span>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">{metrics.routed || '98.6%'}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Ward & Dept Assigned</p>
        </div>
      </div>

      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Decision Support Mode • Controller Override Enabled</span>
        </div>
        <span className="text-[9px] font-mono text-slate-500">v2.4 Neural Mesh</span>
      </div>
    </div>
  );
}
