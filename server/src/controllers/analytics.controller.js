import * as analyticsService from '../services/analytics.service.js';

export async function handleGetOverview(req, res, next) {
  try {
    const municipalityId = req.query.municipalityId || req.user?.municipalityId;
    const overview = await analyticsService.getOverviewAnalytics(municipalityId);
    res.status(200).json({
      success: true,
      data: overview,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetComplaintsAnalytics(req, res, next) {
  try {
    const municipalityId = req.query.municipalityId || req.user?.municipalityId;
    const trends = await analyticsService.getComplaintTrends(municipalityId);
    const categories = await analyticsService.getCategoryDistribution(municipalityId);
    res.status(200).json({
      success: true,
      data: { trends, categories },
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetDepartmentsAnalytics(req, res, next) {
  try {
    const municipalityId = req.query.municipalityId || req.user?.municipalityId;
    const departments = await analyticsService.getDepartmentPerformance(municipalityId);
    res.status(200).json({
      success: true,
      data: departments,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetWardsAnalytics(req, res, next) {
  try {
    const municipalityId = req.query.municipalityId || req.user?.municipalityId;
    const wards = await analyticsService.getWardPerformance(municipalityId);
    res.status(200).json({
      success: true,
      data: wards,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetPublicTransparency(req, res, next) {
  try {
    const municipalityId = req.query.municipalityId;
    const metrics = await analyticsService.getPublicTransparencyMetrics(municipalityId);
    res.status(200).json({
      success: true,
      data: metrics,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}
