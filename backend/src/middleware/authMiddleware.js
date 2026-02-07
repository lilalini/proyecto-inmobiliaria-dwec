import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'inmobiliaria_secreto_2024_seguro';

/**
 * Middleware para verificar JWT
 * Agrega req.user si el token es válido
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Acceso no autorizado. Token requerido.'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verificar y decodificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Agregar usuario al request
    req.user = decoded;
    
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado.'
      });
    }

    console.error('Error en verifyToken middleware:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno de autenticación.'
    });
  }
};

/**
 * Middleware para verificar rol de ADMINISTRADOR
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Usuario no autenticado.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado. Se requiere rol de administrador.'
    });
  }

  next();
};

/**
 * Middleware para verificar rol de AGENTE o ADMIN
 */
export const requireAgentOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Usuario no autenticado.'
    });
  }

  const allowedRoles = ['admin', 'agent', 'manager'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado. Se requiere rol de administrador, agente o manager.'
    });
  }

  next();
};

/**
 * Middleware para verificar rol específico
 * @param {string[]} roles - Roles permitidos
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Acceso denegado. Se requiere uno de estos roles: ${roles.join(', ')}.`
      });
    }

    next();
  };
};