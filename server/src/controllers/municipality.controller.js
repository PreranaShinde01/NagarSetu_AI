import * as muniService from '../services/municipality.service.js';
import { sendSuccess } from '../utils/response.js';

export async function handleGetMunicipalities(req, res, next) {
  try {
    const list = await muniService.getAllMunicipalities();
    return sendSuccess(res, { municipalities: list }, 'Municipalities retrieved.');
  } catch (error) {
    next(error);
  }
}

export async function handleGetMunicipalityById(req, res, next) {
  try {
    const data = await muniService.getMunicipalityById(req.params.id);
    return sendSuccess(res, data, 'Municipality details retrieved.');
  } catch (error) {
    next(error);
  }
}

export async function handleGetCategories(req, res, next) {
  try {
    const categories = await muniService.getCategoriesByMunicipalityId(req.params.id);
    return sendSuccess(res, { categories }, 'Complaint categories retrieved.');
  } catch (error) {
    next(error);
  }
}
