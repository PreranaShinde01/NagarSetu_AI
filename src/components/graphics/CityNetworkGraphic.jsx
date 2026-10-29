import React from 'react';

export default function CityNetworkGraphic({ className = 'h-36 w-full' }) {
  return (
    <div className={`relative flex flex-col justify-between bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 overflow-hidden select-none ${className}`}>
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none"></div>

      {/* Tier 1: Intake & Authorization */}
      <div className="flex items-center justify-between w-full relative z-10">
        {/* Node 1: Citizen */}
        <div className="flex flex-col items-center w-20 shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-400 font-bold text-[11px] font-mono shadow-sm">
            CIT
          </div>
          <span className="text-[10px] text-slate-300 font-mono font-bold uppercase mt-1 tracking-tight text-center leading-tight">
            Citizen
          </span>
          <span className="text-[8px] text-slate-500 font-mono tracking-wider">INTAKE</span>
        </div>

        {/* Connector 1 -> 2 */}
        <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500/40 via-amber-500/50 to-amber-500 relative mx-1.5 overflow-hidden">
          <div className="absolute inset-0 bg-amber-400 w-1/3 animate-pulse"></div>
        </div>

        {/* Node 2: AI Intelligence */}
        <div className="flex flex-col items-center w-20 shrink-0">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/70 flex items-center justify-center text-amber-400 font-bold text-[11px] font-mono shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            AI
          </div>
          <span className="text-[10px] text-amber-400 font-mono font-bold uppercase mt-1 tracking-tight text-center leading-tight">
            AI Triage
          </span>
          <span className="text-[8px] text-amber-500/70 font-mono tracking-wider">AUTO-SLA</span>
        </div>

        {/* Connector 2 -> 3 */}
        <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-500 via-amber-400/50 to-slate-700 relative mx-1.5 overflow-hidden">
          <div className="absolute inset-0 bg-amber-300 w-1/2 animate-ping opacity-30"></div>
        </div>

        {/* Node 3: Controller */}
        <div className="flex flex-col items-center w-20 shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-amber-500/60 flex items-center justify-center text-amber-300 font-bold text-[11px] font-mono shadow-sm">
            CTRL
          </div>
          <span className="text-[10px] text-slate-300 font-mono font-bold uppercase mt-1 tracking-tight text-center leading-tight">
            Controller
          </span>
          <span className="text-[8px] text-slate-500 font-mono tracking-wider">APPROVAL</span>
        </div>
      </div>

      {/* Middle Flow Transition */}
      <div className="flex items-center justify-between px-4 py-0.5 relative z-10">
        <div className="h-px bg-slate-800 flex-1"></div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-[8px] font-mono text-slate-400 tracking-wider">
          <span>WORK ORDER DISPATCH</span>
          <span className="text-amber-400 font-bold">↓</span>
        </div>
        <div className="h-px bg-slate-800 flex-1"></div>
      </div>

      {/* Tier 2: Execution & Verified Closure */}
      <div className="flex items-center justify-between w-full relative z-10">
        {/* Node 4: Ward / Dept */}
        <div className="flex flex-col items-center w-20 shrink-0">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 font-bold text-[11px] font-mono shadow-sm">
            WARD
          </div>
          <span className="text-[10px] text-slate-300 font-mono font-bold uppercase mt-1 tracking-tight text-center leading-tight">
            Ward / Dept
          </span>
          <span className="text-[8px] text-slate-500 font-mono tracking-wider">ASSIGN</span>
        </div>

        {/* Connector 4 -> 5 */}
        <div className="flex-1 h-0.5 bg-gradient-to-r from-cyan-500/50 via-emerald-500/40 to-emerald-500 relative mx-1.5 overflow-hidden">
          <div className="absolute inset-0 bg-cyan-400 w-1/3 animate-pulse"></div>
        </div>

        {/* Node 5: Field Action */}
        <div className="flex flex-col items-center w-20 shrink-0">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 font-bold text-[11px] font-mono shadow-sm">
            WORK
          </div>
          <span className="text-[10px] text-slate-300 font-mono font-bold uppercase mt-1 tracking-tight text-center leading-tight">
            Field Crew
          </span>
          <span className="text-[8px] text-slate-500 font-mono tracking-wider">ACTION</span>
        </div>

        {/* Connector 5 -> 6 */}
        <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 relative mx-1.5 overflow-hidden">
          <div className="absolute inset-0 bg-emerald-300 w-1/2 animate-ping opacity-30"></div>
        </div>

        {/* Node 6: Closed Resolution */}
        <div className="flex flex-col items-center w-20 shrink-0">
          <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-[12px] font-mono shadow-[0_0_12px_rgba(16,185,129,0.35)]">
            ✓
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase mt-1 tracking-tight text-center leading-tight">
            Closed
          </span>
          <span className="text-[8px] text-emerald-500/70 font-mono tracking-wider font-semibold">VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
