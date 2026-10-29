import { Router } from 'express';
import * as muniController from '../controllers/municipality.controller.js';

const router = Router();

router.get('/', muniController.handleGetMunicipalities);
router.get('/:id', muniController.handleGetMunicipalityById);
router.get('/:id/categories', muniController.handleGetCategories);

export default router;
