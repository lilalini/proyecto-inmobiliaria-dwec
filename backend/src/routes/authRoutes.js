import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Autenticar usuario
 * @access  Público
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/verify
 * @desc    Verificar token actual
 * @access  Privado (requiere token)
 */
router.get('/verify', authController.verifyToken);

export default router;