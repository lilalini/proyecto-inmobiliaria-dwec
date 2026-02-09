import pool from '../config/database.js';

const clientController = {
  // 1. OBTENER TODOS LOS CLIENTES
  getAllClients: async (req, res) => {
    try {
      console.log('Solicitando lista de clientes...');
      const query = `
        SELECT 
          id, 
          name, 
          email, 
          phone, 
          type, 
          TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') as created_at_formatted,
          created_at,
          (SELECT COUNT(*) FROM visits WHERE client_id = clients.id) as total_visits
        FROM clients 
        ORDER BY created_at DESC
      `;
      
      const result = await pool.query(query);
      console.log(`Encontrados ${result.rows.length} clientes`);
      
      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error en getAllClients:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno al obtener clientes'
      });
    }
  },

  // 2. CREAR UN CLIENTE NUEVO (DESDE OFICINA)
  createClient: async (req, res) => {
    try {
      const { name, email, phone, type = 'buyer' } = req.body;
      console.log('Intentando crear cliente:', { name, email, type });

      // Validación básica
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          error: 'Nombre y email son campos obligatorios'
        });
      }

      const query = `
        INSERT INTO clients (name, email, phone, type, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id, name, email, phone, type, created_at
      `;
      
      const result = await pool.query(query, [name, email, phone, type]);
      console.log('Cliente creado con ID:', result.rows[0].id);
      
      res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error en createClient:', error);
      
      // Manejo específico para email duplicado (código de error de PostgreSQL)
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          error: 'Ya existe un cliente registrado con este email'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno al crear cliente'
      });
    }
  },

  // 3. ACTUALIZAR CLIENTE
  updateClient: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, type } = req.body;
      
      const query = `
        UPDATE clients 
        SET name = $1, email = $2, phone = $3, type = $4 
        WHERE id = $5
        RETURNING id, name, email, phone, type, created_at
      `;
      
      const result = await pool.query(query, [name, email, phone, type, id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado'
        });
      }
      
      res.json({
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error en updateClient:', error);
      
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          error: 'Ya existe otro cliente con este email'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno al actualizar cliente'
      });
    }
  },

  // 4. ELIMINAR CLIENTE
  deleteClient: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar si tiene visitas asociadas
      const checkVisits = await pool.query(
        'SELECT COUNT(*) FROM visits WHERE client_id = $1',
        [id]
      );
      
      const visitCount = parseInt(checkVisits.rows[0].count);
      
      if (visitCount > 0) {
        return res.status(400).json({
          success: false,
          error: `No se puede eliminar. El cliente tiene ${visitCount} visita(s) asociada(s)`
        });
      }
      
      const query = 'DELETE FROM clients WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado'
        });
      }
      
      res.json({
        success: true,
        message: 'Cliente eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error en deleteClient:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno al eliminar cliente'
      });
    }
  }
};

export default clientController;