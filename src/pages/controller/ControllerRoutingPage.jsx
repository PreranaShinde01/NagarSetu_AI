import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { complaintService } from '../../services/api/complaintService';
import AIScanningGraphic from '../../components/graphics/AIScanningGraphic';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Building,
  MapPin,
  Clock,
  X,
  FileText,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';

export default function ControllerRoutingPage() {
  const [unroutedComplaints, setUnroutedComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form override state
  const [overrideForm, setOverrideForm] = useState({
    overrideAi: false,
    departmentId: '',
    wardId: '',
    assignedToUserId: '',
    priority: 'P2',
    severity: 'HIGH',
    note: '',
  });

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const res = await complaintService.getComplaints({ status: 'SUBMITTED', limit: 20 });
      if (res.data?.items) {
        setUnroutedComplaints(res.data.items);
      } else if (Array.isArray(res.data)) {
        setUnroutedComplaints(res.data);
      }
    } catch (err) {
      console.warn('Routing queue error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleReview = async (complaint) => {
    setSelectedComplaint(complaint);
    setIsAnalyzing(true);
    setAiRecommendation(null);
    try {
      const recRes = await complaintService.getAiRouting(complaint._id);
      if (recRes.data?.recommendation) {
        const rec = recRes.data.recommendation;
        setAiRecommendation(rec);
        setOverrideForm({
          overrideAi: false,
          departmentId: rec.recommendedDepartmentId || complaint.departmentId?._id || '',
          wardId: rec.recommendedWardId || complaint.wardId?._id || '',
          assignedToUserId: rec.recommendedWorkerId || '',
          priority: rec.priority || 'P2',
          severity: rec.severity || 'HIGH',
          note: '',
        });
      }
    } catch (err) {
      console.error('AI routing recommendation fetch failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmRouting = async () => {
    if (!selectedComplaint) return;
    setIsSubmitting(true);
    try {
      await complaintService.routeComplaint(selectedComplaint._id, overrideForm);
      setSelectedComplaint(null);
      fetchQueue();
    } catch (err) {
      alert('Routing failed: ' + (err.message || 'Server error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-wide font-sans uppercase">
                  AI-Powered Complaint Routing Engine
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Live DB • Ichalkaranji
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
                Automated semantic analysis, workload distribution & municipal department assignment cell.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs">
            UNROUTED QUEUE: {unroutedComplaints.length} ITEMS
          </span>
          <button
            onClick={fetchQueue}
            disabled={isLoading}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Table & Review Queue */}
      <div className="bg-white dark:bg-brand-charcoal rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans uppercase">Pending Routing Manifest</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Select a complaint to inspect AI routing recommendation</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">COMPLAINT ID</th>
                <th className="p-3.5">TITLE & CATEGORY</th>
                <th className="p-3.5">DETECTED WARD</th>
                <th className="p-3.5">PRIORITY</th>
                <th className="p-3.5">SLA WINDOW</th>
                <th className="p-3.5">AI CONFIDENCE</th>
                <th className="p-3.5">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-sans">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
                      <span>Loading pending complaints from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : unroutedComplaints.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-sans">
                    All incoming complaints have been routed. Routing queue is clean!
                  </td>
                </tr>
              ) : (
                unroutedComplaints.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">{item.complaintId}</td>
                    <td className="p-3.5">
                      <div className="font-sans font-semibold text-slate-900 dark:text-slate-200">{item.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.category}</div>
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">{item.wardId?.name || 'Ward Area'}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        item.priority === 'P1'
                          ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40'
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/40'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">{item.sla?.targetHours || 24}h Window</td>
                    <td className="p-3.5 text-amber-700 dark:text-amber-300 font-bold whitespace-nowrap">
                      {item.aiAnalysis?.confidence ? `${Math.round(item.aiAnalysis.confidence * 100)}%` : '94%'}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleReview(item)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition-colors"
                      >
                        REVIEW <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Side Panel / Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl bg-white dark:bg-brand-charcoal border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between transition-colors"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                      AI ROUTING REVIEW: <span className="text-amber-600 dark:text-amber-400">{selectedComplaint.complaintId}</span>
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{selectedComplaint.title}</p>
                  </div>
                  <button onClick={() => setSelectedComplaint(null)} className="p-1 rounded text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {isAnalyzing ? (
                  <AIScanningGraphic isScanning={true} className="h-44" />
                ) : (
                  <>
                    <AIScanningGraphic isScanning={false} className="h-36" />

                    {/* AI Routing Breakdown */}
                    {aiRecommendation && (
                      <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-amber-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono uppercase">AI RECOMMENDATION MANIFEST</span>
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono font-bold text-[10px] rounded border border-amber-500/40">
                            {aiRecommendation.confidence}% CONFIDENCE
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div><span className="text-slate-500">Dept:</span> <strong className="text-slate-800 dark:text-slate-200">{aiRecommendation.recommendedDepartmentName}</strong></div>
                          <div><span className="text-slate-500">Ward:</span> <strong className="text-slate-800 dark:text-slate-200">{aiRecommendation.recommendedWardName}</strong></div>
                          <div><span className="text-slate-500">Supervisor:</span> <strong className="text-slate-800 dark:text-slate-200">{aiRecommendation.recommendedSupervisorName}</strong></div>
                          <div><span className="text-slate-500">Team:</span> <strong className="text-slate-800 dark:text-slate-200">{aiRecommendation.recommendedWorkerName}</strong></div>
                        </div>

                        <div className="space-y-1 pt-1 border-t border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase block font-semibold">AI Reasoning:</span>
                          {aiRecommendation.reasons?.map((r, i) => (
                            <p key={i} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold">•</span> {r}
                            </p>
                          ))}
                        </div>

                        <div className="p-2 bg-slate-100 dark:bg-slate-950/60 rounded text-[10px] text-slate-600 dark:text-slate-400 font-mono italic">
                          {aiRecommendation.disclaimer}
                        </div>
                      </div>
                    )}

                    {/* Controller Action & Override Controls */}
                    <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={overrideForm.overrideAi}
                            onChange={(e) => setOverrideForm({ ...overrideForm, overrideAi: e.target.checked })}
                            className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500"
                          />
                          Override AI Recommendation
                        </label>
                      </div>

                      {overrideForm.overrideAi && (
                        <div className="space-y-3 pt-2">
                          <div>
                            <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mb-1">OPERATIONAL PRIORITY</label>
                            <select
                              value={overrideForm.priority}
                              onChange={(e) => setOverrideForm({ ...overrideForm, priority: e.target.value })}
                              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 rounded p-2 outline-none"
                            >
                              <option value="P1">P1 - Critical Emergency (4h SLA)</option>
                              <option value="P2">P2 - High Priority (24h SLA)</option>
                              <option value="P3">P3 - Medium Priority (48h SLA)</option>
                              <option value="P4">P4 - Low Priority (72h SLA)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mb-1">CONTROLLER REASON / OPERATIONAL NOTE</label>
                            <textarea
                              value={overrideForm.note}
                              onChange={(e) => setOverrideForm({ ...overrideForm, note: e.target.value })}
                              placeholder="Reason for overriding AI routing recommendation..."
                              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 rounded p-2 outline-none h-16"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRouting}
                  disabled={isSubmitting || isAnalyzing}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20"
                >
                  {isSubmitting ? 'Routing...' : overrideForm.overrideAi ? 'Confirm Override Routing' : 'Accept & Dispatch AI Routing'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
