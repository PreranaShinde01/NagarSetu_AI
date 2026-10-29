import React from 'react';

export default function AIScanningGraphic({ isScanning = true, className = 'h-48 w-full' }) {
  return (
    <div className={`relative flex items-center justify-center bg-slate-950/80 rounded-xl border border-amber-500/30 overflow-hidden ${className}`}>
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Radar Concentric Circles */}
      <div className="absolute w-40 h-40 rounded-full border border-amber-500/20"></div>
      <div className="absolute w-28 h-28 rounded-full border border-amber-500/30"></div>
      <div className="absolute w-16 h-16 rounded-full border border-amber-500/40"></div>

      {/* Rotating Sweep Line */}
      {isScanning && (
        <div className="absolute w-40 h-40 rounded-full animate-spin [animation-duration:3s]">
          <div className="w-1/2 h-1/2 bg-gradient-to-tr from-amber-500/40 to-transparent origin-bottom-right rounded-tl-full"></div>
        </div>
      )}

      {/* Center AI Target Badge */}
      <div className="z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          AI
        </div>
        <span className="text-xs text-amber-400/90 font-mono mt-2 tracking-wider uppercase animate-pulse">
          {isScanning ? 'ANALYZING ROUTING MATRIX...' : 'OPTIMAL ROUTE MATCHED'}
        </span>
      </div>

      {/* Scanning Laser Line */}
      {isScanning && (
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent top-0 animate-[bounce_2s_infinite]"></div>
      )}
    </div>
  );
}
