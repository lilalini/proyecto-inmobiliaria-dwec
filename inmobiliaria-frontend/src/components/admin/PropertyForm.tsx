import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { propertyAPI } from '../../services/api';
import { validatePropertyForm, type PropertyFormData } from '../../utils/validators';
import { PROPERTY_TYPES, OPERATION_TYPES, STATUS_TYPES, CITIES, BEDROOM_OPTIONS, BATHROOM_OPTIONS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';


interface PropertyFormProps {
  propertyId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ propertyId, onSuccess, onCancel }) => {
  // Estado del formulario
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    type: 'apartment',
    operation: 'sale',
    address: '',
    city: '',
    price: 0,
    bedrooms: 3,
    bathrooms: 2,
    area: 0,
    status: 'available',
    featured: false,
    agent_id: 1
  });

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface PropertyImage {
  image_url: string;
}

  const loadPropertyData = useCallback(async (id: number) => {
    try {
      const response = await propertyAPI.getById(id);
      if (response.success) {
        const property = response.data;

        setFormData({
          title: property.title || '',
          description: property.description || '',
          type: property.type || 'apartment',
          operation: property.operation || 'sale',
          address: property.address || '',
          city: property.city || '',
          price: property.price || 0,
          bedrooms: property.bedrooms || 3,
          bathrooms: property.bathrooms || 2,
          area: property.area || 0,
          status: property.status || 'available',
          featured: property.featured || false,
          agent_id: property.agent_id || 1
        });

        if (property.images) {
          setExistingImages(
            property.images.map((img: PropertyImage) => img.image_url)
          );
        }
      }
    } catch (error) {
      console.error('Error loading property:', error);
      setErrors(['Error al cargar los datos de la propiedad']);
    }
  }, []);

useEffect(() => {
  if (propertyId) {
    loadPropertyData(propertyId);
    setIsEditing(true);
  }
}, [propertyId, loadPropertyData]);


  // Manejar cambios en inputs
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? (value === '' ? 0 : parseFloat(value)) : 
              value
    }));
  };

  // Manejar selección de imágenes
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      const validImages = selectedImages.filter(file => 
        file.type.startsWith('image/')
      );
      setImages(prev => [...prev, ...validImages]);
    }
  };

  // Eliminar imagen nueva
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar
    const validationErrors = validatePropertyForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Solo validar imágenes si no es edición o si no hay imágenes existentes
    if (!isEditing && images.length === 0) {
      setErrors(['Debes subir al menos una imagen']);
      return;
    }

    // En modo edición, si no hay imágenes existentes ni nuevas, mostrar error
    if (isEditing && existingImages.length === 0 && images.length === 0) {
      setErrors(['La propiedad debe tener al menos una imagen']);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      // Crear FormData para enviar al backend
      const formDataToSend = new FormData();
      
      // Agregar datos de la propiedad
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      // Agregar imágenes nuevas
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      let response;
      
      if (isEditing && propertyId) {
        // USAR propertyAPI.update PARA EDITAR
        response = await propertyAPI.update(propertyId, formDataToSend);
      } else {
        // Crear nueva propiedad
        response = await propertyAPI.create(formDataToSend);
      }
      
      if (response.success) {
        setSuccess(true);
        
        // Limpiar formulario solo si no es edición
        if (!isEditing) {
          setFormData({
            title: '',
            description: '',
            type: 'apartment',
            operation: 'sale',
            address: '',
            city: '',
            price: 0,
            bedrooms: 3,
            bathrooms: 2,
            area: 0,
            status: 'available',
            featured: false,
            agent_id: 1
          });
          setImages([]);
          setExistingImages([]);
        }
        
        if (onSuccess) onSuccess();
      } else {
        setErrors([response.error || `Error al ${isEditing ? 'actualizar' : 'crear'} la propiedad`]);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(['Error de conexión con el servidor']);
    } finally {
      setLoading(false);
    }
  };

  // Vista de éxito
  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          {isEditing ? '¡Propiedad actualizada!' : '¡Propiedad creada!'}
        </h3>
        <p className="text-green-700 mb-6">
          {isEditing 
            ? 'La propiedad se ha actualizado correctamente.' 
            : 'La propiedad se ha agregado correctamente a la base de datos.'}
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            if (isEditing && onCancel) onCancel();
          }}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          {isEditing ? 'Volver al panel' : 'Crear otra propiedad'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}
        </h2>
        <p className="text-gray-600">
          {isEditing 
            ? 'Modifica los campos que necesites' 
            : 'Completa todos los campos para agregar una nueva propiedad'}
        </p>
      </div>

      {/* Errores */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-bold text-red-800 mb-2">Errores:</h3>
          <ul className="list-disc list-inside text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Sección 1: Información básica */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Información Básica</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la propiedad *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Ático de lujo con vistas al mar"
                required
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (€) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 350000"
                min="0"
                step="1000"
                required
              />
              {formData.price > 0 && (
                <p className="mt-2 text-sm text-blue-600">
                  {formatPrice(formData.price)}
                </p>
              )}
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de propiedad *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                title="Selecciona el tipo de propiedad"
              >
                {PROPERTY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Operación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de operación *
              </label>
              <select
                name="operation"
                value={formData.operation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                title="Selecciona el tipo de operación"
              >
                {OPERATION_TYPES.map(op => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                title="Selecciona la ciudad"
              >
                <option value="">Seleccionar ciudad</option>
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección completa *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Calle Mayor 123, 4ºB"
                required
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe la propiedad en detalle..."
              required
            />
          </div>
        </div>

        {/* Sección 2: Características */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Características</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Dormitorios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dormitorios
              </label>
              <select
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Selecciona número de dormitorios"
              >
                <option value="0">0</option>
                {BEDROOM_OPTIONS.map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
                <option value="7">7+</option>
              </select>
            </div>

            {/* Baños */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Baños
              </label>
              <select
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Selecciona número de baños"
              >
                <option value="0">0</option>
                {BATHROOM_OPTIONS.map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
                <option value="6">6+</option>
              </select>
            </div>

            {/* Superficie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Superficie (m²) *
              </label>
              <input
                type="number"
                name="area"
                value={formData.area || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 120"
                min="0"
                required
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Selecciona el estado de la propiedad"
              >
                {STATUS_TYPES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Destacado */}
          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="featured" className="ml-3 text-gray-700">
              Marcar como propiedad destacada
            </label>
          </div>
        </div>

        {/* Sección 3: Imágenes */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Imágenes</h3>
          
          {/* Imágenes existentes (solo en edición) */}
          {isEditing && existingImages.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Imágenes actuales ({existingImages.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:5173${imageUrl}`}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Las imágenes existentes se mantendrán. Puedes agregar nuevas imágenes adicionales.
              </p>
            </div>
          )}

          {/* Subir nuevas imágenes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {isEditing ? 'Agregar más imágenes' : 'Subir imágenes *'} (mínimo {isEditing ? '0' : '1'}, máximo 10)
            </label>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                multiple
                accept="image/*"
                aria-label="Subir imágenes de la propiedad"
              />
              <div className="text-gray-500 mb-2">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Haz clic o arrastra imágenes aquí
              </div>
              <div className="text-sm text-gray-400">Formatos: JPG, PNG, WebP</div>
            </div>
          </div>

          {/* Vista previa de imágenes nuevas */}
          {images.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Imágenes nuevas ({images.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Vista previa ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {image.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading 
              ? (isEditing ? 'Actualizando propiedad...' : 'Creando propiedad...')
              : (isEditing ? 'Actualizar propiedad' : 'Crear propiedad')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;