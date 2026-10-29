import React from 'react';

export default function SLAHealthGraphic({ score = 91.4, className = 'w-32 h-32' }) {
  const strokeDashoffset = 283 - (283 * score) / 100;
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          className="stroke-slate-800"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          className="stroke-amber-500 transition-all duration-1000 ease-out"
          strokeWidth="8"
          strokeDasharray="283"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-extrabold text-amber-400 font-mono">{score}%</span>
        <span className="text-[9px] uppercase tracking-wider text-slate-400">SLA Health</span>
      </div>
    </div>
  );
}
