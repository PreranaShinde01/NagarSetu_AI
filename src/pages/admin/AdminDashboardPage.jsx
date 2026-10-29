import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMunicipality } from '../../context/MunicipalityContext';
import { Settings, Users, Building, ShieldCheck, Key, RefreshCw } from 'lucide-react';

export default function AdminDashboardPage() {
  const { demoUsers, loginAsRole } = useAuth();
  const { municipalities } = useMunicipality();
  const [tab, setTab] = useState('users');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-sans uppercase tracking-wide">
                SYSTEM & MUNICIPALITY ADMINISTRATION
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                Configure municipal hierarchies, user roles, SLA matrix, and administrative security.
              </p>
            </div>
          </div>
        </div>

        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold rounded-xl">
          CITY ADMIN / SUPER ADMIN
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2 font-mono text-xs">
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            tab === 'users' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          DEMO USERS & ROLES
        </button>
        <button
          onClick={() => setTab('municipalities')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            tab === 'municipalities' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          MUNICIPALITIES CONFIGURATION
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'users' && (
        <div className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200 font-mono uppercase">11 System Demo Roles (@nagarsetu.demo)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoUsers.map((u) => (
              <div key={u.id} className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 dark:text-slate-100">{u.name}</strong>
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] rounded font-bold border border-amber-200 dark:border-amber-500/40">{u.role}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</div>
                <button
                  onClick={() => loginAsRole(u.role)}
                  className="w-full mt-2 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold rounded transition-colors"
                >
                  Switch To Role
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'municipalities' && (
        <div className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200 font-mono uppercase">Configured Municipalities</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {municipalities.map((m) => (
              <div key={m.id} className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-amber-600 dark:text-amber-400 text-sm">{m.name}</strong>
                  <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] rounded">{m.code}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{m.tagline}</p>
                <div className="text-[10px] text-slate-500">Structure: {m.adminStructureType}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
