import Escalation from '../models/Escalation.js';
import Complaint from '../models/Complaint.js';
import WorkOrder from '../models/WorkOrder.js';
import AuditLog from '../models/AuditLog.js';
import { generateNextEscalationId } from './counter.service.js';

export async function listEscalations(filter = {}, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [escalations, total] = await Promise.all([
    Escalation.find(filter)
      .populate('complaintId')
      .populate('workOrderId')
      .populate('wardId', 'name number code')
      .populate('departmentId', 'name code')
      .populate('escalatedFrom', 'name role')
      .populate('escalatedTo', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Escalation.countDocuments(filter),
  ]);

  return {
    escalations,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function createEscalation(data, actorUser, requestId) {
  const complaint = await Complaint.findById(data.complaintId);
  if (!complaint) {
    throw new ApiError(404, 'Complaint not found for escalation.', 'NOT_FOUND');
  }

  const escalationId = await generateNextEscalationId();
  const level = data.level || (complaint.status === 'ESCALATED' ? 3 : 2);

  const escalation = await Escalation.create({
    escalationId,
    complaintId: complaint._id,
    workOrderId: data.workOrderId || complaint.workOrderId || null,
    municipalityId: complaint.municipalityId,
    wardId: complaint.wardId,
    departmentId: complaint.departmentId,
    level,
    reason: data.reason || 'SLA threshold breached without resolution.',
    trigger: data.trigger || 'SLA_BREACH',
    status: 'ACTIVE',
    escalatedFrom: actorUser._id,
    escalatedTo: data.escalatedTo || null,
  });

  // Update Complaint Status
  complaint.status = 'ESCALATED';
  complaint.statusHistory.push({
    status: 'ESCALATED',
    changedBy: actorUser._id,
    note: `Escalation level ${level} logged: ${data.reason}`,
  });
  await complaint.save();

  await AuditLog.create({
    actorId: actorUser._id,
    actorRole: actorUser.role,
    municipalityId: complaint.municipalityId,
    action: 'ESCALATED',
    entityType: 'Escalation',
    entityId: escalation._id.toString(),
    metadata: { escalationId, complaintId: complaint.complaintId, level, requestId },
    timestamp: new Date(),
  });

  return escalation;
}

export async function reassignEscalation(id, targetUserId, notes, actorUser, requestId) {
  const escalation = await Escalation.findById(id);
  if (!escalation) {
    throw new ApiError(404, 'Escalation not found.', 'NOT_FOUND');
  }

  escalation.status = 'REASSIGNED';
  escalation.escalatedTo = targetUserId;
  await escalation.save();

  const complaint = await Complaint.findById(escalation.complaintId);
  if (complaint) {
    complaint.assignedToUserId = targetUserId;
    complaint.status = 'REASSIGNED';
    complaint.statusHistory.push({
      status: 'REASSIGNED',
      changedBy: actorUser._id,
      note: `Escalated complaint reassigned by Controller: ${notes || 'Reassigned to senior supervisor'}`,
    });
    await complaint.save();
  }

  await AuditLog.create({
    actorId: actorUser._id,
    actorRole: actorUser.role,
    municipalityId: escalation.municipalityId,
    action: 'REASSIGNED',
    entityType: 'Escalation',
    entityId: escalation._id.toString(),
    metadata: { escalationId: escalation.escalationId, targetUserId, requestId },
    timestamp: new Date(),
  });

  return escalation;
}
