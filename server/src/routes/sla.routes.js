import { Router } from 'express';
import * as slaController from '../controllers/sla.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/summary', slaController.handleGetSlaSummary);
router.get('/at-risk', slaController.handleGetAtRisk);
router.get('/breached', slaController.handleGetBreached);

export default router;
