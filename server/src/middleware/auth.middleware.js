import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';
import { ApiError } from './error.middleware.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication token required. Header must be "Authorization: Bearer <token>".', 'UNAUTHENTICATED');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired authentication token.', 'INVALID_TOKEN');
    }

    const user = await User.findById(decoded.userId || decoded.sub);
    if (!user || !user.isActive) {
      throw new ApiError(401, 'User account associated with this token is invalid or inactive.', 'USER_INACTIVE');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
