import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Clock, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CitizenComplaintCard({ complaint }) {
  const navigate = useNavigate();

  const getStatusVariant = (status) => {
    switch (status) {
      case 'RESOLVED':
        return 'success';
      case 'AWAITING_VERIFICATION':
        return 'amber';
      case 'IN_PROGRESS':
        return 'info';
      case 'REOPENED':
        return 'critical';
      case 'ESCALATED':
        return 'critical';
      default:
        return 'default';
    }
  };

  const wardName = complaint.wardId?.name || complaint.ward || 'Ward 12';
  const formattedDate = new Date(complaint.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card
      onClick={() => navigate(`/citizen/complaint/${complaint.complaintId || complaint._id}`)}
      className="p-4 border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-amber-400 font-bold text-xs">
          {complaint.complaintId || 'NGS-2026-000143'}
        </span>
        <div className="flex items-center gap-1.5">
          <Badge variant={complaint.priority === 'P1' ? 'p1' : 'p2'}>{complaint.priority || 'P2'}</Badge>
          <Badge variant={getStatusVariant(complaint.status)}>{complaint.status || 'SUBMITTED'}</Badge>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
          {complaint.title}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-2 mt-1">{complaint.description}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span className="truncate max-w-[120px]">{wardName}</span>
        </div>

        <div className="flex items-center gap-1 text-slate-300">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>SLA: 18h remaining</span>
        </div>
      </div>
    </Card>
  );
}
