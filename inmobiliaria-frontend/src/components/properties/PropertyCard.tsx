import React, { useState, useEffect, useCallback } from 'react';
import type { Property } from '../../services/api';
import { translateText } from '../../utils/translate';
import { getCurrentLanguage } from '../../utils/translation';

interface PropertyCardProps {
  property: Property;
  onViewDetails?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
  const [translatedDescription, setTranslatedDescription] = useState(property.description);
  const [translatedTitle, setTranslatedTitle] = useState(property.title); // NUEVO: título traducido
  
  // Función para traducir textos dinámicos (descripción y título)
  const handleLanguageChange = useCallback(async () => {
    const currentLang = getCurrentLanguage();
    
    // Solo traducir si no es español
    if (currentLang !== 'es') {
      try {
        // Traducir descripción
        if (property.description) {
          const translatedDesc = await translateText(property.description, 'es', currentLang);
          setTranslatedDescription(translatedDesc);
        }
        
        // Traducir título
        if (property.title) {
          const translatedTitleText = await translateText(property.title, 'es', currentLang);
          setTranslatedTitle(translatedTitleText);
        }
      } catch (error) {
        console.error('Error traduciendo propiedad:', error);
        // Si falla, mantener textos originales
        setTranslatedDescription(property.description);
        setTranslatedTitle(property.title);
      }
    } else {
      // Español: textos originales
      setTranslatedDescription(property.description);
      setTranslatedTitle(property.title);
    }
  }, [property.description, property.title]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      handleLanguageChange();
    }, 0);
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [handleLanguageChange]);
  
  // Función para traducir texto estático usando el diccionario offline
  const translateStaticText = useCallback((text: string): string => {
    const currentLang = getCurrentLanguage();
    if (currentLang === 'es') return text;
    
    // Diccionario simple para textos estáticos
    const staticTranslations: Record<string, Record<string, string>> = {
      'en': {
        'DISPONIBLE': 'AVAILABLE',
        'VENDIDO': 'SOLD', 
        'ALQUILADO': 'RENTED',
        'UBICACIÓN': 'LOCATION',
        'Precio total': 'Total price',
        'Dormitorios': 'Bedrooms',
        'Baños': 'Bathrooms',
        'm²': 'm²',
        'IMAGEN NO DISPONIBLE': 'IMAGE NOT AVAILABLE',
        'Propiedad': 'Property',
        'Ver detalles': 'View details',
        'Casa': 'House',
        'Apartamento': 'Apartment',
        'Chalet': 'Chalet',
        'Ático': 'Penthouse',
        'Local Comercial': 'Commercial Property',
        'Oficina': 'Office',
        'Terreno': 'Land'
      },
      'fr': {
        'DISPONIBLE': 'DISPONIBLE',
        'VENDIDO': 'VENDU', 
        'ALQUILADO': 'LOUÉ',
        'UBICACIÓN': 'EMPLACEMENT',
        'Precio total': 'Prix total',
        'Dormitorios': 'Chambres',
        'Baños': 'Salles de bain',
        'm²': 'm²',
        'IMAGEN NO DISPONIBLE': 'IMAGE NON DISPONIBLE',
        'Propiedad': 'Propriété',
        'Ver detalles': 'Voir détails',
        'Casa': 'Maison',
        'Apartamento': 'Appartement',
        'Chalet': 'Chalet',
        'Ático': 'Penthouse',
        'Local Comercial': 'Local Commercial',
        'Oficina': 'Bureau',
        'Terreno': 'Terrain'
      }
    };
    
    return staticTranslations[currentLang]?.[text] || text;
  }, []);
  
  const formatPrice = (price: number) => {
    const currentLang = getCurrentLanguage();
    return new Intl.NumberFormat(currentLang === 'es' ? 'es-ES' : 
                                 currentLang === 'fr' ? 'fr-FR' : 'en-US', {
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

  const getStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      available: 'DISPONIBLE',
      sold: 'VENDIDO',
      rented: 'ALQUILADO'
    };
    return statusTexts[status] || status;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      {/* IMAGEN */}
      <div className="relative h-56 bg-gray-50 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0].image_url}
            alt={translatedTitle} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <div className="text-gray-400 text-xs font-medium mb-1">
                {translateStaticText('IMAGEN NO DISPONIBLE')}
              </div>
              <div className="text-gray-400 text-sm">
                {translateStaticText('Propiedad')} #{property.serial}
              </div>
            </div>
          </div>
        )}
        
        {/* Badge de estado */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`}>
            {translateStaticText(getStatusText(property.status))}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="mb-3">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {translateStaticText(getTypeLabel(property.type))}
          </span>
        </div>

        {/* TÍTULO TRADUCIDO */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {translatedTitle}
        </h3>

        {/* DESCRIPCIÓN TRADUCIDA */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {translatedDescription}
        </p>

        {/* Características */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {property.bedrooms && (
            <div className="text-center p-2 border border-gray-100 rounded-lg">
              <div className="font-bold text-gray-900 text-lg">{property.bedrooms}</div>
              <div className="text-gray-500 text-xs">
                {translateStaticText('Dormitorios')}
              </div>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="text-center p-2 border border-gray-100 rounded-lg">
              <div className="font-bold text-gray-900 text-lg">{property.bathrooms}</div>
              <div className="text-gray-500 text-xs">
                {translateStaticText('Baños')}
              </div>
            </div>
          )}
          
          <div className="text-center p-2 border border-gray-100 rounded-lg">
            <div className="font-bold text-gray-900 text-lg">{property.area}</div>
            <div className="text-gray-500 text-xs">
              {translateStaticText('m²')}
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="mb-5">
          <div className="text-gray-500 text-xs mb-1">
            {translateStaticText('UBICACIÓN')}
          </div>
          <div className="text-gray-700 text-sm truncate">{property.address}, {property.city}</div>
        </div>

        {/* Footer con precio y botón */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(property.price)}</div>
            <div className="text-gray-500 text-sm">
              {translateStaticText('Precio total')}
            </div>
          </div>
          
          <button 
            onClick={onViewDetails}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {translateStaticText('Ver detalles')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;