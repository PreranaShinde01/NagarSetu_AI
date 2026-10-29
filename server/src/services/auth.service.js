import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError } from '../middleware/error.middleware.js';

export function generateToken(user) {
  const payload = {
    sub: user._id.toString(),
    userId: user._id.toString(),
    role: user.role,
    municipalityId: user.municipalityId ? user.municipalityId.toString() : null,
    wardId: user.wardId ? user.wardId.toString() : null,
    departmentId: user.departmentId ? user.departmentId.toString() : null,
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export async function login(email, password) {
  const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+passwordHash');
  
  if (!user) {
    throw new ApiError(401, 'Invalid email credentials or password.', 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'User account is deactivated. Contact city administrator.', 'ACCOUNT_DISABLED');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email credentials or password.', 'INVALID_CREDENTIALS');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = generateToken(user);
  
  // Omit passwordHash from returned user object
  const userObj = user.toObject();
  delete userObj.passwordHash;

  return { user: userObj, token };
}

export async function register(userData) {
  const existing = await User.findOne({ email: (userData.email || '').toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'An account with this email address already exists.', 'EMAIL_EXISTS');
  }

  const passwordHash = await User.hashPassword(userData.password);
  
  const newUser = await User.create({
    name: userData.name,
    email: userData.email.toLowerCase(),
    phone: userData.phone,
    passwordHash,
    role: userData.role || 'CITIZEN',
    municipalityId: userData.municipalityId || null,
    wardId: userData.wardId || null,
    departmentId: userData.departmentId || null,
  });

  const token = generateToken(newUser);
  const userObj = newUser.toObject();
  delete userObj.passwordHash;

  return { user: userObj, token };
}

export async function getMe(userId) {
  const user = await User.findById(userId)
    .populate('municipalityId', 'name code state tagline')
    .populate('wardId', 'name number code')
    .populate('departmentId', 'name code');

  if (!user) {
    throw new ApiError(404, 'Authenticated user profile not found.', 'USER_NOT_FOUND');
  }

  return user;
}
