import * as userService from '../services/user.service.js';
import { sendSuccess } from '../utils/response.js';

export async function handleGetMe(req, res, next) {
  try {
    return sendSuccess(res, { user: req.user }, 'User identity retrieved.');
  } catch (error) {
    next(error);
  }
}

export async function handleListUsers(req, res, next) {
  try {
    const result = await userService.listUsers(req.dataScopeFilter, req.query);
    return sendSuccess(res, result, 'Users list retrieved.');
  } catch (error) {
    next(error);
  }
}
