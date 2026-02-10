import pool from '../config/database.js';

const reportController = {
  // 1. REPORTE DE VISITAS
  getVisitStats: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      let dateFilter = '';
      const params = [];
      
      if (startDate && endDate) {
        dateFilter = 'WHERE visit_date BETWEEN $1 AND $2';
        params.push(startDate, endDate);
      }
      
      // Consulta principal
      const query = `
        SELECT 
          -- Total visitas
          COUNT(*) as total_visitas,
          
          -- Visitas por estado
          SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as programadas,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completadas,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as canceladas,
          SUM(CASE WHEN status = 'no_show' THEN 1 ELSE 0 END) as no_show,
          
          -- Visitas por mes (últimos 6 meses)
          TO_CHAR(visit_date, 'YYYY-MM') as mes,
          COUNT(*) as visitas_mes
        FROM visits
        ${dateFilter}
        GROUP BY TO_CHAR(visit_date, 'YYYY-MM')
        ORDER BY mes DESC
        LIMIT 6
      `;
      
      const result = await pool.query(query, params);
      
      // Estadísticas adicionales
      const statsQuery = `
        SELECT 
          -- Visitas por día de la semana
          EXTRACT(DOW FROM visit_date) as dia_semana,
          COUNT(*) as cantidad,
          
          -- Promedio de visitas por día
          ROUND(COUNT(*) * 1.0 / NULLIF(COUNT(DISTINCT DATE(visit_date)), 0), 1) as promedio_diario
        FROM visits
        ${dateFilter}
        GROUP BY EXTRACT(DOW FROM visit_date)
        ORDER BY dia_semana
      `;
      
      const statsResult = await pool.query(statsQuery, params);
      
      res.json({
        success: true,
        data: {
          resumen: result.rows.length > 0 ? result.rows[0] : null,
          por_mes: result.rows,
          por_dia_semana: statsResult.rows,
          total_registros: result.rows.reduce((sum, row) => sum + parseInt(row.visitas_mes), 0)
        }
      });
      
    } catch (error) {
      console.error('Error en getVisitStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno al obtener estadísticas de visitas'
      });
    }
  },

  // 2. REPORTE DE CLIENTES
  getClientStats: async (req, res) => {
    try {
      const query = `
        SELECT 
          -- Totales
          COUNT(*) as total_clientes,
          COUNT(DISTINCT type) as tipos_diferentes,
          
          -- Por tipo
          type,
          COUNT(*) as cantidad,
          ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM clients), 0), 1) as porcentaje
        FROM clients
        GROUP BY type
        ORDER BY cantidad DESC
      `;
      
      const result = await pool.query(query);
      
      // Clientes nuevos por mes
      const nuevosQuery = `
        SELECT 
          TO_CHAR(created_at, 'YYYY-MM') as mes,
          COUNT(*) as nuevos_clientes
        FROM clients
        GROUP BY TO_CHAR(created_at, 'YYYY-MM')
        ORDER BY mes DESC
        LIMIT 6
      `;
      
      const nuevosResult = await pool.query(nuevosQuery);
      
      res.json({
        success: true,
        data: {
          por_tipo: result.rows,
          nuevos_por_mes: nuevosResult.rows,
          total: result.rows.reduce((sum, row) => sum + parseInt(row.cantidad), 0)
        }
      });
      
    } catch (error) {
      console.error('Error en getClientStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno al obtener estadísticas de clientes'
      });
    }
  },

  // 3. REPORTE DE PROPIEDADES
  getPropertyStats: async (req, res) => {
    try {
      const query = `
        SELECT 
          -- Totales
          COUNT(*) as total_propiedades,
          COUNT(DISTINCT type) as tipos_diferentes,
          COUNT(DISTINCT city) as ciudades_diferentes,
          
          -- Por tipo
          type,
          COUNT(*) as cantidad,
          ROUND(AVG(price), 2) as precio_promedio,
          MIN(price) as precio_minimo,
          MAX(price) as precio_maximo
        FROM properties
        WHERE status != 'deleted'
        GROUP BY type
        ORDER BY cantidad DESC
      `;
      
      const result = await pool.query(query);
      
      // Propiedades por ciudad
      const ciudadesQuery = `
        SELECT 
          city,
          COUNT(*) as cantidad,
          ROUND(AVG(price), 2) as precio_promedio
        FROM properties
        WHERE status != 'deleted'
        GROUP BY city
        ORDER BY cantidad DESC
        LIMIT 10
      `;
      
      const ciudadesResult = await pool.query(ciudadesQuery);
      
      // Propiedades por operación (venta/alquiler)
      const operacionQuery = `
        SELECT 
          operation,
          COUNT(*) as cantidad,
          ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM properties WHERE status != 'deleted'), 0), 1) as porcentaje
        FROM properties
        WHERE status != 'deleted'
        GROUP BY operation
      `;
      
      const operacionResult = await pool.query(operacionQuery);
      
      res.json({
        success: true,
        data: {
          por_tipo: result.rows,
          por_ciudad: ciudadesResult.rows,
          por_operacion: operacionResult.rows,
          resumen: result.rows.length > 0 ? result.rows[0] : null
        }
      });
      
    } catch (error) {
      console.error('Error en getPropertyStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno al obtener estadísticas de propiedades'
      });
    }
  },

  // 4. REPORTE GENERAL (DASHBOARD)
  getDashboardStats: async (req, res) => {
    try {
      // Ejecutar todas las consultas en paralelo
      const [
        clientesResult,
        propiedadesResult,
        visitasResult,
        visitasRecientesResult
      ] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM clients'),
        pool.query('SELECT COUNT(*) FROM properties WHERE status != \'deleted\''),
        pool.query('SELECT COUNT(*) FROM visits WHERE visit_date >= CURRENT_DATE'),
        pool.query(`
          SELECT v.*, p.title as property_title, c.name as client_name
          FROM visits v
          LEFT JOIN properties p ON v.property_serial = p.serial
          LEFT JOIN clients c ON v.client_id = c.id
          ORDER BY v.visit_date DESC
          LIMIT 5
        `)
      ]);
      
      const totalClientes = parseInt(clientesResult.rows[0].count);
      const totalPropiedades = parseInt(propiedadesResult.rows[0].count);
      const visitasHoy = parseInt(visitasResult.rows[0].count);
      const visitasRecientes = visitasRecientesResult.rows;
      
      res.json({
        success: true,
        data: {
          total_clientes: totalClientes,
          total_propiedades: totalPropiedades,
          visitas_hoy: visitasHoy,
          visitas_recientes: visitasRecientes,
          metricas: [
            { label: 'Clientes', value: totalClientes, icon: '👥', color: 'blue' },
            { label: 'Propiedades', value: totalPropiedades, icon: '🏠', color: 'green' },
            { label: 'Visitas hoy', value: visitasHoy, icon: '📅', color: 'purple' },
            { label: 'Tasa conversión', value: '15%', icon: '📊', color: 'yellow' }
          ]
        }
      });
      
    } catch (error) {
      console.error('Error en getDashboardStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno al obtener estadísticas del dashboard'
      });
    }
  }
};

export default reportController;