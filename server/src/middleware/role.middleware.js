import { hasPermission, getRoleScope, DATA_SCOPES } from '../utils/permissions.js';
import { ApiError } from './error.middleware.js';

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User must be authenticated before checking permissions.', 'UNAUTHENTICATED'));
    }

    if (!hasPermission(req.user.role, permission)) {
      return next(
        new ApiError(
          403,
          `Access forbidden. Role '${req.user.role}' lacks permission '${permission}'.`,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
}

export function applyDataScope(req, res, next) {
  if (!req.user) {
    return next(new ApiError(401, 'User must be authenticated to resolve data scope.', 'UNAUTHENTICATED'));
  }

  const scope = getRoleScope(req.user.role);
  let filter = {};

  switch (scope) {
    case DATA_SCOPES.OWN:
      filter = { citizenId: req.user._id };
      break;

    case DATA_SCOPES.WARD:
      if (req.user.wardId) {
        filter = { wardId: req.user.wardId };
      } else {
        filter = { municipalityId: req.user.municipalityId };
      }
      break;

    case DATA_SCOPES.DEPARTMENT:
      if (req.user.role === 'MUNICIPAL_WORKER') {
        filter = { assignedToUserId: req.user._id };
      } else if (req.user.departmentId) {
        filter = { departmentId: req.user.departmentId };
      } else {
        filter = { municipalityId: req.user.municipalityId };
      }
      break;

    case DATA_SCOPES.MUNICIPALITY:
      if (req.user.municipalityId) {
        filter = { municipalityId: req.user.municipalityId };
      }
      break;

    case DATA_SCOPES.SYSTEM:
      // SUPER_ADMIN has unrestricted access across all municipalities
      filter = {};
      break;

    default:
      filter = { citizenId: req.user._id };
      break;
  }

  req.dataScopeFilter = filter;
  req.userScope = scope;
  next();
}
