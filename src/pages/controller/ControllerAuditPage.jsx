import React, { useState, useEffect } from 'react';
import { auditService } from '../../services/api/auditService';
import { ShieldCheck, RefreshCw, Filter, Search, Database, UserCheck, Calendar, Activity } from 'lucide-react';

export default function ControllerAuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await auditService.getAuditLogs({
        action: actionFilter || undefined,
        search: searchTerm || undefined,
        limit: 50,
      });
      if (res && res.data) {
        setLogs(res.data);
        setTotalCount(res.pagination?.total || res.data.length);
      } else if (Array.isArray(res)) {
        setLogs(res);
        setTotalCount(res.length);
      }
    } catch (err) {
      console.warn('Audit fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const getActionBadgeColor = (action) => {
    if (!action) return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    if (action.includes('CREATE') || action.includes('STARTED')) {
      return 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
    if (action.includes('APPROV') || action.includes('COMPLETE') || action.includes('CLOSED')) {
      return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    }
    if (action.includes('ESCALAT') || action.includes('REJECT') || action.includes('REOPEN')) {
      return 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    }
    return 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Municipal Append-Only Audit Log
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Live DB • Ichalkaranji
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                Cryptographically tracked operational event ledger for municipal governance accountability.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300">
            <Activity className="w-3.5 h-3.5 text-amber-500" />
            <span>{totalCount} Total Events</span>
          </div>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-brand-charcoal p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs transition-colors shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by action, role, entity, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg outline-none focus:border-amber-500 text-xs font-sans transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg text-xs transition-colors shrink-0"
          >
            Filter
          </button>
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">ACTION:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-amber-400 font-mono px-3 py-2 rounded-lg outline-none text-xs transition-colors cursor-pointer"
          >
            <option value="">All Operational Audit Actions</option>
            <option value="COMPLAINT_CREATED">COMPLAINT_CREATED</option>
            <option value="ROUTE_APPROVED">ROUTE_APPROVED</option>
            <option value="WORK_ORDER_CREATED">WORK_ORDER_CREATED</option>
            <option value="WORK_ORDER_ACCEPTED">WORK_ORDER_ACCEPTED</option>
            <option value="WORK_STARTED">WORK_STARTED</option>
            <option value="WORK_COMPLETED">WORK_COMPLETED</option>
            <option value="VERIFICATION_APPROVED">VERIFICATION_APPROVED</option>
            <option value="COMPLAINT_CLOSED">COMPLAINT_CLOSED</option>
            <option value="COMPLAINT_REOPENED">COMPLAINT_REOPENED</option>
            <option value="USER_LOGIN">USER_LOGIN</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-brand-charcoal rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5 whitespace-nowrap">Timestamp</th>
                <th className="p-3.5 whitespace-nowrap">Actor</th>
                <th className="p-3.5 whitespace-nowrap">Role</th>
                <th className="p-3.5 whitespace-nowrap">Action</th>
                <th className="p-3.5 whitespace-nowrap">Entity Target</th>
                <th className="p-3.5">Metadata / Governance Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-sans">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
                      <span>Loading real-time audit ledger from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-sans">
                    <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                    <p className="font-medium text-slate-700 dark:text-slate-300">No audit events match the current filter.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the filter or search query.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const dateStr = log.timestamp || log.createdAt;
                  const dateObj = dateStr ? new Date(dateStr) : null;
                  return (
                    <tr
                      key={log._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap font-mono">
                        {dateObj ? dateObj.toLocaleString('en-IN', {
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true,
                        }) : 'Just now'}
                      </td>
                      <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap font-sans">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.actorId?.name || (log.actorRole === 'NAGARSETU_CONTROLLER' ? 'Controller Desk' : 'System Actor')}</span>
                        </div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[10px] font-mono border border-slate-200 dark:border-slate-700">
                          {log.actorRole || 'SYSTEM'}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getActionBadgeColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap font-mono text-[11px]">
                        <span className="font-semibold text-slate-800 dark:text-slate-300">{log.entityType}</span>
                        {log.entityId && (
                          <span className="text-slate-500 dark:text-slate-400 ml-1">
                            (#{String(log.entityId).slice(-6)})
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 max-w-md">
                        <div className="truncate font-mono text-[11px] bg-slate-50 dark:bg-slate-900/60 px-2 py-1 rounded border border-slate-200 dark:border-slate-800/80">
                          {log.metadata && Object.keys(log.metadata).length > 0
                            ? JSON.stringify(log.metadata)
                            : `Audit event for ${log.entityType || 'resource'}`}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
