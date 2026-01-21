import React from 'react';
import type { Property } from '../../services/api';

interface PropertyCardProps {
  property: Property;
  onViewDetails?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      house: 'Casa',
      apartment: 'Apartamento',
      land: 'Terreno',
      commercial: 'Local Comercial',
      chalet: 'Chalet',
      penthouse: 'Ático',
      office: 'Oficina'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      sold: 'bg-red-100 text-red-800',
      rented: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      {/* IMAGEN REAL - usa la primera imagen si existe */}
      <div className="relative h-56 bg-gray-50 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0].image_url}  // SOLO url
            alt={property.title}  // SOLO el título de propiedad
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <div className="text-gray-400 text-xs font-medium mb-1">IMAGEN NO DISPONIBLE</div>
              <div className="text-gray-400 text-sm">Propiedad #{property.serial}</div>
            </div>
          </div>
        )}
        
        {/* Badge de estado */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`}>
            {property.status === 'available' ? 'DISPONIBLE' : 
             property.status === 'sold' ? 'VENDIDO' : 'ALQUILADO'}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="mb-3">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {getTypeLabel(property.type)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Características - SIN EMOJIS */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {property.bedrooms && (
            <div className="text-center p-2 border border-gray-100 rounded-lg">
              <div className="font-bold text-gray-900 text-lg">{property.bedrooms}</div>
              <div className="text-gray-500 text-xs">Dormitorios</div>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="text-center p-2 border border-gray-100 rounded-lg">
              <div className="font-bold text-gray-900 text-lg">{property.bathrooms}</div>
              <div className="text-gray-500 text-xs">Baños</div>
            </div>
          )}
          
          <div className="text-center p-2 border border-gray-100 rounded-lg">
            <div className="font-bold text-gray-900 text-lg">{property.area}</div>
            <div className="text-gray-500 text-xs">m²</div>
          </div>
        </div>

        {/* Ubicación - SIN EMOJIS */}
        <div className="mb-5">
          <div className="text-gray-500 text-xs mb-1">UBICACIÓN</div>
          <div className="text-gray-700 text-sm truncate">{property.address}, {property.city}</div>
        </div>

        {/* Footer con precio y botón */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(property.price)}</div>
            <div className="text-gray-500 text-sm">Precio total</div>
          </div>
          
          <button 
            onClick={onViewDetails}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;