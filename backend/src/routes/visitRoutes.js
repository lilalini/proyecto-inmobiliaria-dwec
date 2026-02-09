import express from 'express';
import visitController from '../controllers/visitController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta pública: Crear visita (no requiere autenticación)
router.post('/', visitController.createVisit);

// Ruta pública: Obtener visitas por propiedad
router.get('/property/:propertySerial', visitController.getVisitsByProperty);

// Rutas protegidas (solo admin/agentes)
router.get('/', verifyToken, requireAdmin, visitController.getAllVisits);
router.put('/:id/status', verifyToken, requireAdmin, visitController.updateVisitStatus);
router.delete('/:id', verifyToken, requireAdmin, visitController.deleteVisit);
router.get('/calendar', visitController.getVisitsByDateRange);

export default router;