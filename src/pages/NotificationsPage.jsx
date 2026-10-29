import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    { title: 'AI Duplicate Incident Grouped', desc: '14 pothole reports grouped into INC-2026-000124 (Janata Chowk, Ichalkaranji).', time: '2 mins ago' },
    { title: 'SLA Warning Triggered', desc: 'Water contamination report NGS-2026-000089 approaching deadline.', time: '15 mins ago' },
    { title: 'Proof of Work Uploaded', desc: 'Worker Santosh Pawar submitted completion evidence for Prabhag 4.', time: '1 hour ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
          TELEMETRY ALERTS • ICHALKARANJI
        </span>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">Notification Drawer & Alerts</h1>
      </div>

      <div className="space-y-3">
        {notifications.map((n, idx) => (
          <Card key={idx} className="p-4 border border-slate-200 dark:border-slate-800 flex items-start gap-3 transition-colors">
            <Bell className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">{n.title}</h4>
                <span className="text-[10px] font-mono text-slate-500">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{n.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
