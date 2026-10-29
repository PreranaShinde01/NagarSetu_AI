import React from 'react';
import TelemetryPulse from '../common/TelemetryPulse';
import { useMunicipality } from '../../context/MunicipalityContext';
import { useLanguage } from '../../context/LanguageContext';
import { Minus, Square, X } from 'lucide-react';

export default function TitleBar() {
  const { activeMunicipality } = useMunicipality();
  const { isMarathi, t } = useLanguage();

  const handleMinimize = () => {
    if (window.electronAPI) window.electronAPI.minimize();
  };

  const handleMaximize = () => {
    if (window.electronAPI) window.electronAPI.maximize();
  };

  const handleClose = () => {
    if (window.electronAPI) window.electronAPI.close();
  };

  return (
    <header className="h-10 bg-brand-deepCharcoal border-b border-slate-800/90 flex items-center justify-between px-3 select-none z-40 relative">
      {/* Draggable Title Region */}
      <div className="flex items-center gap-3 flex-1 h-full cursor-default" style={{ WebkitAppRegion: 'drag' }}>
        <div className="flex items-center gap-2">
          <img src="/assets/nagarsetu-icon.png" alt="NagarSetu" className="w-5 h-5 rounded-full object-contain" />
          <span className="text-xs font-bold tracking-wider text-slate-100 font-sans">
            NAGAR<span className="text-brand-amber">SETU</span> AI
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {t('desktop_edition')}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800 hidden sm:block" />

        <div className="items-center gap-2 text-xs text-slate-400 hidden sm:flex">
          <span className="font-semibold text-slate-300">
            {isMarathi ? (activeMunicipality.marathiName || activeMunicipality.name) : activeMunicipality.name}
          </span>
          <span className="text-[10px] font-mono text-slate-500">[{activeMunicipality.code}]</span>
        </div>
      </div>

      {/* Non-draggable Right Controls */}
      <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'no-drag' }}>
        <TelemetryPulse status="operational" label={t('live_telemetry')} />

        {/* Window Action Controls */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
          <button
            onClick={handleMinimize}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Minimize Window"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Maximize Window"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-rose-600/30 rounded transition-colors"
            title="Close Application"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
