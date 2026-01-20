import express from 'express';
import { propertyController } from '../controllers/propertyController.js';
import { uploadPropertyImages } from '../middleware/upload.js';

const router = express.Router();

// GET todas las propiedades
router.get('/', propertyController.getAllProperties);

// GET propiedad por ID
router.get('/:id', propertyController.getPropertyById);

// POST crear nueva propiedad (con imágenes)
router.post('/', uploadPropertyImages, propertyController.createProperty);

export default router;