import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/api/analyticsService';
import CityNetworkGraphic from '../components/graphics/CityNetworkGraphic';
import CityOperationsGraphic from '../components/graphics/CityOperationsGraphic';
import SLAHealthGraphic from '../components/graphics/SLAHealthGraphic';
import { ShieldCheck, BarChart3, CheckCircle2, Award, Building, Users } from 'lucide-react';

export default function PublicDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalIssuesReported: 12842,
    resolvedIssues: 10416,
    resolutionRate: 81.1,
    avgResolutionHours: 8.2,
    slaComplianceRate: 91.4,
    activeWards: 42,
    activeFieldTeams: 128,
    cityHealthScore: 87,
  });

  useEffect(() => {
    async function loadPublicMetrics() {
      try {
        const res = await analyticsService.getPublicMetrics();
        if (res.data) setMetrics(res.data);
      } catch (err) {
        console.warn('Public metrics fetch error:', err);
      }
    }
    loadPublicMetrics();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Public Header */}
      <div className="bg-white dark:bg-brand-charcoal p-8 rounded-3xl border border-amber-500/30 shadow-lg dark:shadow-2xl text-center space-y-3 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4" /> NAGARSETU AI PUBLIC GOVERNANCE TRANSPARENCY
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-sans tracking-wide">
          CIVIC ACCOUNTABILITY & SMART CITY TRANSPARENCY
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 font-mono max-w-2xl mx-auto">
          "Connecting Citizens. Empowering Governance." Real-time public telemetry tracking city health score, resolution velocity, and municipal service performance for Ichalkaranji Municipal Corporation.
        </p>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 text-center shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-bold">TOTAL REPORTED</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-200 font-mono mt-1 block">{metrics.totalIssuesReported.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-emerald-200 dark:border-emerald-500/30 text-center shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-bold">RESOLVED</span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">{metrics.resolvedIssues.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-amber-200 dark:border-amber-500/30 text-center shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-bold font-sans">RESOLUTION RATE</span>
          <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1 block">{metrics.resolutionRate}%</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 text-center shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-bold">AVG TIME</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-200 font-mono mt-1 block">{metrics.avgResolutionHours}h</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-amber-200 dark:border-amber-400/30 text-center shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-bold">SLA COMPLIANCE</span>
          <span className="text-xl font-extrabold text-amber-600 dark:text-amber-300 font-mono mt-1 block">{metrics.slaComplianceRate}%</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-cyan-200 dark:border-cyan-500/30 text-center shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-bold">ACTIVE WARDS</span>
          <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono mt-1 block">{metrics.activeWards}</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 text-center shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-bold">FIELD TEAMS</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-200 font-mono mt-1 block">{metrics.activeFieldTeams}</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-brand-charcoal border border-emerald-300 dark:border-emerald-400/40 text-center bg-emerald-500/5 shadow-sm transition-colors">
          <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 uppercase block font-bold">HEALTH SCORE</span>
          <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 font-mono mt-1 block">{metrics.cityHealthScore} / 100</span>
        </div>
      </div>

      {/* Graphics & City Score Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">CIVIC GOVERNANCE TRANSPARENCY PIPELINE</h3>
          <CityNetworkGraphic className="h-44" />
        </div>

        <div className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex items-center justify-around transition-colors">
          <SLAHealthGraphic score={metrics.slaComplianceRate} className="w-36 h-36" />
          <div className="space-y-3 font-mono">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-xs block">MUNICIPAL PERFORMANCE</span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold text-xl">GRADE A+</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-xs block">CITIZEN VERIFICATION</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xl">94.2% APPROVAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
