import * as authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
import AuditLog from '../models/AuditLog.js';

export async function handleLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    // Audit log
    await AuditLog.create({
      actorId: user._id,
      actorRole: user.role,
      municipalityId: user.municipalityId || null,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user._id.toString(),
      metadata: { email: user.email },
      requestId: req.requestId,
    }).catch(() => {});

    return sendSuccess(res, { user, token }, 'Authentication successful.');
  } catch (error) {
    next(error);
  }
}

export async function handleRegister(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);

    await AuditLog.create({
      actorId: user._id,
      actorRole: user.role,
      municipalityId: user.municipalityId || null,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user._id.toString(),
      metadata: { email: user.email, role: user.role },
      requestId: req.requestId,
    }).catch(() => {});

    return sendSuccess(res, { user, token }, 'User registration successful.', 201);
  } catch (error) {
    next(error);
  }
}

export async function handleGetMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user._id);
    return sendSuccess(res, { user }, 'User profile retrieved.');
  } catch (error) {
    next(error);
  }
}
