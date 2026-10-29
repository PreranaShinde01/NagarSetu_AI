import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/api/complaintService';
import { workOrderService } from '../../services/api/workOrderService';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  FileText,
} from 'lucide-react';

export default function ControllerComplaintsPage() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [creatingWO, setCreatingWO] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await complaintService.getComplaints({
        search,
        status: statusFilter,
        priority: priorityFilter,
        limit: 50,
      });
      if (res.data?.items) setComplaints(res.data.items);
      else if (Array.isArray(res.data)) setComplaints(res.data);
    } catch (err) {
      console.warn('Complaints fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, priorityFilter]);

  const handleCreateWorkOrder = async (complaint) => {
    setCreatingWO(true);
    try {
      await workOrderService.createWorkOrder({
        complaintId: complaint._id,
        departmentId: complaint.departmentId?._id || complaint.departmentId,
        title: `Work Order for ${complaint.complaintId}`,
        instructions: 'Inspect site, resolve issue, and submit before/after resolution evidence.',
        priority: complaint.priority || 'P2',
      });
      alert(`Work Order issued successfully for ${complaint.complaintId}!`);
      fetchComplaints();
    } catch (err) {
      alert('Failed to issue Work Order: ' + (err.message || 'Error'));
    } finally {
      setCreatingWO(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Municipal Complaints Operations Queue
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Live DB • Ichalkaranji
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                Complete municipal grievance ledger, operational status tracking & field work order dispatch.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchComplaints}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-brand-charcoal p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-sm transition-colors">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchComplaints()}
            placeholder="Search by Complaint ID, title, address..."
            className="bg-transparent text-slate-900 dark:text-slate-200 outline-none w-full text-xs placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-amber-400 px-3 py-2 rounded-lg outline-none text-xs cursor-pointer"
          >
            <option value="">All Operational Statuses</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="ROUTED">ROUTED</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="AWAITING_VERIFICATION">AWAITING_VERIFICATION</option>
            <option value="AWAITING_CITIZEN_VERIFICATION">AWAITING_CITIZEN_VERIFICATION</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
            <option value="ESCALATED">ESCALATED</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-amber-400 px-3 py-2 rounded-lg outline-none text-xs cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="P1">P1 - Critical</option>
            <option value="P2">P2 - High</option>
            <option value="P3">P3 - Medium</option>
            <option value="P4">P4 - Low</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white dark:bg-brand-charcoal rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">COMPLAINT ID</th>
                <th className="p-3.5">TITLE & CATEGORY</th>
                <th className="p-3.5">WARD & DEPT</th>
                <th className="p-3.5">PRIORITY</th>
                <th className="p-3.5">SLA STATUS</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-sans">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
                      <span>Loading complaints from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-sans">
                    No complaints matching criteria.
                  </td>
                </tr>
              ) : (
                complaints.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">{item.complaintId}</td>
                    <td className="p-3.5">
                      <div className="font-sans font-semibold text-slate-900 dark:text-slate-200">{item.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.category}</div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="text-slate-800 dark:text-slate-200">{item.wardId?.name || 'Ward Area'}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.departmentId?.name || 'Department'}</div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        item.priority === 'P1'
                          ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40'
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/40'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`text-[10px] font-bold ${
                        item.sla?.state === 'BREACHED'
                          ? 'text-rose-600 dark:text-rose-400'
                          : item.sla?.state === 'AT_RISK'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {item.sla?.state || 'ON_TRACK'}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/citizen/complaint/${item.complaintId}`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold rounded border border-slate-300 dark:border-slate-700 flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Case File
                      </button>

                      {!item.workOrderId && (
                        <button
                          onClick={() => handleCreateWorkOrder(item)}
                          disabled={creatingWO}
                          className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-bold rounded border border-amber-300 dark:border-amber-500/40 transition-colors"
                        >
                          Dispatch WO
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
