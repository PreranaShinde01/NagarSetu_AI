import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission, applyDataScope } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/me', userController.handleGetMe);
router.get('/', requirePermission('user:manage'), applyDataScope, userController.handleListUsers);

export default router;
