import React from 'react';
import { useMunicipality } from '../context/MunicipalityContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export default function ProjectsPage() {
  const { activeMunicipality } = useMunicipality();

  const mockProjects = [
    { name: 'Janata Chowk Smart Corridor & Stormwater Drainage Upgrade', ward: 'Prabhag 4', budget: '₹4.2 Cr', contractor: 'Apex Infrastructure Ltd.', status: 'IN_PROGRESS' },
    { name: 'Rajwada LED Smart Streetlighting Automation', ward: 'Prabhag 1', budget: '₹1.8 Cr', contractor: 'Lumina Tech Systems', status: 'IN_PROGRESS' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
          PUBLIC INFRASTRUCTURE TRANSPARENCY
        </span>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeMunicipality.name} Public Works Projects</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockProjects.map((p, idx) => (
          <Card key={idx} className="p-5 space-y-2 border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between">
              <Badge variant="amber">{p.ward}</Badge>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{p.budget}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.name}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Contractor: {p.contractor}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
