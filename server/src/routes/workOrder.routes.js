import { Router } from 'express';
import * as workOrderController from '../controllers/workOrder.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { applyDataScope } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', applyDataScope, workOrderController.handleCreateWorkOrder);
router.get('/', applyDataScope, workOrderController.handleListWorkOrders);
router.get('/:id', applyDataScope, workOrderController.handleGetWorkOrderById);

router.post('/:id/accept', workOrderController.handleAcceptWorkOrder);
router.post('/:id/start', workOrderController.handleStartWorkOrder);
router.post('/:id/complete', workOrderController.handleCompleteWorkOrder);
router.post('/:id/verify', workOrderController.handleVerifyWorkOrder);

export default router;
