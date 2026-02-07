import pool from '../config/database.js';

export const Property = {
  async getAll() {
    try {
      const result = await pool.query(`
        SELECT p.*, 
               COALESCE(
                 json_agg(
                   json_build_object('id', pi.id, 'image_url', pi.image_url, 'order', pi.image_order)
                   ORDER BY pi.image_order
                 ) FILTER (WHERE pi.id IS NOT NULL),
                 '[]'
               ) as images
        FROM properties p
        LEFT JOIN property_images pi ON p.serial = pi.property_serial
        GROUP BY p.serial
        ORDER BY p.created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('ERROR DB getAll:', error.message);
      throw error;
    }
  },

  async getById(serial) {
    try {
      const result = await pool.query(`
        SELECT p.*, 
               COALESCE(
                 json_agg(
                   json_build_object('id', pi.id, 'image_url', pi.image_url, 'order', pi.image_order)
                   ORDER BY pi.image_order
                 ) FILTER (WHERE pi.id IS NOT NULL),
                 '[]'
               ) as images
        FROM properties p
        LEFT JOIN property_images pi ON p.serial = pi.property_serial
        WHERE p.serial = $1
        GROUP BY p.serial
      `, [serial]);
      return result.rows[0];
    } catch (error) {
      console.error('ERROR DB getById:', error.message);
      throw error;
    }
  },

  async create(propertyData) {
    try {
      const {
        title, description, type, operation, address, city, 
        price, bedrooms, bathrooms, area, status, featured, agent_id
      } = propertyData;

      const result = await pool.query(
        `INSERT INTO properties 
         (title, description, type, operation, address, city, price, 
          bedrooms, bathrooms, area, status, featured, agent_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING *`,
        [title, description, type, operation, address, city, price,
         bedrooms, bathrooms, area, status, featured, agent_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('ERROR DB create:', error.message);
      throw error;
    }
  },

  async addImage(propertySerial, imageUrl, imageOrder, isMain = false) {
    try {
      const result = await pool.query(
        `INSERT INTO property_images (property_serial, image_url, image_order, is_main)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [propertySerial, imageUrl, imageOrder || 0, isMain]
      );
      return result.rows[0];
    } catch (error) {
      console.error('ERROR DB addImage:', error.message);
      throw error;
    }
  },

    /**
   * ACTUALIZAR PROPIEDAD EN BD
   */
  async update(serial, updateData) {
    try {
      // Campos permitidos para actualizar
      const allowedFields = [
        'title', 'description', 'type', 'operation', 'address', 'city',
        'price', 'bedrooms', 'bathrooms', 'area', 'status', 'featured', 'agent_id'
      ];
      
      // Construir SET dinámico
      const setClauses = [];
      const values = [];
      let paramIndex = 1;
      
      Object.keys(updateData).forEach(field => {
        if (allowedFields.includes(field)) {
          setClauses.push(`${field} = $${paramIndex}`);
          values.push(updateData[field]);
          paramIndex++;
        }
      });
      
      if (setClauses.length === 0) {
        throw new Error('No hay campos válidos para actualizar');
      }
      
      // Añadir updated_at
      setClauses.push('updated_at = CURRENT_TIMESTAMP');
      
      // Añadir serial al final
      values.push(serial);
      
      const query = `
        UPDATE properties 
        SET ${setClauses.join(', ')}
        WHERE serial = $${paramIndex}
        RETURNING *
      `;
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Propiedad no encontrada');
      }
      
      // Obtener propiedad actualizada con imágenes
      return await this.getById(serial);
      
    } catch (error) {
      console.error('ERROR DB update:', error.message);
      throw error;
    }
  },

  /**
   * ELIMINAR PROPIEDAD DE BD
   */
  async delete(serial) {
    try {
      // Primero eliminar imágenes asociadas
      await pool.query(
        'DELETE FROM property_images WHERE property_serial = $1',
        [serial]
      );
      
      // Luego eliminar propiedad
      const result = await pool.query(
        'DELETE FROM properties WHERE serial = $1 RETURNING *',
        [serial]
      );
      
      return result.rows.length > 0;
      
    } catch (error) {
      console.error('ERROR DB delete:', error.message);
      throw error;
    }
  }
};