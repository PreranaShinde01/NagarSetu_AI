import { Router } from 'express';
import * as auditController from '../controllers/audit.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { applyDataScope } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', auditController.handleGetAuditLogs);

export default router;
