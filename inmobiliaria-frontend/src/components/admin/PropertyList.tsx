// src/components/admin/PropertyList.tsx
import React, { useState, useEffect } from 'react';
import { propertyAPI } from '../../services/api';
import type { Property } from '../../services/api';
import { formatPrice } from '../../utils/formatters';

interface PropertyListProps {
  onEdit?: (property: Property) => void;
  onDelete?: (serial: number) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ onEdit, onDelete }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await propertyAPI.getAll();
      
      if (!response.success) {
        throw new Error(response.error || 'Error al cargar propiedades');
      }
      
      console.log('Propiedades recibidas:', response.data);
      setProperties(response.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar propiedades';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (serial: number, title: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar la propiedad "${title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:5000/api/properties/${serial}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting property');
      }
      
      // Actualizar lista después de eliminar
      fetchProperties();
      if (onDelete) onDelete(serial);
      alert('Propiedad eliminada correctamente');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar';
      alert(`Error al eliminar: ${errorMessage}`);
    }
  };

  // Iconos consistentes con tu AdminPage
  const IconEdit = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const IconTrash = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const IconEye = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const IconHome = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const IconBuilding = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const IconStore = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );

  const IconStar = () => (
    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'chalet':
      case 'house':
        return <IconHome />;
      case 'apartment':
      case 'penthouse':
        return <IconBuilding />;
      case 'commercial':
      case 'office':
        return <IconStore />;
      default:
        return <IconHome />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'available': 'Disponible',
      'sold': 'Vendido',
      'rented': 'Alquilado',
      'reserved': 'Reservado',
      'inactive': 'Inactivo'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'available': 'bg-green-100 text-green-800',
      'sold': 'bg-red-100 text-red-800',
      'rented': 'bg-blue-100 text-blue-800',
      'reserved': 'bg-yellow-100 text-yellow-800',
      'inactive': 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Cargando propiedades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-600 font-medium">Error al cargar propiedades</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <button
            onClick={fetchProperties}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconHome />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No hay propiedades</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          No se encontraron propiedades en el sistema. Comienza agregando una nueva propiedad.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propiedad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Características
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.serial} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={`http://localhost:5173${property.images[0].image_url}`}
                          alt={property.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            console.log('Image failed to load:', property.images[0].image_url);
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="h-full w-full flex flex-col items-center justify-center bg-gray-100 rounded-lg">
                                  <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span class="text-[10px] text-gray-500 mt-1">No img</span>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                          {getPropertyIcon(property.type)}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs">
                        {property.title}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {property.type} • {property.operation === 'sale' ? 'Venta' : 'Alquiler'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{property.city}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">
                    {property.address || 'Sin dirección'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    {/* CORRECCIÓN: Mostrar 0 cuando bedrooms es null/undefined */}
                    <div className="text-sm">
                      <span className="font-medium">
                        {property.bedrooms !== undefined && property.bedrooms !== null ? property.bedrooms : 0}
                      </span>
                      <span className="text-gray-500 ml-1">hab.</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{property.bathrooms}</span>
                      <span className="text-gray-500 ml-1">baños</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{property.area}</span>
                      <span className="text-gray-500 ml-1">m²</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(property.price)}
                  </div>
                  {property.featured && (
                    <div className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
                      <IconStar />
                      Destacada
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                    {getStatusText(property.status)}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    ID: {property.serial}
                  </div>
                </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex items-center space-x-2">
                {/* BOTÓN VER - CORREGIDO */}
                <button
                onClick={() => window.open(`/propiedad/${property.serial}`, '_blank')}
                className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                title="Ver detalles en nueva pestaña"
                >
                <IconEye />
                </button>
                
                {/* BOTÓN EDITAR - Usa onEdit si existe, sino alert */}
                <button
                onClick={() => {
                    if (onEdit) {
                    onEdit(property);
                    } else {
                    alert(`Función de editar para: ${property.title}\nID: ${property.serial}`);
                    }
                }}
                className="text-amber-600 hover:text-amber-800 p-1 hover:bg-amber-50 rounded transition-colors"
                title="Editar"
                >
                <IconEdit />
                </button>
                
                {/* BOTÓN ELIMINAR */}
                <button
                onClick={() => handleDelete(property.serial, property.title)}
                className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                title="Eliminar"
                >
                <IconTrash />
                </button>
            </div>
            </td>
        </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyList;