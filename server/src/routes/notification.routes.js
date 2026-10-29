import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.handleGetNotifications);
router.patch('/:id/read', notificationController.handleMarkRead);
router.patch('/read-all', notificationController.handleMarkAllRead);

export default router;
