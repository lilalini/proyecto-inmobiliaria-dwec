import { validatePropertyCreate } from '../utils/validators.js';
import { Property } from '../models/Property.js';

export const propertyController = {
  async getAllProperties(req, res) {
    try {
      const properties = await Property.getAll();
      res.json(properties);
    } catch (error) {
      console.error('Error getting properties:', error);
      res.status(500).json({ error: 'Error fetching properties' });
    }
  },

  async getPropertyById(req, res) {
    try {
      const { id } = req.params;
      const property = await Property.getById(id);
      
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      res.json(property);
    } catch (error) {
      console.error('Error getting property:', error);
      res.status(500).json({ error: 'Error fetching property' });
    }
  },

  async createProperty(req, res) {
    try {
      const propertyData = req.body;
      
       const validation = validatePropertyCreate(propertyData);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        error: validation.errors.join('. ') 
      });
    }

      const newProperty = await Property.create(propertyData);
      
      // Si hay imágenes en la solicitud
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          // Aquí procesarías la imagen y guardarías la URL
          // Por ahora simulamos una URL
          const imageUrl = `/uploads/${file.filename}`;
          await Property.addImage(newProperty.serial, imageUrl, i);
        }
      }

      res.status(201).json(newProperty);
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({ error: 'Error creating property' });
    }
  },
    /**
   * ACTUALIZAR PROPIEDAD
   * PUT /api/properties/:id
   */
   async updateProperty(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Validar que hay datos
      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No se proporcionaron datos para actualizar'
        });
      }

      // ACTUALIZAR EN BD (LLAMADA REAL AL MODELO)
      const updatedProperty = await Property.update(id, updateData);

      res.json({
        success: true,
        data: updatedProperty,
        message: 'Propiedad actualizada correctamente'
      });

    } catch (error) {
      console.error('Error actualizando propiedad:', error);
      
      if (error.message === 'Propiedad no encontrada') {
        return res.status(404).json({
          success: false,
          error: 'Propiedad no encontrada'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno al actualizar propiedad'
      });
    }
  },

  async deleteProperty(req, res) {
    try {
      const { id } = req.params;
      
      // ELIMINAR DE BD (LLAMADA REAL AL MODELO)
      const deleted = await Property.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Propiedad no encontrada'
        });
      }

      res.json({
        success: true,
        message: `Propiedad ${id} eliminada correctamente`
      });

    } catch (error) {
      console.error('Error eliminando propiedad:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno al eliminar propiedad'
      });
    }
  }
};