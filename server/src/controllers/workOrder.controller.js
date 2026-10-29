import * as workOrderService from '../services/workOrder.service.js';
import { resolveMunicipalityId } from '../services/municipality.service.js';

export async function handleCreateWorkOrder(req, res, next) {
  try {
    const workOrder = await workOrderService.createWorkOrder(req.body, req.user, req.requestId);
    res.status(201).json({
      success: true,
      data: workOrder,
      message: `Work Order ${workOrder.workOrderId} created successfully.`,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleListWorkOrders(req, res, next) {
  try {
    const filter = { ...(req.dataScopeFilter || {}) };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.departmentId) filter.departmentId = req.query.departmentId;
    if (req.query.wardId) filter.wardId = req.query.wardId;
    if (req.query.assignedWorkerId) filter.assignedWorkerId = req.query.assignedWorkerId;
    if (req.query.municipalityId && !filter.municipalityId) {
      const resolvedId = await resolveMunicipalityId(req.query.municipalityId);
      filter.municipalityId = resolvedId || req.query.municipalityId;
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await workOrderService.listWorkOrders(filter, page, limit);
    res.status(200).json({
      success: true,
      data: result.workOrders,
      pagination: result.pagination,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetWorkOrderById(req, res, next) {
  try {
    const workOrder = await workOrderService.getWorkOrderById(req.params.id);
    res.status(200).json({
      success: true,
      data: workOrder,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleAcceptWorkOrder(req, res, next) {
  try {
    const workOrder = await workOrderService.acceptWorkOrder(req.params.id, req.user, req.requestId);
    res.status(200).json({
      success: true,
      data: workOrder,
      message: 'Work Order accepted by worker.',
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleStartWorkOrder(req, res, next) {
  try {
    const workOrder = await workOrderService.startWorkOrder(req.params.id, req.user, req.requestId);
    res.status(200).json({
      success: true,
      data: workOrder,
      message: 'Field work marked as in progress.',
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleCompleteWorkOrder(req, res, next) {
  try {
    const workOrder = await workOrderService.completeWorkOrder(req.params.id, req.body, req.user, req.requestId);
    res.status(200).json({
      success: true,
      data: workOrder,
      message: 'Resolution evidence submitted for supervisor verification.',
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleVerifyWorkOrder(req, res, next) {
  try {
    const { decision, notes } = req.body; // 'APPROVE' | 'REJECT' | 'REWORK'
    const workOrder = await workOrderService.supervisorVerifyWorkOrder(
      req.params.id,
      decision,
      notes,
      req.user,
      req.requestId
    );
    res.status(200).json({
      success: true,
      data: workOrder,
      message: `Supervisor verification recorded (${decision}).`,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}
