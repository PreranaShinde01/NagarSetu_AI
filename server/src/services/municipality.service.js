import mongoose from 'mongoose';
import Municipality from '../models/Municipality.js';
import Ward from '../models/Ward.js';
import Department from '../models/Department.js';
import AdministrativeUnit from '../models/AdministrativeUnit.js';
import { ApiError } from '../middleware/error.middleware.js';

export async function resolveMunicipalityId(input) {
  if (!input) return null;
  if (typeof input === 'object' && input._id) return input._id;
  if (mongoose.Types.ObjectId.isValid(input)) return input;

  const str = String(input).trim();
  let code = str.toUpperCase();
  if (str.toLowerCase().includes('ichalkaranji')) code = 'IMC';
  else if (str.toLowerCase().includes('pune')) code = 'PMC-DEMO';
  else if (str.toLowerCase().includes('kolhapur')) code = 'KMC-DEMO';
  else if (str.toLowerCase().includes('nashik')) code = 'NMC-DEMO';
  else if (str.toLowerCase().includes('nagpur')) code = 'NMC-NGP-DEMO';

  const muni = await Municipality.findOne({
    $or: [{ code }, { code: str }, { code: `${code}-DEMO` }, { code: code.replace('-DEMO', '') }],
  });
  return muni ? muni._id : null;
}

export async function getAllMunicipalities() {
  return await Municipality.find({ isActive: true }).sort({ name: 1 });
}

export async function getMunicipalityById(id) {
  const resolvedId = await resolveMunicipalityId(id);
  const targetId = resolvedId || id;
  const municipality = await Municipality.findById(targetId);
  if (!municipality) {
    throw new ApiError(404, 'Municipality not found.', 'MUNICIPALITY_NOT_FOUND');
  }

  const [adminUnits, wards, departments] = await Promise.all([
    AdministrativeUnit.find({ municipalityId: targetId }),
    Ward.find({ municipalityId: targetId, isActive: true }).sort({ number: 1 }),
    Department.find({ municipalityId: targetId, isActive: true }).sort({ name: 1 }),
  ]);

  return {
    municipality,
    adminUnits,
    wards,
    departments,
  };
}

export async function getCategoriesByMunicipalityId(municipalityId) {
  const resolvedId = await resolveMunicipalityId(municipalityId);
  const targetId = resolvedId || municipalityId;
  const ComplaintCategory = (await import('../models/ComplaintCategory.js')).default;
  return await ComplaintCategory.find({ municipalityId: targetId, isActive: true }).sort({ name: 1 });
}
