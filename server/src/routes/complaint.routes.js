import { Router } from 'express';
import * as complaintController from '../controllers/complaint.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission, applyDataScope } from '../middleware/role.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import {
  createComplaintSchema,
  updateComplaintSchema,
  listComplaintsQuerySchema,
} from '../validators/complaint.validator.js';

const router = Router();

// Protect all complaint routes
router.use(authenticate);

router.post(
  '/',
  requirePermission('complaint:create'),
  validateRequest(createComplaintSchema),
  complaintController.handleCreateComplaint
);

router.get(
  '/',
  requirePermission('complaint:read'),
  validateRequest(listComplaintsQuerySchema, 'query'),
  applyDataScope,
  complaintController.handleListComplaints
);

router.get(
  '/my',
  requirePermission('complaint:read'),
  applyDataScope,
  complaintController.handleListComplaints
);

router.get(
  '/:id',
  requirePermission('complaint:read'),
  applyDataScope,
  complaintController.handleGetComplaintById
);

router.patch(
  '/:id',
  requirePermission('complaint:update'),
  validateRequest(updateComplaintSchema),
  complaintController.handleUpdateComplaint
);

router.post(
  '/:id/status',
  requirePermission('complaint:update'),
  validateRequest(updateComplaintSchema),
  complaintController.handleUpdateComplaint
);

router.get(
  '/:id/timeline',
  requirePermission('complaint:read'),
  applyDataScope,
  complaintController.handleGetComplaintTimeline
);

router.get(
  '/:id/ai-routing',
  requirePermission('complaint:read'),
  applyDataScope,
  complaintController.handleGetAiRouting
);

router.post(
  '/:id/route',
  requirePermission('complaint:assign'),
  complaintController.handleRouteComplaint
);

router.post(
  '/:id/citizen-verify',
  requirePermission('complaint:verify'),
  complaintController.handleCitizenVerifyComplaint
);

router.post(
  '/:id/reopen',
  requirePermission('complaint:verify'),
  complaintController.handleReopenComplaint
);

export default router;
