import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Public dashboard route does not require authentication
router.get('/public', analyticsController.handleGetPublicTransparency);

router.use(authenticate);

router.get('/overview', analyticsController.handleGetOverview);
router.get('/complaints', analyticsController.handleGetComplaintsAnalytics);
router.get('/departments', analyticsController.handleGetDepartmentsAnalytics);
router.get('/wards', analyticsController.handleGetWardsAnalytics);

export default router;
