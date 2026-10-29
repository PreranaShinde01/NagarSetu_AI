import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useMunicipality } from '../../context/MunicipalityContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Search, Sun, Moon, Bell, ChevronRight, Menu, X, Building, CheckCircle2, Languages } from 'lucide-react';

export default function TopHeader({ onOpenCommandPalette, onToggleMobileSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { activeMunicipality, municipalities, switchMunicipality } = useMunicipality();
  const { currentUser, currentRoleDef } = useAuth();
  const { language, toggleLanguage, isMarathi, t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);

  // Breadcrumb title
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageTitle = pathParts[0] ? pathParts[0].replace('-', ' ').toUpperCase() : 'COMMAND CENTER';

  const mockNotifications = [
    { id: 1, title: 'AI Duplicate Incident Grouped', time: '2m ago', desc: '14 pothole complaints auto-grouped into Ward 12.' },
    { id: 2, title: 'SLA Breach Warning', time: '12m ago', desc: 'Water contamination report (NGS-2026-000089) due in 45 mins.' },
    { id: 3, title: 'Proof of Work Verified', time: '1h ago', desc: 'Worker Santosh Pawar uploaded completion photos for WO-2026-000042.' },
  ];

  return (
    <header className="h-14 bg-white/90 dark:bg-brand-charcoal/90 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between backdrop-blur-md z-20 relative select-none transition-colors duration-200">
      {/* Mobile Sidebar Toggle & Breadcrumb Trail */}
      <div className="flex items-center gap-3 text-xs">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Mobile Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">NAGARSETU</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 hidden sm:inline" />
          <span className="text-slate-600 dark:text-slate-400 uppercase hidden sm:inline">{activeMunicipality.code}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 hidden sm:inline" />
          <span className="font-bold text-amber-600 dark:text-amber-400 tracking-wider font-mono">{pageTitle}</span>
        </div>
      </div>

      {/* Global Actions Bar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-brand-deepCharcoal border border-slate-300 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all text-xs"
        >
          <Search className="w-3.5 h-3.5 text-amber-500 font-bold" />
          <span className="hidden sm:inline">{t('btn_search_placeholder')}</span>
          <kbd className="hidden md:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            Ctrl K
          </kbd>
        </button>

        {/* Sole Dedicated Municipality Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 font-bold font-mono">
          <Building className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{isMarathi ? 'इचलकरंजी महानगरपालिका (IMC)' : 'Ichalkaranji Municipal Corporation (IMC)'}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-2xl z-50 text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">{t('telemetry_alerts')}</h4>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">3 {t('unread')}</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-slate-50 dark:bg-brand-deepCharcoal border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span>{n.title}</span>
                      <span className="text-[9px] font-mono text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Multilingual Switcher: Marathi / English */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all text-xs font-mono font-bold"
          title={isMarathi ? "Switch to English" : "मराठी भाषेत रूपांतरित करा"}
        >
          <Languages className="w-3.5 h-3.5" />
          <span>{isMarathi ? 'मराठी' : 'EN'}</span>
        </button>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Charcoal Mode"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Active User Badge */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
            <span className={`text-[9px] font-mono px-1.5 rounded border ${currentRoleDef.badgeColor}`}>
              {currentRoleDef.label}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
