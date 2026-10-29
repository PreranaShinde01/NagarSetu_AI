import React, { useState } from 'react';
import { useMunicipality } from '../context/MunicipalityContext';
import { ROLE_DEFINITIONS } from '../config/rbacConfig';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Settings, Building, Shield, Clock, Layers, Save } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const { activeMunicipality } = useMunicipality();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('MUNICIPALITY');

  const handleSave = () => {
    addToast('Municipality configuration saved successfully.', 'success', 'Configuration Updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
              CONFIGURABLE GOVERNANCE SCHEMA
            </span>
            <span className="text-[10px] font-mono text-slate-500">[{activeMunicipality.code}]</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeMunicipality.name} Settings & Configuration</h1>
        </div>

        <Button variant="primary" size="md" onClick={handleSave} icon={Save}>
          Save Configuration
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {['MUNICIPALITY', 'ADMIN_UNITS', 'DEPARTMENTS', 'SLA_RULES', 'ROLES_RBAC'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/40 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'MUNICIPALITY' && (
        <Card className="p-5 space-y-4 border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase font-mono">Municipality Identity</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-mono">Municipality Name</label>
              <input
                type="text"
                defaultValue={activeMunicipality.name}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-slate-200 font-semibold outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-mono">Municipal Code</label>
              <input
                type="text"
                defaultValue={activeMunicipality.code}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-slate-200 font-semibold outline-none"
              />
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'ADMIN_UNITS' && (
        <Card className="p-5 space-y-4 border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase font-mono">Administrative Units & Wards ({activeMunicipality.wards?.length || 0} Wards)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {activeMunicipality.wards?.map((ward) => (
              <div key={ward.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-200">{ward.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Officer: {ward.officer || 'Prabhag Officer'}</p>
                </div>
                <Badge variant="amber">Ward {ward.number}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'DEPARTMENTS' && (
        <Card className="p-5 space-y-4 border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase font-mono">Municipal Departments ({activeMunicipality.departments?.length || 0} Depts)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {activeMunicipality.departments?.map((dept) => (
              <div key={dept.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-200">{dept.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Department Head: {dept.head || 'Superintending Engineer'}</p>
                </div>
                <Badge variant="info">{dept.code}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'SLA_RULES' && (
        <Card className="p-5 space-y-4 border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase font-mono">Configurable SLA Resolution Thresholds</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {Object.entries(activeMunicipality.slaDefaultsHours || {}).map(([severity, hours]) => (
              <div key={severity} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">{severity}</span>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-1">{hours} Hours</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'ROLES_RBAC' && (
        <Card className="p-5 space-y-4 border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase font-mono">Configurable Roles & Permissions Matrix ({ROLE_DEFINITIONS.length} Roles)</h3>
          <div className="space-y-2 text-xs">
            {ROLE_DEFINITIONS.map((r) => (
              <div key={r.role} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-200">{r.label}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${r.badgeColor}`}>{r.role}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{r.description}</p>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {r.permissions.length} Permissions Configured
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
