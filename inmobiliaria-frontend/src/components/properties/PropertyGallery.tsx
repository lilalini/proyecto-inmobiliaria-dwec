import React, { useState } from 'react';


interface PropertyImage {
  id: number;
  image_url: string;  // ¡IMPORTANTE! Este es el nombre correcto
  alt_text?: string;
  is_primary?: boolean;
  is_main?: boolean;  // Podría ser is_main en lugar de is_primary
}

interface PropertyGalleryProps {
  images: PropertyImage[];
  propertyTitle: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, propertyTitle }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">GALERÍA DE IMÁGENES</div>
          <p className="text-gray-500 text-sm">Imagen no disponible</p>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden h-80">
        <img
          src={currentImage.image_url}
          alt={currentImage.alt_text || `Imagen de la propiedad: ${propertyTitle}`}
          className="w-full h-full object-cover"
        />
        
        {/* Contador de imágenes */}
        <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {selectedIndex + 1} / {images.length}
        </div>
        
        {/* Indicador de imagen principal */}
        {currentImage.is_primary && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
            PRINCIPAL
          </div>
        )}
      </div>

      {/* Miniaturas (solo si hay múltiples imágenes) */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative overflow-hidden rounded-lg h-16 transition-all ${
                selectedIndex === index 
                  ? 'ring-2 ring-blue-500 border-0' 
                  : 'border border-gray-200 opacity-80 hover:opacity-100'
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img
                src={image.image_url}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;