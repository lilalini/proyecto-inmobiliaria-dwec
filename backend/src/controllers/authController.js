import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET || 'inmobiliaria_secreto_2024_seguro';
const JWT_EXPIRES_IN = '24h';

export const authController = {
  /**
   * Login de usuario
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 1. Validar campos requeridos
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email y contraseña son requeridos'
        });
      }

      // 2. Buscar usuario por email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
      }

      // 3. Verificar contraseña
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
      }

      // 4. Generar token JWT (sin password en el payload)
      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });

      // 5. Actualizar último login (opcional)
      await User.updateLastLogin(user.id);

      // 6. Preparar respuesta (sin password)
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      res.json({
        success: true,
        token,
        user: userResponse,
        expiresIn: JWT_EXPIRES_IN
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  /**
   * Verificar token actual
   * GET /api/auth/verify
   */
  async verifyToken(req, res) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Token no proporcionado'
        });
      }

      const token = authHeader.replace('Bearer ', '');
      
      // Verificar token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Opcional: verificar que usuario aún existe en BD
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'Token inválido'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expirado'
        });
      }

      console.error('Error verificando token:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
};