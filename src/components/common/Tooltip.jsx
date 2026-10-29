import React, { useState } from 'react';

export default function Tooltip({ text, children, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && text && (
        <div
          className={`absolute z-50 px-2.5 py-1 text-[11px] font-mono text-slate-200 bg-brand-panel border border-slate-700 rounded-md shadow-lg whitespace-nowrap pointer-events-none ${positions[position]}`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
