import AuditLog from '../models/AuditLog.js';
import { resolveMunicipalityId } from '../services/municipality.service.js';

export async function handleGetAuditLogs(req, res, next) {
  try {
    const filter = {};

    // Citizens only see logs for their own actions
    if (req.user?.role === 'CITIZEN') {
      filter.actorId = req.user._id;
    } else {
      // For municipal controller/staff, scope to municipality if provided or user has one
      const targetMuni = req.query.municipalityId || req.user?.municipalityId;
      if (targetMuni) {
        const resolvedId = await resolveMunicipalityId(targetMuni);
        if (resolvedId) {
          filter.$or = [
            { municipalityId: resolvedId },
            { municipalityId: { $exists: false } },
            { municipalityId: null },
          ];
        }
      }
    }

    if (req.query.action) {
      filter.action = req.query.action;
    }
    if (req.query.entityType) {
      filter.entityType = req.query.entityType;
    }
    if (req.query.search || req.query.q) {
      const searchRegex = new RegExp(req.query.search || req.query.q, 'i');
      const searchFilter = [
        { action: searchRegex },
        { actorRole: searchRegex },
        { entityType: searchRegex },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchFilter }];
        delete filter.$or;
      } else {
        filter.$or = searchFilter;
      }
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('actorId', 'name role email')
        .populate('municipalityId', 'name code')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      AuditLog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}
