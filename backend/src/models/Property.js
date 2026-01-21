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
  }
};