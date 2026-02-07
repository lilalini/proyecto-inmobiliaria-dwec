import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const User = {
  /**
   * Buscar usuario por email
   */
  async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error('ERROR DB findByEmail:', error.message);
      throw error;
    }
  },

  /**
   * Buscar usuario por ID
   */
  async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('ERROR DB findById:', error.message);
      throw error;
    }
  },

  /**
   * Crear nuevo usuario
   */
  async create(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const result = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role, created_at`,
        [userData.name, userData.email, hashedPassword, userData.role || 'agent']
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('ERROR DB create user:', error.message);
      throw error;
    }
  },

  /**
   * Verificar contraseña
   */
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('ERROR verifying password:', error.message);
      throw error;
    }
  },

  /**
   * Actualizar último login
   */
  async updateLastLogin(userId) {
    try {
      //await pool.query(
       // 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
       // [userId]
     // );
    } catch (error) {
      console.error('ERROR DB updateLastLogin:', error.message);
      // No lanzamos error porque no es crítico
    }
  }
};