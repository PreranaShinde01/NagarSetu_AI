import React from 'react';
import { Droplets, Zap, Activity, Waves, Trash2 } from 'lucide-react';

export default function CityOperationsGraphic({ className = 'h-36 w-full' }) {
  const sectors = [
    {
      id: 'water',
      label: 'WATER',
      val: 98,
      status: 'NOMINAL',
      color: 'text-cyan-400',
      barColor: 'from-cyan-500 to-blue-500',
      glow: 'rgba(6,182,212,0.3)',
      icon: Droplets,
    },
    {
      id: 'power',
      label: 'POWER',
      val: 99,
      status: 'STABLE',
      color: 'text-amber-400',
      barColor: 'from-amber-400 to-amber-600',
      glow: 'rgba(245,158,11,0.3)',
      icon: Zap,
    },
    {
      id: 'roads',
      label: 'ROADS',
      val: 92,
      status: 'ACTIVE',
      color: 'text-orange-400',
      barColor: 'from-orange-400 to-amber-500',
      glow: 'rgba(249,115,22,0.3)',
      icon: Activity,
    },
    {
      id: 'drain',
      label: 'DRAIN',
      val: 96,
      status: 'OPTIMAL',
      color: 'text-teal-400',
      barColor: 'from-teal-400 to-emerald-500',
      glow: 'rgba(20,184,166,0.3)',
      icon: Waves,
    },
    {
      id: 'waste',
      label: 'WASTE',
      val: 94,
      status: 'CLEAR',
      color: 'text-emerald-400',
      barColor: 'from-emerald-400 to-emerald-600',
      glow: 'rgba(16,185,129,0.3)',
      icon: Trash2,
    },
  ];

  return (
    <div className={`relative flex flex-col justify-between bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 overflow-hidden select-none ${className}`}>
      {/* Background Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none"></div>

      {/* Dedicated Header Row (Non-colliding) */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/70 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold text-slate-200 uppercase tracking-widest">
            Civic Grid Telemetry
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <span>ALL SECTORS ONLINE</span>
          <span className="text-slate-500">•</span>
          <span>96.8%</span>
        </div>
      </div>

      {/* 5 Municipal Telemetry Columns */}
      <div className="grid grid-cols-5 gap-2 pt-2 items-end flex-1 relative z-10">
        {sectors.map((sector) => {
          const Icon = sector.icon;
          return (
            <div key={sector.id} className="flex flex-col items-center justify-end h-full group">
              {/* Telemetry Metric Value */}
              <span className={`text-[10px] font-mono font-bold ${sector.color} mb-1 leading-none`}>
                {sector.val}%
              </span>

              {/* Vertical Level Track */}
              <div className="w-full max-w-[28px] h-12 bg-slate-950/80 rounded border border-slate-800 flex flex-col justify-end p-0.5 relative overflow-hidden group-hover:border-slate-700 transition-colors">
                {/* Horizontal reference lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none opacity-20">
                  <div className="border-b border-slate-600 w-full"></div>
                  <div className="border-b border-slate-600 w-full"></div>
                  <div className="border-b border-slate-600 w-full"></div>
                </div>

                {/* Dynamic Height Filled Bar */}
                <div
                  className={`w-full rounded-sm bg-gradient-to-t ${sector.barColor} transition-all duration-500 relative`}
                  style={{
                    height: `${sector.val}%`,
                    boxShadow: `0 0 8px ${sector.glow}`,
                  }}
                >
                  {/* Top glowing cap */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-white/80 rounded-t-sm"></div>
                </div>
              </div>

              {/* Sector Code & Icon */}
              <div className="flex flex-col items-center mt-1.5 text-center leading-none">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-tight ${sector.color}`}>
                  {sector.label}
                </span>
                <span className="text-[7.5px] font-mono text-slate-500 uppercase mt-0.5 tracking-wider">
                  {sector.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
