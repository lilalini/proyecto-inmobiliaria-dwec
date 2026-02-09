import express from 'express';
import clientController from '../controllers/clientController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js'; 

const router = express.Router();
// GET todos los clientes
router.get('/', verifyToken, requireAdmin, clientController.getAllClients);

// POST crear cliente
router.post('/', verifyToken, requireAdmin, clientController.createClient);

// PUT actualizar cliente (NUEVO)
router.put('/:id', verifyToken, requireAdmin, clientController.updateClient);

// DELETE eliminar cliente (NUEVO)
router.delete('/:id', verifyToken, requireAdmin, clientController.deleteClient);

export default router;