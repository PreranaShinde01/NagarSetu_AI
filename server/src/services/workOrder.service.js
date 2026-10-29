import WorkOrder from '../models/WorkOrder.js';
import Complaint from '../models/Complaint.js';
import AuditLog from '../models/AuditLog.js';
import Notification from '../models/Notification.js';
import { generateNextWorkOrderId } from './counter.service.js';
import { ApiError } from '../middleware/error.middleware.js';

export async function createWorkOrder(data, actorUser, requestId) {
  const isObjectId = typeof data.complaintId === 'string' ? data.complaintId.match(/^[0-9a-fA-F]{24}$/) : true;
  const complaint = await Complaint.findOne(
    isObjectId
      ? { $or: [{ _id: data.complaintId }, { complaintId: data.complaintId }] }
      : { complaintId: data.complaintId }
  );
  if (!complaint) {
    throw new ApiError(404, 'Associated complaint not found.', 'NOT_FOUND');
  }

  const existingActiveWO = await WorkOrder.findOne({
    complaintId: complaint._id,
    status: { $in: ['CREATED', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'AWAITING_VERIFICATION'] },
  });

  if (existingActiveWO && !data.allowDuplicate) {
    throw new ApiError(
      400,
      `An active Work Order (${existingActiveWO.workOrderId}) already exists for this complaint.`,
      'DUPLICATE_WORK_ORDER'
    );
  }

  const workOrderId = await generateNextWorkOrderId();
  const dueAt = new Date(Date.now() + (data.slaHours || complaint.sla?.targetHours || 24) * 3600000);

  const workOrder = await WorkOrder.create({
    workOrderId,
    complaintId: complaint._id,
    municipalityId: complaint.municipalityId,
    wardId: complaint.wardId,
    departmentId: data.departmentId || complaint.departmentId,
    supervisorId: data.supervisorId || actorUser._id,
    assignedWorkerId: data.assignedWorkerId || null,
    assignedTeam: data.assignedTeam || 'Field Response Unit A',
    title: data.title || `Work Order for ${complaint.complaintId}`,
    instructions: data.instructions || 'Inspect site, repair damaged infrastructure, and upload before/after evidence.',
    priority: data.priority || complaint.priority || 'P2',
    status: data.assignedWorkerId ? 'ASSIGNED' : 'CREATED',
    dueAt,
    isDemoRecord: true,
  });

  // Link WorkOrder back to Complaint & update status
  complaint.workOrderId = workOrder._id;
  complaint.status = 'ASSIGNED';
  complaint.statusHistory.push({
    status: 'ASSIGNED',
    changedBy: actorUser._id,
    note: `Work Order ${workOrderId} issued and assigned.`,
    timestamp: new Date(),
  });
  await complaint.save();

  // Create Audit Log
  await AuditLog.create({
    actorId: actorUser._id,
    actorRole: actorUser.role,
    municipalityId: complaint.municipalityId,
    action: 'WORK_ORDER_CREATED',
    entityType: 'WorkOrder',
    entityId: workOrder._id.toString(),
    metadata: { workOrderId, complaintId: complaint.complaintId, requestId },
    timestamp: new Date(),
  });

  // Notify assigned worker if present
  if (data.assignedWorkerId) {
    await Notification.create({
      userId: data.assignedWorkerId,
      municipalityId: complaint.municipalityId,
      type: 'NEW_WORK_ORDER',
      title: `New Work Order ${workOrderId}`,
      message: `You have been assigned Work Order ${workOrderId} for ${complaint.title}.`,
      data: { workOrderId: workOrder._id, complaintId: complaint._id },
    });
  }

  return workOrder;
}

export async function listWorkOrders(filter = {}, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [workOrders, total] = await Promise.all([
    WorkOrder.find(filter)
      .populate('complaintId', 'complaintId title category priority location status media')
      .populate('wardId', 'name number code')
      .populate('departmentId', 'name code')
      .populate('assignedWorkerId', 'name email phone')
      .populate('supervisorId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    WorkOrder.countDocuments(filter),
  ]);

  return {
    workOrders,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getWorkOrderById(id) {
  const workOrder = await WorkOrder.findById(id)
    .populate('complaintId')
    .populate('wardId')
    .populate('departmentId')
    .populate('assignedWorkerId', 'name email phone')
    .populate('supervisorId', 'name email');

  if (!workOrder) {
    throw new ApiError(404, 'Work order not found.', 'NOT_FOUND');
  }
  return workOrder;
}

export async function acceptWorkOrder(id, actorUser, requestId) {
  const workOrder = await getWorkOrderById(id);
  workOrder.status = 'ACCEPTED';
  workOrder.acceptedAt = new Date();
  await workOrder.save();

  // Update complaint status
  const complaint = await Complaint.findById(workOrder.complaintId._id || workOrder.complaintId);
  if (complaint) {
    complaint.status = 'ACCEPTED';
    complaint.statusHistory.push({
      status: 'ACCEPTED',
      changedBy: actorUser._id,
      note: `Field worker ${actorUser.name} accepted work order.`,
    });
    await complaint.save();
  }

  await AuditLog.create({
    actorId: actorUser._id,
    actorRole: actorUser.role,
    municipalityId: workOrder.municipalityId,
    action: 'WORK_ORDER_ACCEPTED',
    entityType: 'WorkOrder',
    entityId: workOrder._id.toString(),
    metadata: { workOrderId: workOrder.workOrderId, requestId },
    timestamp: new Date(),
  });

  return workOrder;
}

export async function startWorkOrder(id, actorUser, requestId) {
  const workOrder = await getWorkOrderById(id);
  workOrder.status = 'IN_PROGRESS';
  workOrder.startedAt = new Date();
  await workOrder.save();

  const complaint = await Complaint.findById(workOrder.complaintId._id || workOrder.complaintId);
  if (complaint) {
    complaint.status = 'IN_PROGRESS';
    complaint.statusHistory.push({
      status: 'IN_PROGRESS',
      changedBy: actorUser._id,
      note: `Field operations started by worker ${actorUser.name}.`,
    });
    await complaint.save();
  }

  await AuditLog.create({
    actorId: actorUser._id,
    actorRole: actorUser.role,
    municipalityId: workOrder.municipalityId,
    action: 'WORK_STARTED',
    entityType: 'WorkOrder',
    entityId: workOrder._id.toString(),
    metadata: { workOrderId: workOrder.workOrderId, requestId },
    timestamp: new Date(),
  });

  return workOrder;
}

export async function completeWorkOrder(id, evidenceData, actorUser, requestId) {
  const workOrder = await getWorkOrderById(id);
  workOrder.status = 'COMPLETED';
  workOrder.completedAt = new Date();
  workOrder.verificationStatus = 'PENDING_SUPERVISOR';
  workOrder.completionNotes = evidenceData.notes || 'Site work completed.';
  workOrder.completionEvidence = {
    beforeImages: evidenceData.beforeImages || [],
    afterImages: evidenceData.afterImages || [],
    videoUrl: evidenceData.videoUrl || '',
    notes: evidenceData.notes || '',
    gpsVerified: evidenceData.gpsVerified !== false,
    location: evidenceData.location || { type: 'Point', coordinates: [73.8567, 18.5204] },
    completedAt: new Date(),
  };

  await workOrder.save();

  const complaint = await Complaint.findById(workOrder.complaintId._id || workOrder.complaintId);
  if (complaint) {
    complaint.status = 'AWAITING_VERIFICATION';
    complaint.statusHistory.push({
      status: 'AWAITING_VERIFICATION',
      changedBy: actorUser._id,
      note: `Field work completed by ${actorUser.name}. Pending supervisor verification.`,
    });
    await complaint.save();
  }

  await AuditLog.create({
    actorId: actorUser._id,
    actorRole: actorUser.role,
    municipalityId: workOrder.municipalityId,
    action: 'WORK_COMPLETED',
    entityType: 'WorkOrder',
    entityId: workOrder._id.toString(),
    metadata: { workOrderId: workOrder.workOrderId, requestId },
    timestamp: new Date(),
  });

  // Notify Supervisor
  if (workOrder.supervisorId) {
    await Notification.create({
      userId: workOrder.supervisorId._id || workOrder.supervisorId,
      municipalityId: workOrder.municipalityId,
      type: 'VERIFICATION_PENDING',
      title: `Verification Required: ${workOrder.workOrderId}`,
      message: `Worker ${actorUser.name} has submitted resolution evidence for Work Order ${workOrder.workOrderId}.`,
      data: { workOrderId: workOrder._id, complaintId: workOrder.complaintId },
    });
  }

  return workOrder;
}

export async function supervisorVerifyWorkOrder(id, decision, notes, actorUser, requestId) {
  // decision: 'APPROVE' | 'REJECT' | 'REWORK'
  const workOrder = await getWorkOrderById(id);
  const complaint = await Complaint.findById(workOrder.complaintId._id || workOrder.complaintId);

  if (decision === 'APPROVE') {
    workOrder.status = 'VERIFIED';
    workOrder.verificationStatus = 'SUPERVISOR_APPROVED';
    await workOrder.save();

    if (complaint) {
      complaint.status = 'AWAITING_CITIZEN_VERIFICATION';
      complaint.statusHistory.push({
        status: 'AWAITING_CITIZEN_VERIFICATION',
        changedBy: actorUser._id,
        note: `Supervisor ${actorUser.name} verified completion: ${notes || 'Approved'}.`,
      });
      await complaint.save();

      // Notify Citizen
      await Notification.create({
        userId: complaint.citizenId,
        municipalityId: complaint.municipalityId,
        type: 'RESOLUTION_APPROVED',
        title: `Resolution Verification Request: ${complaint.complaintId}`,
        message: `Your reported complaint ${complaint.complaintId} has been resolved by field teams. Please verify and confirm closure.`,
        data: { complaintId: complaint._id },
      });
    }

    await AuditLog.create({
      actorId: actorUser._id,
      actorRole: actorUser.role,
      municipalityId: workOrder.municipalityId,
      action: 'VERIFICATION_APPROVED',
      entityType: 'WorkOrder',
      entityId: workOrder._id.toString(),
      metadata: { workOrderId: workOrder.workOrderId, decision, requestId },
      timestamp: new Date(),
    });
  } else {
    // REJECT or REWORK
    workOrder.status = 'IN_PROGRESS';
    workOrder.verificationStatus = 'SUPERVISOR_REJECTED';
    workOrder.reworkReason = notes || 'Supervisor requested rework/clarification.';
    await workOrder.save();

    if (complaint) {
      complaint.status = 'IN_PROGRESS';
      complaint.statusHistory.push({
        status: 'IN_PROGRESS',
        changedBy: actorUser._id,
        note: `Supervisor ${actorUser.name} rejected completion: ${notes}. Rework initiated.`,
      });
      await complaint.save();
    }

    await AuditLog.create({
      actorId: actorUser._id,
      actorRole: actorUser.role,
      municipalityId: workOrder.municipalityId,
      action: 'VERIFICATION_REJECTED',
      entityType: 'WorkOrder',
      entityId: workOrder._id.toString(),
      metadata: { workOrderId: workOrder.workOrderId, decision, notes, requestId },
      timestamp: new Date(),
    });
  }

  return workOrder;
}
