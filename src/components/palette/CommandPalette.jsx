import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useMunicipality } from '../../context/MunicipalityContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, LayoutDashboard, AlertOctagon, MapPin, ClipboardList, Clock, BarChart3, Settings, User, Building, Sun, Moon } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { demoUsers, loginAsRole } = useAuth();
  const { municipalities, switchMunicipality } = useMunicipality();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled externally or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigationCommands = [
    { title: 'Go to Command Center', path: '/command-center', icon: LayoutDashboard },
    { title: 'Go to Complaints Queue', path: '/complaints', icon: AlertOctagon },
    { title: 'Go to Smart GIS Map', path: '/map', icon: MapPin },
    { title: 'Go to Work Orders', path: '/work-orders', icon: ClipboardList },
    { title: 'Go to SLA Monitor', path: '/sla-monitor', icon: Clock },
    { title: 'Go to City Analytics', path: '/analytics', icon: BarChart3 },
    { title: 'Go to Administration & Config', path: '/settings', icon: Settings },
  ];

  const filteredNav = navigationCommands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));
  const filteredUsers = demoUsers.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.role.toLowerCase().includes(query.toLowerCase()));
  const filteredMunis = municipalities.filter(m => m.name.toLowerCase().includes(query.toLowerCase()) || m.code.toLowerCase().includes(query.toLowerCase()));

  const handleSelectNav = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  const handleSelectUser = (role) => {
    loginAsRole(role);
    onClose();
    setQuery('');
  };

  const handleSelectMuni = (muniId) => {
    switchMunicipality(muniId);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-deepCharcoal/80 backdrop-blur-md"
        />

        {/* Command Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-2xl bg-white dark:bg-brand-charcoal border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-10 text-slate-900 dark:text-slate-100 transition-colors"
        >
          {/* Search Header */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command, page name, role..."
              autoFocus
              className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none font-sans"
            />
            <kbd className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-2 space-y-4 custom-scrollbar">
            {/* Page Navigation Commands */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono px-2">Navigation</span>
              <div className="mt-1 space-y-1">
                {filteredNav.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.path}
                      onClick={() => handleSelectNav(cmd.path)}
                      className="w-full text-left p-2 rounded-lg flex items-center justify-between text-xs text-slate-200 hover:bg-amber-500/15 hover:text-amber-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-amber-400" />
                        <span>{cmd.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{cmd.path}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Switch Demo Role Commands */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono px-2">Switch Demo Role</span>
              <div className="mt-1 space-y-1">
                {filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u.role)}
                    className="w-full text-left p-2 rounded-lg flex items-center justify-between text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-blue-400" />
                      <span>{u.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400">{u.role}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Switch Municipality Commands */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono px-2">Switch Municipality</span>
              <div className="mt-1 space-y-1">
                {filteredMunis.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMuni(m.id)}
                    className="w-full text-left p-2 rounded-lg flex items-center justify-between text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building className="w-4 h-4 text-emerald-400" />
                      <span>{m.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{m.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
