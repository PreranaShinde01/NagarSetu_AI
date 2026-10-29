import Joi from 'joi';

export const createComplaintSchema = Joi.object({
  municipalityId: Joi.string().required(),
  wardId: Joi.string().required(),
  departmentId: Joi.string().required(),
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
  category: Joi.string().required(),
  subcategory: Joi.string().allow('', null),
  location: Joi.object({
    coordinates: Joi.array().items(Joi.number()).length(2).required(), // [longitude, latitude]
    address: Joi.string().required(),
    area: Joi.string().allow('', null),
  }).required(),
  priority: Joi.string().valid('P1', 'P2', 'P3', 'P4').default('P2'),
  severity: Joi.string().valid('CRITICAL', 'HIGH', 'MEDIUM', 'LOW').default('HIGH'),
  media: Joi.object({
    images: Joi.array().items(Joi.string()).default([]),
    videos: Joi.array().items(Joi.string()).default([]),
  }).default({ images: [], videos: [] }),
});

export const updateComplaintSchema = Joi.object({
  status: Joi.string().valid(
    'SUBMITTED',
    'AI_ANALYSIS',
    'ASSIGNED',
    'IN_PROGRESS',
    'AWAITING_VERIFICATION',
    'RESOLVED',
    'REOPENED',
    'ESCALATED',
    'CLOSED',
    'REJECTED'
  ),
  priority: Joi.string().valid('P1', 'P2', 'P3', 'P4'),
  severity: Joi.string().valid('CRITICAL', 'HIGH', 'MEDIUM', 'LOW'),
  assignedToUserId: Joi.string().allow('', null),
  note: Joi.string().allow('', null),
});

export const listComplaintsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow('', null),
  status: Joi.string().allow('', null),
  priority: Joi.string().allow('', null),
  severity: Joi.string().allow('', null),
  category: Joi.string().allow('', null),
  wardId: Joi.string().allow('', null),
  departmentId: Joi.string().allow('', null),
  municipalityId: Joi.string().allow('', null),
  sortBy: Joi.string().default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});
