import React, { useState } from 'react';
import { useMunicipality } from '../context/MunicipalityContext';
import { FolderGit2, Building2, CheckCircle2, Clock, MapPin, Search } from 'lucide-react';

export default function PublicProjectsPage() {
  const { activeMunicipality } = useMunicipality();
  const [search, setSearch] = useState('');

  const projects = [
    {
      id: 'PRJ-2026-001',
      name: 'Janata Chowk Smart Pedestrian Corridor & Textile Hub Resurfacing',
      dept: 'Road Maintenance & Infrastructure',
      location: 'Prabhag 4 (Janata Chowk & Station Road, Ichalkaranji)',
      budget: '₹4.2 Crore',
      progress: 78,
      startDate: '2025-11-10',
      targetCompletion: '2026-04-30',
      status: 'IN_PROGRESS',
      milestones: ['Sub-grade compaction verified', 'Asphalt binder layer laid', 'Tactile paver installation underway'],
    },
    {
      id: 'PRJ-2026-002',
      name: 'Panchganga Basin Sewerage & Pipeline Augmentation Scheme',
      dept: 'Water Supply & Sewage Management',
      location: 'Prabhag 6 (Panchganga Riverbank, Ichalkaranji)',
      budget: '₹8.5 Crore',
      progress: 92,
      startDate: '2025-08-15',
      targetCompletion: '2026-03-15',
      status: 'NEAR_COMPLETION',
      milestones: ['Main trunk line laid', 'Manhole chambers constructed', 'Final hydro-testing in progress'],
    },
    {
      id: 'PRJ-2026-003',
      name: 'Station Road & Rajwada High-Efficiency LED Streetlight Grid',
      dept: 'Electrical & Streetlighting',
      location: 'Prabhag 1 (Rajwada & Kapad Market, Ichalkaranji)',
      budget: '₹2.1 Crore',
      progress: 100,
      startDate: '2025-10-01',
      targetCompletion: '2026-01-20',
      status: 'COMPLETED',
      milestones: ['Pole cabling complete', 'Smart photocell sensors mounted', 'Grid automated telemetry live'],
    },
    {
      id: 'PRJ-2026-004',
      name: 'Shahapur Automated Solid Waste Processing Center',
      dept: 'Solid Waste Management & Sanitation',
      location: 'Prabhag 5 (Powerloom Weaving Estate, Ichalkaranji)',
      budget: '₹6.0 Crore',
      progress: 45,
      startDate: '2026-01-05',
      targetCompletion: '2026-08-30',
      status: 'IN_PROGRESS',
      milestones: ['Land excavation completed', 'Reinforced foundation poured'],
    },
  ];

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-sans uppercase tracking-wide">
                Municipal Public Works & Capital Infrastructure
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">{activeMunicipality.name}</span>
                <span>•</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  PUBLIC CIVIC TRANSPARENCY
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="bg-transparent text-slate-900 dark:text-slate-200 outline-none w-48 font-mono placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((prj) => (
          <div
            key={prj.id}
            className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">{prj.id}</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                  prj.status === 'COMPLETED'
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40'
                    : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40'
                }`}>
                  {prj.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-sans">{prj.name}</h3>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div><span className="text-slate-500">Dept:</span> <strong className="text-slate-800 dark:text-slate-300">{prj.dept}</strong></div>
                <div><span className="text-slate-500">Budget:</span> <strong className="text-emerald-600 dark:text-emerald-400">{prj.budget}</strong></div>
                <div><span className="text-slate-500">Start:</span> <strong className="text-slate-700 dark:text-slate-300">{prj.startDate}</strong></div>
                <div><span className="text-slate-500">Completion:</span> <strong className="text-slate-700 dark:text-slate-300">{prj.targetCompletion}</strong></div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{prj.location}</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{prj.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{ width: `${prj.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-slate-500 font-mono uppercase block font-semibold">Key Milestones:</span>
                {prj.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
