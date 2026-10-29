import React, { useState, useEffect } from 'react';
import { useMunicipality } from '../context/MunicipalityContext';
import { useLanguage } from '../context/LanguageContext';
import { getWorkOrdersForMunicipality } from '../config/municipalityWorkOrders';
import { workOrderService } from '../services/api/workOrderService';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import {
  ClipboardList,
  HardHat,
  Clock,
  CheckCircle2,
  MapPin,
  Building2,
  Search,
  Filter,
  AlertTriangle,
  Eye,
  RefreshCw,
  ShieldCheck,
  Layers,
  User,
  ExternalLink,
  X,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function WorkOrdersPage() {
  const { activeMunicipality, switchMunicipality, municipalities } = useMunicipality();
  const { isMarathi, t } = useLanguage();

  const [workOrders, setWorkOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadWorkOrders();
  }, [activeMunicipality.id]);

  const loadWorkOrders = async () => {
    setIsLoading(true);
    try {
      const res = await workOrderService.getWorkOrders({
        municipalityId: activeMunicipality._id || activeMunicipality.id,
      });

      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((wo) => ({
          id: wo.workOrderId || wo.id || `WO-${wo._id?.substring(0, 6)}`,
          complaintId: wo.complaintId?.complaintId || wo.complaintId || 'NGS-LINKED',
          title: wo.title || `Work Order for ${wo.complaintId?.title || 'Reported Issue'}`,
          area: wo.complaintId?.location?.address || wo.complaintId?.location?.area || `${activeMunicipality.name} Area`,
          ward: wo.wardId?.name || `${activeMunicipality.name} Ward`,
          department: wo.departmentId?.name || 'Municipal Works',
          deptCode: wo.departmentId?.code || 'WORKS',
          priority: wo.priority || 'P2',
          worker: wo.assignedWorkerId?.name || 'Assigned Crew',
          supervisor: wo.supervisorId?.name || 'Department Supervisor',
          team: wo.assignedTeam || 'Field Response Unit',
          status: wo.status || 'IN_PROGRESS',
          due: wo.dueAt ? `Due by ${new Date(wo.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'In 4 hours',
          instructions: wo.instructions || 'Inspect site, execute required repairs, and upload verified completion photos.',
          evidence: wo.completionEvidence || {},
          createdAt: wo.createdAt ? new Date(wo.createdAt).toLocaleDateString() : 'Today',
        }));
        setWorkOrders(mapped);
        return;
      }
    } catch (err) {
      console.warn('Backend work order fetch fallback:', err.message);
    }

    const citySpecificOrders = getWorkOrdersForMunicipality(activeMunicipality.id);
    setWorkOrders(citySpecificOrders);
    setIsLoading(false);
  };

  const filteredOrders = workOrders.filter((wo) => {
    const matchesStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'IN_PROGRESS' && wo.status === 'IN_PROGRESS') ||
      (selectedStatus === 'WORK_COMPLETED' && (wo.status === 'WORK_COMPLETED' || wo.status === 'COMPLETED')) ||
      (selectedStatus === 'VERIFICATION_PENDING' && (wo.status === 'VERIFICATION_PENDING' || wo.status === 'AWAITING_VERIFICATION'));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      wo.id.toLowerCase().includes(q) ||
      wo.title.toLowerCase().includes(q) ||
      wo.area.toLowerCase().includes(q) ||
      wo.ward.toLowerCase().includes(q) ||
      wo.worker.toLowerCase().includes(q) ||
      wo.department.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'WORK_COMPLETED':
      case 'COMPLETED':
        return <Badge variant="success">WORK COMPLETED</Badge>;
      case 'VERIFICATION_PENDING':
      case 'AWAITING_VERIFICATION':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/30">
            VERIFICATION PENDING
          </span>
        );
      case 'IN_PROGRESS':
        return <Badge variant="amber">IN PROGRESS</Badge>;
      default:
        return <Badge variant="info">{status}</Badge>;
    }
  };

  const getPriorityBadge = (prio) => {
    if (prio === 'P1') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40">
          P1 CRITICAL
        </span>
      );
    }
    if (prio === 'P2') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40">
          P2 HIGH
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        P3 MEDIUM
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Municipality Context */}
      <div className="p-6 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
              {t('wo_header_badge')}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">[{activeMunicipality.code}]</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 font-sans">
            {activeMunicipality.name}{' '}
            <span className="text-amber-600 dark:text-amber-400">Work Order Management</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
            Active field crew dispatch, emergency works, and resolution proof verification for {activeMunicipality.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">{workOrders.length} {t('wo_active_count')}</span>
          </div>
          <button
            onClick={loadWorkOrders}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors shadow-sm"
            title="Refresh Work Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Jurisdiction Status Pill */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 font-bold">
          <Building2 className="w-3.5 h-3.5 text-amber-500" /> JURISDICTION:
        </span>
        <div className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 border border-amber-400 shadow-sm font-bold flex items-center gap-1.5">
          <span>{activeMunicipality.name}</span>
          <span className="text-[10px] px-1 py-0.2 rounded font-mono bg-slate-950/20 text-slate-950">
            {activeMunicipality.code}
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-brand-charcoal p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg px-3 py-1.5 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Work Order ID, team, area..."
            className="bg-transparent text-slate-900 dark:text-slate-200 outline-none w-full text-xs placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: t('wo_tab_all'), count: workOrders.length },
            { id: 'IN_PROGRESS', label: t('wo_tab_in_progress'), count: workOrders.filter((w) => w.status === 'IN_PROGRESS').length },
            { id: 'WORK_COMPLETED', label: t('wo_tab_completed'), count: workOrders.filter((w) => w.status === 'WORK_COMPLETED' || w.status === 'COMPLETED').length },
            { id: 'VERIFICATION_PENDING', label: t('wo_tab_pending_qc'), count: workOrders.filter((w) => w.status === 'VERIFICATION_PENDING' || w.status === 'AWAITING_VERIFICATION').length },
          ].map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/40 font-bold'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Work Orders Cards Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-brand-charcoal p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3 transition-colors shadow-sm">
          <ClipboardList className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-200">No Matching Work Orders</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono max-w-sm mx-auto">
            No active work orders found matching the filter "{selectedStatus}" for {activeMunicipality.name}.
          </p>
          <button
            onClick={() => {
              setSelectedStatus('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg font-mono border border-slate-300 dark:border-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((wo) => (
            <Card
              key={wo.id}
              className="p-5 space-y-4 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all shadow-sm dark:shadow-lg flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: ID + Status + Priority */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-700 dark:text-amber-400 text-xs font-extrabold tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {wo.id}
                    </span>
                    {getPriorityBadge(wo.priority)}
                  </div>
                  {getStatusBadge(wo.status)}
                </div>

                {/* Work Order Title */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-3 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-snug">
                  {wo.title}
                </h3>

                {/* Geographic Area & Landmark */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/90 space-y-1.5">
                  <div className="flex items-start gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] leading-tight">
                        {wo.area}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block mt-0.5">
                        {wo.ward}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/60 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="text-amber-600 dark:text-amber-500 font-bold">{wo.department}</span>
                    <span>•</span>
                    <span>Complaint: <strong className="text-slate-700 dark:text-slate-300">{wo.complaintId}</strong></span>
                  </div>
                </div>

                {/* Personnel Details */}
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 mt-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <HardHat className="w-3.5 h-3.5 text-slate-400" /> Field Crew:
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{wo.worker}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Supervisor:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{wo.supervisor}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                      <Clock className="w-3.5 h-3.5" /> Due:
                    </span>
                    <span className="font-mono text-amber-700 dark:text-amber-300 font-semibold">{wo.due}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedWorkOrder(wo)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors font-mono"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>Inspect Case File</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Case File & Evidence Inspection Modal */}
      {selectedWorkOrder && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal border border-slate-200 dark:border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto transition-colors">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-700 dark:text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {selectedWorkOrder.id}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">[{activeMunicipality.code}]</span>
                  {getStatusBadge(selectedWorkOrder.status)}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">{selectedWorkOrder.title}</h3>
              </div>
              <button
                onClick={() => setSelectedWorkOrder(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Geographical Jurisdiction */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-slate-100 block">{selectedWorkOrder.area}</strong>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] mt-0.5">
                    {selectedWorkOrder.ward} • {activeMunicipality.name}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500 block">DEPARTMENT:</span>
                  <span className="text-slate-800 dark:text-slate-300 font-semibold">{selectedWorkOrder.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">LINKED GRIEVANCE:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{selectedWorkOrder.complaintId}</span>
                </div>
              </div>
            </div>

            {/* Field Crew Instructions */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-bold block">
                Field Instructions & Scope:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed font-sans">
                {selectedWorkOrder.instructions}
              </p>
            </div>

            {/* Assigned Personnel */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">ASSIGNED WORKER</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold block mt-0.5">{selectedWorkOrder.worker}</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 block">{selectedWorkOrder.team}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SUPERVISOR</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold block mt-0.5">{selectedWorkOrder.supervisor}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{selectedWorkOrder.due}</span>
              </div>
            </div>

            {/* Verification Status & Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedWorkOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Close Case File
              </button>
              {selectedWorkOrder.status === 'VERIFICATION_PENDING' && (
                <button
                  onClick={() => {
                    alert(`Supervisor approval recorded for ${selectedWorkOrder.id}`);
                    setSelectedWorkOrder(null);
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Close Work Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
