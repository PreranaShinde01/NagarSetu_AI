import User from '../models/User.js';

export async function listUsers(filter = {}, queryParams = {}) {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    User.find(filter)
      .populate('municipalityId', 'name code')
      .populate('wardId', 'name number')
      .populate('departmentId', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
