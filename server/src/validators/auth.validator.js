import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Valid municipal or citizen email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().allow('', null),
  role: Joi.string().valid(
    'CITIZEN',
    'NAGARSETU_CONTROLLER',
    'WARD_MEMBER',
    'WARD_OFFICER',
    'DEPARTMENT_OFFICER',
    'DEPARTMENT_SUPERVISOR',
    'MUNICIPAL_WORKER',
    'SENIOR_AUTHORITY',
    'CITY_ADMIN',
    'SUPER_ADMIN',
    'POLICE_EMERGENCY_USER'
  ).default('CITIZEN'),
  municipalityId: Joi.string().allow('', null),
  wardId: Joi.string().allow('', null),
  departmentId: Joi.string().allow('', null),
});
