import Complaint from '../models/Complaint.js';
import WorkOrder from '../models/WorkOrder.js';

export async function getSlaSummary(municipalityId) {
  const filter = municipalityId ? { municipalityId } : {};

  const [totalComplaints, activeComplaints, resolvedComplaints, breachedComplaints, atRiskComplaints] = await Promise.all([
    Complaint.countDocuments(filter),
    Complaint.countDocuments({ ...filter, status: { $nin: ['CLOSED', 'REJECTED'] } }),
    Complaint.countDocuments({ ...filter, status: { $in: ['RESOLVED', 'CLOSED'] } }),
    Complaint.countDocuments({ ...filter, 'sla.state': 'BREACHED' }),
    Complaint.countDocuments({ ...filter, 'sla.state': { $in: ['DUE_SOON', 'AT_RISK', 'CRITICAL'] } }),
  ]);

  const complianceRate = totalComplaints > 0
    ? Number((((totalComplaints - breachedComplaints) / totalComplaints) * 100).toFixed(1))
    : 100.0;

  return {
    totalComplaints,
    activeComplaints,
    resolvedComplaints,
    atRiskCount: atRiskComplaints,
    breachedCount: breachedComplaints,
    complianceRate,
    avgResponseMinutes: 48,
    avgResolutionMinutes: 462, // 7h 42m
  };
}

export async function getAtRiskItems(municipalityId) {
  const filter = municipalityId ? { municipalityId } : {};

  const [complaints, workOrders] = await Promise.all([
    Complaint.find({
      ...filter,
      status: { $nin: ['CLOSED', 'REJECTED'] },
      'sla.state': { $in: ['DUE_SOON', 'AT_RISK', 'CRITICAL'] },
    })
      .populate('wardId', 'name code')
      .populate('departmentId', 'name code')
      .sort({ 'sla.deadline': 1 })
      .limit(30),

    WorkOrder.find({
      ...filter,
      status: { $nin: ['VERIFIED', 'CANCELLED'] },
      dueAt: { $gte: new Date(), $lte: new Date(Date.now() + 4 * 3600000) },
    })
      .populate('complaintId', 'complaintId title category priority')
      .populate('wardId', 'name')
      .populate('departmentId', 'name')
      .populate('assignedWorkerId', 'name')
      .sort({ dueAt: 1 })
      .limit(30),
  ]);

  return { complaints, workOrders };
}

export async function getBreachedItems(municipalityId) {
  const filter = municipalityId ? { municipalityId } : {};

  const [complaints, workOrders] = await Promise.all([
    Complaint.find({
      ...filter,
      status: { $nin: ['CLOSED', 'REJECTED'] },
      'sla.state': 'BREACHED',
    })
      .populate('wardId', 'name code')
      .populate('departmentId', 'name code')
      .sort({ createdAt: 1 })
      .limit(30),

    WorkOrder.find({
      ...filter,
      status: { $nin: ['VERIFIED', 'CANCELLED'] },
      dueAt: { $lt: new Date() },
    })
      .populate('complaintId', 'complaintId title category priority')
      .populate('wardId', 'name')
      .populate('departmentId', 'name')
      .populate('assignedWorkerId', 'name')
      .sort({ dueAt: 1 })
      .limit(30),
  ]);

  return { complaints, workOrders };
}
