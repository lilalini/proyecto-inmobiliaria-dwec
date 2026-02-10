import express from 'express';
import reportController from '../controllers/reportController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


// Todos los reportes requieren autenticación y ser admin
router.get('/visits', verifyToken, requireAdmin, reportController.getVisitStats);
router.get('/clients', verifyToken, requireAdmin, reportController.getClientStats);
router.get('/properties', verifyToken, requireAdmin, reportController.getPropertyStats);
router.get('/dashboard', verifyToken, requireAdmin, reportController.getDashboardStats);

export default router;