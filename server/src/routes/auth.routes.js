import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authRateLimiter } from '../middleware/rateLimit.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', authRateLimiter, validateRequest(loginSchema), authController.handleLogin);
router.post('/register', validateRequest(registerSchema), authController.handleRegister);
router.get('/me', authenticate, authController.handleGetMe);

export default router;
