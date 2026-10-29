import { Router } from 'express';
import * as escalationController from '../controllers/escalation.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { applyDataScope } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', applyDataScope, escalationController.handleListEscalations);
router.post('/', applyDataScope, escalationController.handleCreateEscalation);
router.post('/:id/reassign', applyDataScope, escalationController.handleReassignEscalation);

export default router;
