import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Cpu, Building2, ShieldCheck, HardHat, CheckCircle2, BarChart3 } from 'lucide-react';

export default function CivicFlowGraphic() {
  const steps = [
    { title: 'Citizen Report', icon: UserCheck, color: 'text-blue-500 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/30' },
    { title: 'AI Triage', icon: Cpu, color: 'text-amber-500 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/40' },
    { title: 'Ward Officer', icon: Building2, color: 'text-indigo-500 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-500/30' },
    { title: 'Dept Supervisor', icon: ShieldCheck, color: 'text-purple-500 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/30' },
    { title: 'Worker Action', icon: HardHat, color: 'text-orange-500 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-500/30' },
    { title: 'Proof Verification', icon: CheckCircle2, color: 'text-emerald-500 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/30' },
    { title: 'City Analytics', icon: BarChart3, color: 'text-cyan-500 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-500/30' },
  ];

  return (
    <div className="w-full bg-white dark:bg-brand-charcoal/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 my-3 backdrop-blur-md shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400">Municipal Accountability Workflow</h4>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-bold">CLOSED LOOP GOVERNANCE</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-2.5 rounded-xl bg-slate-50 dark:bg-brand-deepCharcoal border ${step.border} flex flex-col items-center text-center group hover:border-amber-500/50 transition-all shadow-sm`}
            >
              <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-900 ${step.color} mb-2`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-snug">{step.title}</span>
              <span className="text-[9px] font-mono text-slate-500 mt-1">Step 0{index + 1}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
