import React from 'react';
import { useMunicipality } from '../../context/MunicipalityContext';
import SLAHealthGraphic from '../../components/graphics/SLAHealthGraphic';
import CityNetworkGraphic from '../../components/graphics/CityNetworkGraphic';
import { Award, ShieldCheck, BarChart3, TrendingUp, Users, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SeniorDashboardPage() {
  const navigate = useNavigate();
  const { activeMunicipality } = useMunicipality();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-sans uppercase tracking-wide">
                SENIOR MUNICIPAL AUTHORITY EXECUTIVE CELL
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                IAS Commissioner & Executive Director Governance Oversight Directorate ({activeMunicipality.name}).
              </p>
            </div>
          </div>
        </div>

        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold rounded-xl">
          SENIOR AUTHORITY SCOPE
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">MUNICIPAL HEALTH SCORE</span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">87 / 100</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">OVERALL SLA RATE</span>
          <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1 block">91.4%</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-rose-200 dark:border-rose-500/30 shadow-sm transition-colors">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">ACTIVE ESCALATIONS</span>
          <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-1 block">11 Cases</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">RESOLVED COMPLAINTS</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-200 font-mono mt-1 block">10,416</span>
        </div>
      </div>

      {/* Graphics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 font-mono uppercase">Executive Operations Matrix</h3>
          <CityNetworkGraphic className="h-44" />
        </div>
        <div className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex items-center justify-around transition-colors">
          <SLAHealthGraphic score={91.4} className="w-32 h-32" />
          <div className="space-y-2 font-mono text-xs">
            <button onClick={() => navigate('/controller/escalations')} className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 rounded-xl font-bold block w-full transition-colors">
              Inspect Level 2+ Escalations
            </button>
            <button onClick={() => navigate('/controller/analytics')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-extrabold block w-full transition-colors shadow-sm">
              Open Analytics Engine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
