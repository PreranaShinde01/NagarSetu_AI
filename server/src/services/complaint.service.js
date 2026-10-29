import Complaint from '../models/Complaint.js';
import AuditLog from '../models/AuditLog.js';
import SLAConfig from '../models/SLAConfig.js';
import WorkOrder from '../models/WorkOrder.js';
import Notification from '../models/Notification.js';
import { generateNextComplaintId } from './counter.service.js';
import { resolveMunicipalityId } from './municipality.service.js';
import { ApiError } from '../middleware/error.middleware.js';

export async function createComplaint(payload, user, requestId) {
  const complaintId = await generateNextComplaintId();

  // SLA Calculation
  let targetHours = 24;
  if (payload.priority === 'P1') targetHours = 4;
  else if (payload.priority === 'P2') targetHours = 24;
  else if (payload.priority === 'P3') targetHours = 48;
  else if (payload.priority === 'P4') targetHours = 72;

  const deadline = new Date(Date.now() + targetHours * 3600000);

  const complaint = await Complaint.create({
    complaintId,
    citizenId: user._id,
    municipalityId: payload.municipalityId || user.municipalityId,
    wardId: payload.wardId || user.wardId,
    departmentId: payload.departmentId,
    title: payload.title,
    description: payload.description,
    category: payload.category,
    subcategory: payload.subcategory || null,
    location: payload.location,
    priority: payload.priority || 'P2',
    severity: payload.severity || 'HIGH',
    status: 'SUBMITTED',
    statusHistory: [
      {
        status: 'SUBMITTED',
        changedBy: user._id,
        timestamp: new Date(),
        note: 'Initial grievance created via NagarSetu REST API',
      },
    ],
    sla: {
      targetHours,
      deadline,
      state: 'ON_TRACK',
    },
    media: payload.media || { images: [], videos: [] },
  });

  // Audit Log
  await AuditLog.create({
    actorId: user._id,
    actorRole: user.role,
    municipalityId: complaint.municipalityId,
    action: 'COMPLAINT_CREATED',
    entityType: 'Complaint',
    entityId: complaint._id.toString(),
    metadata: { complaintId: complaint.complaintId, priority: complaint.priority },
    requestId,
  }).catch(() => {});

  return complaint;
}

export async function listComplaints(queryParams, dataScopeFilter = {}) {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 20;
  const skip = (page - 1) * limit;

  // Combine RBAC dataScopeFilter with request query parameters
  const filter = { ...dataScopeFilter };

  if (queryParams.status) filter.status = queryParams.status;
  if (queryParams.priority) filter.priority = queryParams.priority;
  if (queryParams.severity) filter.severity = queryParams.severity;
  if (queryParams.category) filter.category = queryParams.category;
  
  // Scoped user filters if authorized
  if (queryParams.wardId && !filter.wardId) filter.wardId = queryParams.wardId;
  if (queryParams.departmentId && !filter.departmentId) filter.departmentId = queryParams.departmentId;
  if (queryParams.municipalityId && !filter.municipalityId) {
    const resolvedId = await resolveMunicipalityId(queryParams.municipalityId);
    filter.municipalityId = resolvedId || queryParams.municipalityId;
  }

  if (queryParams.search) {
    filter.$or = [
      { complaintId: { $regex: queryParams.search, $options: 'i' } },
      { title: { $regex: queryParams.search, $options: 'i' } },
      { description: { $regex: queryParams.search, $options: 'i' } },
    ];
  }

  const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
  const sortField = queryParams.sortBy || 'createdAt';

  const [items, total] = await Promise.all([
    Complaint.find(filter)
      .populate('citizenId', 'name email phone')
      .populate('municipalityId', 'name code')
      .populate('wardId', 'name number code')
      .populate('departmentId', 'name code')
      .populate('assignedToUserId', 'name role email')
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit),
    Complaint.countDocuments(filter),
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getComplaintById(id, dataScopeFilter = {}) {
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: id } : { complaintId: id };

  const finalQuery = { ...query, ...dataScopeFilter };

  const complaint = await Complaint.findOne(finalQuery)
    .populate('citizenId', 'name email phone')
    .populate('municipalityId', 'name code state')
    .populate('wardId', 'name number code officerUserId')
    .populate('departmentId', 'name code headName')
    .populate('assignedToUserId', 'name role email')
    .populate('workOrderId')
    .populate('statusHistory.changedBy', 'name role');

  if (!complaint) {
    throw new ApiError(404, 'Complaint not found or out of authorized data scope.', 'COMPLAINT_NOT_FOUND');
  }

  return complaint;
}

export async function routeComplaint(id, routingData, actorUser, requestId) {
  const complaint = await getComplaintById(id);

  const isOverride = routingData.overrideAi === true;

  if (routingData.wardId) complaint.wardId = routingData.wardId;
  if (routingData.departmentId) complaint.departmentId = routingData.departmentId;
  if (routingData.priority) complaint.priority = routingData.priority;
  if (routingData.severity) complaint.severity = routingData.severity;
  if (routingData.assignedToUserId) {
    complaint.assignedToUserId = routingData.assignedToUserId;
    complaint.assignedByUserId = actorUser._id;
  }

  complaint.status = 'ROUTED';
  complaint.statusHistory.push({
    status: 'ROUTED',
    changedBy: actorUser._id,
    timestamp: new Date(),
    note: isOverride
      ? `Controller override routing: ${routingData.note || 'Manual controller assignment'}`
      : `Controller accepted AI recommendation: ${routingData.note || 'AI routing confirmed'}`,
  });

  await complaint.save();

  await AuditLog.create({
    actorId: actorUser._id,
    actorRole: actorUser.role,
    municipalityId: complaint.municipalityId._id || complaint.municipalityId,
    action: isOverride ? 'ROUTE_OVERRIDDEN' : 'ROUTE_APPROVED',
    entityType: 'Complaint',
    entityId: complaint._id.toString(),
    metadata: {
      complaintId: complaint.complaintId,
      departmentId: routingData.departmentId,
      wardId: routingData.wardId,
      assignedToUserId: routingData.assignedToUserId,
      isOverride,
      requestId,
    },
    timestamp: new Date(),
  }).catch(() => {});

  return complaint;
}

export async function citizenVerifyComplaint(id, confirmed, reason, actorUser, requestId) {
  const complaint = await getComplaintById(id);

  if (actorUser.role === 'CITIZEN' && complaint.citizenId._id.toString() !== actorUser._id.toString()) {
    throw new ApiError(403, 'You are not authorized to verify another citizen’s complaint.', 'FORBIDDEN');
  }

  if (confirmed) {
    complaint.status = 'CLOSED';
    complaint.statusHistory.push({
      status: 'CLOSED',
      changedBy: actorUser._id,
      timestamp: new Date(),
      note: 'Citizen confirmed resolution. Case file closed.',
    });

    if (complaint.workOrderId) {
      await WorkOrder.findByIdAndUpdate(complaint.workOrderId, {
        status: 'VERIFIED',
        verificationStatus: 'CITIZEN_APPROVED',
      });
    }

    await AuditLog.create({
      actorId: actorUser._id,
      actorRole: actorUser.role,
      municipalityId: complaint.municipalityId._id || complaint.municipalityId,
      action: 'COMPLAINT_CLOSED',
      entityType: 'Complaint',
      entityId: complaint._id.toString(),
      metadata: { complaintId: complaint.complaintId, requestId },
      timestamp: new Date(),
    }).catch(() => {});
  } else {
    complaint.status = 'REOPENED';
    complaint.statusHistory.push({
      status: 'REOPENED',
      changedBy: actorUser._id,
      timestamp: new Date(),
      note: `Citizen rejected resolution: ${reason || 'Issue still exists'}. Reopening case file.`,
    });

    if (complaint.workOrderId) {
      await WorkOrder.findByIdAndUpdate(complaint.workOrderId, {
        status: 'REJECTED',
        verificationStatus: 'CITIZEN_REJECTED',
      });
    }

    await AuditLog.create({
      actorId: actorUser._id,
      actorRole: actorUser.role,
      municipalityId: complaint.municipalityId._id || complaint.municipalityId,
      action: 'COMPLAINT_REOPENED',
      entityType: 'Complaint',
      entityId: complaint._id.toString(),
      metadata: { complaintId: complaint.complaintId, reason, requestId },
      timestamp: new Date(),
    }).catch(() => {});
  }

  await complaint.save();
  return complaint;
}

export async function updateComplaintStatus(id, updateData, user, requestId) {
  const complaint = await getComplaintById(id);

  if (updateData.status) {
    complaint.status = updateData.status;
    complaint.statusHistory.push({
      status: updateData.status,
      changedBy: user._id,
      timestamp: new Date(),
      note: updateData.note || `Status updated to ${updateData.status}`,
    });
  }

  if (updateData.priority) complaint.priority = updateData.priority;
  if (updateData.severity) complaint.severity = updateData.severity;
  if (updateData.assignedToUserId) {
    complaint.assignedToUserId = updateData.assignedToUserId;
    complaint.assignedByUserId = user._id;
  }

  await complaint.save();

  await AuditLog.create({
    actorId: user._id,
    actorRole: user.role,
    municipalityId: complaint.municipalityId,
    action: 'COMPLAINT_UPDATED',
    entityType: 'Complaint',
    entityId: complaint._id.toString(),
    metadata: { complaintId: complaint.complaintId, newStatus: complaint.status },
    requestId,
  }).catch(() => {});

  return complaint;
}

export async function reopenComplaint(id, reason, user, requestId) {
  return await citizenVerifyComplaint(id, false, reason, user, requestId);
}
