import React from 'react';
import { useMunicipality } from '../context/MunicipalityContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { Clock, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function SlaMonitorPage() {
  const { activeMunicipality } = useMunicipality();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
            SERVICE LEVEL AGREEMENT ENGINE
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeMunicipality.name} SLA Compliance & Escalation Monitor</h1>
        </div>
        <Badge variant="amber">SLA AT RISK: {activeMunicipality.slaRiskCount || 7}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-rose-500 border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">Critical (4h SLA)</span>
          <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-1">4h Default</h3>
          <p className="text-[11px] text-slate-500 mt-1">Water supply, hazard signals</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-amber-500 border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">High Priority (24h SLA)</span>
          <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-1">24h Default</h3>
          <p className="text-[11px] text-slate-500 mt-1">Potholes, streetlights</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-blue-500 border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">Medium Priority (48h SLA)</span>
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-1">48h Default</h3>
          <p className="text-[11px] text-slate-500 mt-1">Garbage, footpaths</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-purple-500 border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">Low Priority (72h SLA)</span>
          <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 font-mono mt-1">72h Default</h3>
          <p className="text-[11px] text-slate-500 mt-1">General inquiries</p>
        </Card>
      </div>
    </div>
  );
}
