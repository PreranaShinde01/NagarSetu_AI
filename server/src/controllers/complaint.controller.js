import * as complaintService from '../services/complaint.service.js';
import * as routingService from '../services/routing.service.js';
import { sendSuccess } from '../utils/response.js';

export async function handleCreateComplaint(req, res, next) {
  try {
    const complaint = await complaintService.createComplaint(req.body, req.user, req.requestId);
    return sendSuccess(res, { complaint }, 'Complaint created successfully.', 201);
  } catch (error) {
    next(error);
  }
}

export async function handleListComplaints(req, res, next) {
  try {
    const result = await complaintService.listComplaints(req.query, req.dataScopeFilter);
    return sendSuccess(res, result, 'Complaints list retrieved.');
  } catch (error) {
    next(error);
  }
}

export async function handleGetComplaintById(req, res, next) {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id, req.dataScopeFilter);
    return sendSuccess(res, { complaint }, 'Complaint details retrieved.');
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateComplaint(req, res, next) {
  try {
    const complaint = await complaintService.updateComplaintStatus(
      req.params.id,
      req.body,
      req.user,
      req.requestId
    );
    return sendSuccess(res, { complaint }, 'Complaint updated successfully.');
  } catch (error) {
    next(error);
  }
}

export async function handleGetComplaintTimeline(req, res, next) {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id, req.dataScopeFilter);
    return sendSuccess(res, { timeline: complaint.statusHistory }, 'Complaint timeline retrieved.');
  } catch (error) {
    next(error);
  }
}

export async function handleReopenComplaint(req, res, next) {
  try {
    const { reason } = req.body;
    const complaint = await complaintService.reopenComplaint(req.params.id, reason, req.user, req.requestId);
    return sendSuccess(res, { complaint }, 'Complaint reopened successfully.');
  } catch (error) {
    next(error);
  }
}

export async function handleGetAiRouting(req, res, next) {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id, req.dataScopeFilter);
    const recommendation = await routingService.generateAiRoutingRecommendation(complaint);
    return sendSuccess(res, { recommendation }, 'AI routing recommendation generated.');
  } catch (error) {
    next(error);
  }
}

export async function handleRouteComplaint(req, res, next) {
  try {
    const complaint = await complaintService.routeComplaint(req.params.id, req.body, req.user, req.requestId);
    return sendSuccess(res, { complaint }, 'Complaint routed successfully.');
  } catch (error) {
    next(error);
  }
}

export async function handleCitizenVerifyComplaint(req, res, next) {
  try {
    const { confirmed, reason } = req.body;
    const complaint = await complaintService.citizenVerifyComplaint(
      req.params.id,
      confirmed,
      reason,
      req.user,
      req.requestId
    );
    return sendSuccess(
      res,
      { complaint },
      confirmed ? 'Complaint resolution confirmed and closed.' : 'Complaint resolution rejected and reopened.'
    );
  } catch (error) {
    next(error);
  }
}
