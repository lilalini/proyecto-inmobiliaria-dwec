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
      
      // Validación básica
      if (!propertyData.title || !propertyData.price) {
        return res.status(400).json({ error: 'Title and price are required' });
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
  }
};