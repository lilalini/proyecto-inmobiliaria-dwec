import pool from '../config/database.js';

const Visit = {
  create: async (visitData) => {
    const {
      property_serial,
      client_id,      
      visit_date,
      notes,
      status = 'scheduled'
    } = visitData;

    const query = `
      INSERT INTO visits 
      (property_serial, client_id, visit_date, notes, status, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;

    const values = [
      property_serial,
      client_id,
      visit_date,
      notes,
      status
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  findByProperty: async (propertySerial) => {
    const query = `
      SELECT v.*, p.title as property_title, p.city as property_city
      FROM visits v
      LEFT JOIN properties p ON v.property_serial = p.serial
      WHERE v.property_serial = $1
      ORDER BY v.visit_date DESC
    `;
    const result = await pool.query(query, [propertySerial]);
    return result.rows;
  },

  findAll: async () => {
    const query = `
      SELECT v.*, p.title as property_title, p.city as property_city
      FROM visits v
      LEFT JOIN properties p ON v.property_serial = p.serial
      ORDER BY v.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  updateStatus: async (visitId, status, agentId = null) => {
    const query = `
      UPDATE visits 
      SET status = $1, agent_id = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [status, agentId, visitId]);
    return result.rows[0];
  },

  delete: async (visitId) => {
    const query = 'DELETE FROM visits WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [visitId]);
    return result.rows[0];
  },

  // Método para obtener visitas por rango de fechas
  findByDateRange: async (startDate, endDate) => {
    let query = `
      SELECT 
        v.*,
        c.name as client_name,
        c.email as client_email,
        c.phone as client_phone,
        p.title as property_title,
        p.serial_number as property_serial,
        p.address as property_address
      FROM visits v
      LEFT JOIN clients c ON v.client_id = c.id
      LEFT JOIN properties p ON v.property_serial = p.serial_number
      WHERE v.status != 'deleted'
    `;
    
    const params = [];
    
    if (startDate && endDate) {
      query += ` AND v.visit_date >= $1 AND v.visit_date <= $2`;
      params.push(new Date(startDate), new Date(endDate));
    }
    
    query += ` ORDER BY v.visit_date ASC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  }
};

export default Visit;