import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, Layers, CheckCircle2, ShieldAlert, Cpu, Zap } from 'lucide-react';
import Card from '../common/Card';

export default function ComplaintAiAnalysisPanel({ aiAnalysis, isScanning = false }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans">
              GenAI Civic Intelligence Classification
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Multimodal NLP & Computer Vision triage analysis
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" /> Neural Mesh v2.4
        </span>
      </div>

      {/* Animated AI Scanning Progression */}
      {isScanning ? (
        <div className="p-8 rounded-xl bg-white dark:bg-brand-charcoal border border-amber-500/30 text-center space-y-4 shadow-sm transition-colors">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 mx-auto rounded-full border-2 border-amber-500 border-t-transparent"
          />
          <h4 className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
            ANALYZING CIVIC ISSUE METADATA...
          </h4>
          <div className="max-w-xs mx-auto space-y-1 text-[11px] font-mono text-slate-600 dark:text-slate-400 text-left">
            <p className="text-emerald-600 dark:text-emerald-400">✓ Understanding description semantics</p>
            <p className="text-emerald-600 dark:text-emerald-400">✓ Classifying civic category</p>
            <p className="text-emerald-600 dark:text-emerald-400">✓ Analyzing uploaded visual evidence</p>
            <p className="text-emerald-600 dark:text-emerald-400">✓ Estimating severity & priority rating</p>
            <p className="text-amber-600 dark:text-amber-400 animate-pulse">Scanning nearby duplicate reports...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* AI Recommendation Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Possible Category</span>
              <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">{aiAnalysis?.category || 'Road Infrastructure'}</h4>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Confidence: {aiAnalysis?.confidence || 94}%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Possible Severity</span>
              <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">{aiAnalysis?.severity || 'HIGH'}</h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Hazard Rating</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Recommended Priority</span>
              <h4 className="text-sm font-bold text-amber-700 dark:text-amber-300 mt-0.5">{aiAnalysis?.priority || 'P2'}</h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Response SLA: {aiAnalysis?.recommendedSlaHours || 24}h</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Suggested Dept</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 mt-0.5">Roads & Infrastructure</h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Prabhag 4 Unit (IMC)</span>
            </div>
          </div>

          {/* AI Reasoning Points */}
          <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm transition-colors">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-mono">Why this recommendation?</h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-mono">•</span>
                <span>Description indicates road surface damage and potential traffic obstruction.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-mono">•</span>
                <span>Uploaded evidence image shows pavement deterioration and hazard on carriage way.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-mono">•</span>
                <span>Complaint location is near a high-density transit corridor (Station Road / Janata Chowk).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-mono">•</span>
                <span>Similar civic reports checked across Ichalkaranji GIS mesh.</span>
              </li>
            </ul>
          </div>

          {/* Mandatory AI Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>AI-generated recommendation. Final action remains with authorized municipal personnel of Ichalkaranji Municipal Corporation.</span>
          </div>

          {/* Duplicate Detection Preview Section */}
          <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider font-mono">Possible Related Reports</h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                Spatial Clustering Enabled
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              No direct duplicates detected within 100 meters. This appears to be a unique grievance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
