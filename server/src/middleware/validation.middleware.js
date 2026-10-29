import { ApiError } from './error.middleware.js';

export function validateRequest(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      return next(new ApiError(422, 'Request validation failed.', 'VALIDATION_ERROR', details));
    }

    req[property] = value;
    next();
  };
}
