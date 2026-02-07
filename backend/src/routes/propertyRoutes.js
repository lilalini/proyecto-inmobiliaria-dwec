import express from 'express';
import { propertyController } from '../controllers/propertyController.js';
import { uploadPropertyImages } from '../middleware/upload.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET todas las propiedades - PÚBLICO
router.get('/', propertyController.getAllProperties);

// GET propiedad por ID - PÚBLICO
router.get('/:id', propertyController.getPropertyById);

// POST crear nueva propiedad - SOLO ADMIN (PROTEGIDO) ← SOLO UNA VEZ
router.post('/', verifyToken, requireAdmin, uploadPropertyImages, propertyController.createProperty);

// PUT actualizar propiedad - SOLO ADMIN (PROTEGIDO)
router.put('/:id', verifyToken, requireAdmin, propertyController.updateProperty);

// DELETE eliminar propiedad - SOLO ADMIN (PROTEGIDO)
router.delete('/:id', verifyToken, requireAdmin, propertyController.deleteProperty);

export default router;