import pool from '../config/database.js';
import Visit from '../models/Visit.js';

const visitController = {
  createVisit: async (req, res) => {
    try {
      const { 
        property_serial, 
        name, 
        email, 
        phone, 
        visit_date, 
        message 
      } = req.body;

      // 1. Buscar si el cliente ya existe por email
      let clientResult = await pool.query(
        'SELECT id FROM clients WHERE email = $1',
        [email]
      );

      let clientId = null;

      // 2. Si no existe, crear nuevo cliente
      if (clientResult.rows.length === 0) {
        const newClient = await pool.query(
          `INSERT INTO clients (name, email, phone, type, created_at)
           VALUES ($1, $2, $3, $4, NOW())
           RETURNING id`,
          [name, email, phone, 'buyer'] // buyer por defecto
        );
        clientId = newClient.rows[0].id;
        console.log('Cliente creado:', clientId);
      } else {
        clientId = clientResult.rows[0].id;
        console.log('Cliente existente:', clientId);
        
        // Opcional: actualizar datos del cliente si cambiaron
        await pool.query(
          'UPDATE clients SET name = $1, phone = $2 WHERE id = $3',
          [name, phone, clientId]
        );
      }

      // 3. Crear la visita con el client_id
      const visitData = {
        property_serial,
        client_id: clientId,
        visit_date,
        notes: message || '',
        status: 'scheduled'
      };

      const newVisit = await Visit.create(visitData);
      
      res.status(201).json({
        success: true,
        message: 'Visita solicitada correctamente',
        data: newVisit
      });
      
    } catch (error) {
      console.error('Error creando visita:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear la visita'
      });
    }
  },

  getVisitsByProperty: async (req, res) => {
    try {
      const { propertySerial } = req.params;
      const visits = await Visit.findByProperty(propertySerial);
      
      res.json({
        success: true,
        data: visits
      });
    } catch (error) {
      console.error('Error obteniendo visitas:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener las visitas'
      });
    }
  },

  getAllVisits: async (req, res) => {
    try {
      const visits = await Visit.findAll();
      
      res.json({
        success: true,
        data: visits
      });
    } catch (error) {
      console.error('Error obteniendo todas las visitas:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener las visitas'
      });
    }
  },

  updateVisitStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const updatedVisit = await Visit.updateStatus(id, status, req.user?.userId);
      
      res.json({
        success: true,
        message: 'Estado de visita actualizado',
        data: updatedVisit
      });
    } catch (error) {
      console.error('Error actualizando visita:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar la visita'
      });
    }
  },

  deleteVisit: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedVisit = await Visit.delete(id);
      
      res.json({
        success: true,
        message: 'Visita eliminada',
        data: deletedVisit
      });
    } catch (error) {
      console.error('Error eliminando visita:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar la visita'
      });
    }
  },

    // Obtener visitas por rango de fechas (para calendario)
    getVisitsByDateRange: async (req, res) => {
      try {
        const { startDate, endDate } = req.query;
        
        console.log('Consultando calendario...');
        
        // CONSULTA SIMPLE Y SEGURA - sin JOIN problemático
        let query = `
          SELECT 
            v.id,
            v.visit_date,
            v.status,
            v.property_serial,
            v.notes,
            c.name as client_name,
            c.email as client_email,
            c.phone as client_phone
          FROM visits v
          LEFT JOIN clients c ON v.client_id = c.id
          WHERE v.status != 'deleted'
        `;
        
        const params = [];
        
        if (startDate && endDate) {
          query += ` AND v.visit_date >= $1 AND v.visit_date <= $2`;
          params.push(new Date(startDate), new Date(endDate));
        }
        
        query += ` ORDER BY v.visit_date ASC`;
        
        console.log('Query ejecutada');
        const result = await pool.query(query, params);
        
        // Formatear para el calendario
        const formattedVisits = result.rows.map(visit => ({
          id: visit.id,
          title: visit.client_name ? `Visita con ${visit.client_name}` : `Visita ${visit.id}`,
          start: visit.visit_date,
          end: new Date(new Date(visit.visit_date).getTime() + 60 * 60 * 1000),
          client_name: visit.client_name,
          client_email: visit.client_email,
          client_phone: visit.client_phone,
          status: visit.status,
          property_title: `Propiedad ${visit.property_serial || ''}`,
          property_serial: visit.property_serial,
          allDay: false
        }));
        
        console.log(`Retornando ${formattedVisits.length} visitas`);
        res.json(formattedVisits);
        
      } catch (error) {
        console.error('Error en getVisitsByDateRange:', error);
        res.status(500).json({ 
          success: false,
          message: 'Error al obtener calendario',
          error: error.message 
        });
      }
    }
};

export default visitController;