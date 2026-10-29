import * as escalationService from '../services/escalation.service.js';

export async function handleListEscalations(req, res, next) {
  try {
    const filter = { ...(req.dataScopeFilter || {}) };
    if (req.query.status) filter.status = req.query.status;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await escalationService.listEscalations(filter, page, limit);
    res.status(200).json({
      success: true,
      data: result.escalations,
      pagination: result.pagination,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleCreateEscalation(req, res, next) {
  try {
    const escalation = await escalationService.createEscalation(req.body, req.user, req.requestId);
    res.status(201).json({
      success: true,
      data: escalation,
      message: `Escalation ${escalation.escalationId} triggered successfully.`,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleReassignEscalation(req, res, next) {
  try {
    const { targetUserId, notes } = req.body;
    const escalation = await escalationService.reassignEscalation(
      req.params.id,
      targetUserId,
      notes,
      req.user,
      req.requestId
    );
    res.status(200).json({
      success: true,
      data: escalation,
      message: 'Escalation reassigned successfully.',
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}
