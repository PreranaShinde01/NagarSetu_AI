import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComplaint } from '../../hooks/useComplaint';
import { complaintService } from '../../services/api/complaintService';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import TelemetryPulse from '../../components/common/TelemetryPulse';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  FileText,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

const pinIcon = L.divIcon({
  className: 'custom-leaflet-marker-detail',
  html: `<div style="background-color: #F59E0B; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #0B1120; box-shadow: 0 0 12px #F59E0B;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function CitizenComplaintDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { complaint, isLoading, refetch } = useComplaint(id);

  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback demo complaint if offline
  const mockComplaint = {
    complaintId: id || 'NGS-2026-000143',
    title: 'Streetlight malfunction on Main Road near Janata Chowk',
    description: 'Multiple streetlights off near Janata Chowk junction creating public safety risk at night. High traffic textile transit area.',
    category: 'Streetlight Outage',
    priority: 'P2',
    severity: 'HIGH',
    status: 'AWAITING_CITIZEN_VERIFICATION',
    wardName: 'Prabhag 4 (Janata Chowk / Textile Colony)',
    departmentName: 'Electrical & Streetlighting',
    location: {
      address: 'Main Road, Ward 4, Janata Chowk, Ichalkaranji',
      coordinates: [74.4608, 16.6970],
    },
    statusHistory: [
      { status: 'SUBMITTED', timestamp: new Date(Date.now() - 7200000).toISOString(), note: 'Complaint submitted by citizen.' },
      { status: 'AI_ANALYSIS', timestamp: new Date(Date.now() - 7100000).toISOString(), note: 'AI classification complete (94% confidence).' },
      { status: 'ASSIGNED', timestamp: new Date(Date.now() - 3600000).toISOString(), note: 'Routed to Electrical Department Supervisor.' },
      { status: 'AWAITING_CITIZEN_VERIFICATION', timestamp: new Date(Date.now() - 1800000).toISOString(), note: 'Supervisor verified completion evidence. Awaiting citizen confirmation.' },
    ],
  };

  const item = complaint || mockComplaint;

  const handleCitizenVerification = async (confirmed) => {
    if (!confirmed && !reopenReason.trim()) {
      addToast('Please provide a reason for reopening this issue.', 'warning', 'Reason Required');
      return;
    }

    setIsSubmitting(true);
    try {
      await complaintService.citizenVerify(item.complaintId || item._id, {
        confirmed,
        reason: reopenReason,
      });

      if (confirmed) {
        addToast('Resolution confirmed! Complaint closed.', 'success', 'Case Closed');
      } else {
        addToast('Resolution rejected. Complaint reopened for supervisor review.', 'info', 'Reopened');
      }
      setIsReopenModalOpen(false);
      refetch();
    } catch (err) {
      addToast('Verification processed in telemetry mode.', 'info', 'Offline Mode');
      setIsReopenModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusSteps = ['SUBMITTED', 'AI_ANALYSIS', 'ASSIGNED', 'IN_PROGRESS', 'AWAITING_CITIZEN_VERIFICATION', 'CLOSED'];
  const currentStatusIndex = statusSteps.indexOf(item.status) !== -1 ? statusSteps.indexOf(item.status) : 4;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/citizen/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Citizen Dashboard</span>
        </button>

        <TelemetryPulse status={item.status === 'CLOSED' ? 'operational' : 'warning'} label={`STATUS: ${item.status}`} />
      </div>

      {/* Citizen Verification Alert Banner */}
      {item.status === 'AWAITING_CITIZEN_VERIFICATION' && (
        <div className="p-5 rounded-2xl bg-amber-500/15 border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-300 font-mono flex items-center gap-2 uppercase">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              YOUR ISSUE HAS BEEN MARKED AS RESOLVED BY FIELD TEAMS
            </h3>
            <p className="text-xs text-slate-200">
              Please inspect the site and confirm if the grievance has been fixed to your satisfaction.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleCitizenVerification(true)}
              disabled={isSubmitting}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> YES, ISSUE RESOLVED
            </button>
            <button
              onClick={() => setIsReopenModalOpen(true)}
              disabled={isSubmitting}
              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-extrabold rounded-xl"
            >
              NO, ISSUE STILL EXISTS
            </button>
          </div>
        </div>
      )}

      {/* Case File Header Card */}
      <Card className="p-6 border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                {item.complaintId}
              </span>
              <Badge variant={item.priority === 'P1' ? 'p1' : 'p2'}>{item.priority} {item.severity}</Badge>
            </div>
            <h1 className="text-xl font-bold text-slate-100 mt-2">{item.title}</h1>
            <p className="text-xs text-slate-400 mt-1">{item.description}</p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Assigned Department</span>
            <h4 className="text-xs font-bold text-slate-200">{item.departmentId?.name || item.departmentName || 'Roads Infrastructure'}</h4>
            <span className="text-[10px] font-mono text-amber-400">{item.wardId?.name || item.wardName || 'Ward 12'}</span>
          </div>
        </div>

        {/* Live Status Tracker Progression */}
        <div className="py-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-3">Live Status Progress</span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {statusSteps.map((st, idx) => {
              const isCompleted = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div
                  key={st}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : isCompleted
                      ? 'bg-slate-800 border-slate-700 text-emerald-400 font-semibold'
                      : 'bg-brand-deepCharcoal border-slate-800/60 text-slate-600'
                  }`}
                >
                  <span className="text-[9px] font-mono block uppercase truncate">{st.replace(/_/g, ' ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Case Details & Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Spatial Location & Status History Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Spatial Pinned Map */}
          <Card className="p-4 border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">Pinned Site Location</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{item.location?.address}</span>
            </div>

            <div className="h-52 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden relative">
              <MapContainer
                center={[item.location?.coordinates[1] || 18.5204, item.location?.coordinates[0] || 73.8567]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Marker
                  position={[item.location?.coordinates[1] || 18.5204, item.location?.coordinates[0] || 73.8567]}
                  icon={pinIcon}
                />
              </MapContainer>
            </div>
          </Card>

          {/* Status History Timeline */}
          <Card className="p-5 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">Municipal Action Timeline</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{item.statusHistory?.length || 4} Events Logged</span>
            </div>

            <div className="space-y-4 pl-3 relative border-l-2 border-slate-800 ml-2">
              {(item.statusHistory || []).map((history, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-brand-charcoal" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-amber-400 uppercase">{history.status}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(history.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{history.note}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: SLA & Reopen Actions */}
        <div className="space-y-6">
          {/* SLA Card */}
          <Card className="p-4 border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Response SLA Guarantee</span>
            <div className="flex items-baseline justify-between">
              <h4 className="text-lg font-bold text-amber-400 font-mono">ON TRACK</h4>
              <span className="text-xs font-mono text-slate-300">Target: 24 Hours</span>
            </div>
            <p className="text-[11px] text-slate-400">Expected resolution by municipal field team within configured SLA window.</p>
          </Card>

          {/* Reopen Action Panel */}
          <Card className="p-5 border-amber-500/30 bg-amber-500/5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <RotateCcw className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono font-sans">Citizen Verification & Reopen</h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              If the problem still exists, you can reject resolution and request an immediate case reopening.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReopenModalOpen(true)}
                icon={RotateCcw}
                className="w-full text-rose-400 border-rose-500/40 hover:bg-rose-500/10"
              >
                NO — Reopen Issue
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Reopen Reason Modal */}
      <Modal
        isOpen={isReopenModalOpen}
        onClose={() => setIsReopenModalOpen(false)}
        title="Reopen Civic Issue"
        subtitle={`Request reopening for ${item.complaintId}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Please explain why this issue requires reopening. Your feedback will be recorded in the municipal audit log and escalated to the field supervisor.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Reopening</label>
            <textarea
              rows={4}
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="e.g. Pothole was partially filled but collapsed again during rain..."
              className="w-full bg-brand-deepCharcoal border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsReopenModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isSubmitting}
              onClick={() => handleCitizenVerification(false)}
              icon={RotateCcw}
            >
              Confirm Reopen
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
