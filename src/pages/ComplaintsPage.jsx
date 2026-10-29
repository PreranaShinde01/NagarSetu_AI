import React, { useState } from 'react';
import { useMunicipality } from '../context/MunicipalityContext';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { classifyComplaint, AI_DISCLAIMER } from '../services/ai/aiService';
import { Search, Filter, Cpu, CheckCircle2, ShieldAlert, Clock, Eye, AlertTriangle } from 'lucide-react';

export default function ComplaintsPage() {
  const { activeMunicipality } = useMunicipality();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Synthetic Complaints Data
  const complaints = [
    {
      id: 'NGS-2026-000142',
      issue: 'Water Pipeline Burst & Contamination on FC Road',
      category: 'Water Supply',
      ward: 'Ward 12 (Shivajinagar)',
      dept: 'Water Supply & Sewage',
      priority: 'P1',
      severity: 'CRITICAL',
      slaCountdown: '3h 15m remaining',
      status: 'AWAITING_ROUTING_APPROVAL',
      confidence: 98,
      reportedBy: 'Ananya Sharma',
      reportedTime: '18 mins ago',
    },
    {
      id: 'NGS-2026-000141',
      issue: 'Deep Asphalt Pothole Cavity on Kothrud Corridor',
      category: 'Road Damage',
      ward: 'Ward 18 (Kothrud)',
      dept: 'Road Maintenance',
      priority: 'P2',
      severity: 'HIGH',
      slaCountdown: '21h 40m remaining',
      status: 'WORK_ORDER_ASSIGNED',
      confidence: 94,
      reportedBy: 'Rajesh Patil',
      reportedTime: '45 mins ago',
    },
    {
      id: 'NGS-2026-000140',
      issue: 'Fallen Banyan Tree Branch Blocking Transit Lane',
      category: 'Tree Hazard',
      ward: 'Ward 24 (Aundh)',
      dept: 'Road Maintenance',
      priority: 'P2',
      severity: 'HIGH',
      slaCountdown: '9h 10m remaining',
      status: 'WORK_ORDER_ASSIGNED',
      confidence: 91,
      reportedBy: 'Sneha Deshmukh',
      reportedTime: '1h 20m ago',
    },
    {
      id: 'NGS-2026-000139',
      issue: 'Solid Waste Overflow near Hadapsar Commercial Hub',
      category: 'Garbage Accumulation',
      ward: 'Ward 31 (Hadapsar)',
      dept: 'Solid Waste Management',
      priority: 'P3',
      severity: 'MEDIUM',
      slaCountdown: '18h 05m remaining',
      status: 'IN_PROGRESS',
      confidence: 93,
      reportedBy: 'Amit Shinde',
      reportedTime: '2h 10m ago',
    },
    {
      id: 'NGS-2026-000138',
      issue: 'Streetlight Failure along Kalyani Nagar Corridor',
      category: 'Streetlight',
      ward: 'Ward 07 (Koregaon Park)',
      dept: 'Electrical',
      priority: 'P2',
      severity: 'HIGH',
      slaCountdown: '14h 30m remaining',
      status: 'RESOLVED_AWAITING_VERIFICATION',
      confidence: 92,
      reportedBy: 'Priya Kulkarni',
      reportedTime: '5h 15m ago',
    },
  ];

  const filtered = complaints.filter((c) => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) || c.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleInspect = async (complaint) => {
    setSelectedComplaint(complaint);
    setIsAnalyzing(true);
    const result = await classifyComplaint(complaint.issue, true);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
              AI-ROUTED CIVIC ISSUE QUEUE
            </span>
            <span className="text-[10px] font-mono text-slate-500">[{activeMunicipality.code}]</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">Complaints & Incident Telemetry</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Real-time civic issue intake, classification, and assignment management for {activeMunicipality.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-brand-deepCharcoal text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            Total Issues: <span className="text-amber-600 dark:text-amber-400 font-bold">{complaints.length}</span>
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by ID or title..."
            className="w-full bg-slate-50 dark:bg-brand-deepCharcoal border border-slate-200 dark:border-slate-800 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-slate-200 outline-none focus:border-amber-500 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 dark:bg-brand-deepCharcoal border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Tree Hazard">Tree Hazard</option>
            <option value="Garbage Accumulation">Garbage Accumulation</option>
            <option value="Streetlight">Streetlight</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono uppercase text-slate-600 dark:text-slate-400">
                <th className="py-3 px-3.5">Complaint ID</th>
                <th className="py-3 px-3.5">Issue Title</th>
                <th className="py-3 px-3.5">Ward</th>
                <th className="py-3 px-3.5">Department</th>
                <th className="py-3 px-3.5">Priority</th>
                <th className="py-3 px-3.5">SLA Countdown</th>
                <th className="py-3 px-3.5">AI Confidence</th>
                <th className="py-3 px-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3.5 font-mono text-amber-600 dark:text-amber-400 font-semibold">{item.id}</td>
                  <td className="py-3 px-3.5 text-slate-900 dark:text-slate-200 font-medium max-w-xs truncate">{item.issue}</td>
                  <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400">{item.ward}</td>
                  <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400">{item.dept}</td>
                  <td className="py-3 px-3.5">
                    <Badge variant={item.priority === 'P1' ? 'p1' : item.priority === 'P2' ? 'p2' : 'p3'}>
                      {item.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                    <span>{item.slaCountdown}</span>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{item.confidence}%</td>
                  <td className="py-3 px-3.5 text-right">
                    <Button variant="secondary" size="sm" onClick={() => handleInspect(item)} icon={Eye}>
                      Inspect AI
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Analysis Detail Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title={`AI Intelligence Breakdown - ${selectedComplaint?.id}`}
        subtitle="Automated Triage & Confidence Telemetry"
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-brand-deepCharcoal border border-slate-800">
              <h4 className="text-xs font-bold text-slate-200">{selectedComplaint.issue}</h4>
              <p className="text-[11px] text-slate-400 mt-1">Reported by {selectedComplaint.reportedBy} ({selectedComplaint.reportedTime})</p>
            </div>

            {isAnalyzing ? (
              <div className="p-6 text-center text-xs font-mono text-amber-400 animate-pulse">
                Running Neural Mesh Classification...
              </div>
            ) : (
              aiAnalysis && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">AI Category Match</span>
                      <p className="font-bold text-slate-200 text-sm mt-0.5">{aiAnalysis.category.replace('cat-', '').toUpperCase()}</p>
                      <span className="text-[10px] font-mono text-emerald-400">{aiAnalysis.confidence}% Confidence</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Recommended SLA</span>
                      <p className="font-bold text-amber-400 text-sm mt-0.5">{aiAnalysis.recommendedSlaHours} Hours</p>
                      <span className="text-[10px] text-slate-400">Severity: {aiAnalysis.severity}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-amber-500/20 text-slate-300">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Analysis Summary</span>
                    <p className="mt-1 leading-relaxed">{aiAnalysis.summary}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-brand-deepCharcoal border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{AI_DISCLAIMER}</span>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
