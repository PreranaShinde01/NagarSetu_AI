import React from 'react';
import { ShieldAlert, AlertOctagon, PhoneCall, MapPin, Clock, CheckCircle2 } from 'lucide-react';

export default function EmergencyPage() {
  const emergencyIncidents = [
    {
      id: 'EMG-2026-00001',
      title: 'Water Main Explosion & Flash Flooding on Arterial Transit Corridor',
      location: 'Prabhag 4 (Janata Chowk / Station Road, Ichalkaranji)',
      priority: 'CRITICAL_P1',
      status: 'DISPATCHED',
      reportedAt: '12m ago',
      assignedUnit: 'Ichalkaranji Emergency Response Squad 102 & Disaster Management Unit',
    },
    {
      id: 'EMG-2026-00002',
      title: 'Exposed High-Voltage Cabling near Primary School Zone',
      location: 'Prabhag 5 (Powerloom Weaving Estate, Ichalkaranji)',
      priority: 'CRITICAL_P1',
      status: 'ON_SITE',
      reportedAt: '28m ago',
      assignedUnit: 'Electrical Emergency Rapid Action Unit B (IMC)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-mono text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
          <span>
            <strong>INTER-AGENCY EMERGENCY COORDINATION GATEWAY:</strong> Simulated dispatch bridge for municipal police and disaster management cells for Ichalkaranji Municipal Corporation.
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex items-center justify-between transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <PhoneCall className="w-6 h-6 text-rose-500 animate-pulse" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-sans uppercase tracking-wide">
              EMERGENCY & POLICE DISASTER COORDINATION GATEWAY
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-1">
            High-severity P1 incident dispatch, hazardous hazard isolation & inter-department emergency protocol.
          </p>
        </div>

        <span className="px-3 py-1 bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40 text-xs font-mono font-bold rounded-xl">
          POLICE & DISASTER CELL
        </span>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {emergencyIncidents.map((inc) => (
          <div
            key={inc.id}
            className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-rose-200 dark:border-rose-500/30 shadow-sm dark:shadow-xl space-y-3 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">{inc.id}</span>
              <span className="px-3 py-1 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-bold font-mono text-xs rounded-lg border border-rose-200 dark:border-rose-500/40">
                {inc.priority} • {inc.reportedAt}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-sans">{inc.title}</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono bg-slate-50 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div><span className="text-slate-500">Location:</span> <strong className="text-slate-900 dark:text-slate-200">{inc.location}</strong></div>
              <div><span className="text-slate-500">Assigned Unit:</span> <strong className="text-amber-600 dark:text-amber-400">{inc.assignedUnit}</strong></div>
              <div><span className="text-slate-500">Dispatch Status:</span> <strong className="text-emerald-600 dark:text-emerald-400">{inc.status}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
