import * as slaService from '../services/sla.service.js';

export async function handleGetSlaSummary(req, res, next) {
  try {
    const municipalityId = req.query.municipalityId || req.user?.municipalityId;
    const summary = await slaService.getSlaSummary(municipalityId);
    res.status(200).json({
      success: true,
      data: summary,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetAtRisk(req, res, next) {
  try {
    const municipalityId = req.query.municipalityId || req.user?.municipalityId;
    const items = await slaService.getAtRiskItems(municipalityId);
    res.status(200).json({
      success: true,
      data: items,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetBreached(req, res, next) {
  try {
    const municipalityId = req.query.municipalityId || req.user?.municipalityId;
    const items = await slaService.getBreachedItems(municipalityId);
    res.status(200).json({
      success: true,
      data: items,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}
