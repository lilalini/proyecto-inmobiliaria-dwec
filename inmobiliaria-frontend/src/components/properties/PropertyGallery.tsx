import { useState, useEffect, useCallback } from 'react';  // Añadir useCallback
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PropertyImage {
  id: number;
  image_url: string;
  alt_text?: string;
  is_primary?: boolean;
}

interface PropertyGalleryProps {
  images: PropertyImage[];
  propertyTitle: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, propertyTitle }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Definir funciones con useCallback para evitar dependencias cambiantes
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  
  const goToNext = useCallback(() => {
    setSelectedIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  }, [images.length]);
  
  const goToPrevious = useCallback(() => {
    setSelectedIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  }, [images.length]);
  
  // useEffect DEBE ir ANTES de cualquier return
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, goToPrevious, goToNext]); // Todas las dependencias
  
  // Ahora el return condicional
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

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* GALERÍA ORIGINAL (funcional) */}
      <div className="space-y-4">
        <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden h-80">
         <img
  src={images[selectedIndex].image_url}
  alt={images[selectedIndex].alt_text || `Imagen de ${propertyTitle}`}
  className="w-auto h-full max-w-full bg-white cursor-pointer"  // w-auto y max-w-full
  onClick={() => openModal(selectedIndex)}
/>
          <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {selectedIndex + 1} / {images.length}
          </div>
          
          {images[selectedIndex].is_primary && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
              PRINCIPAL
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
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

      {/* MODAL (con navegación por teclado) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full z-10"
            aria-label="Cerrar galería"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>

          <div className="relative max-w-6xl max-h-[90vh] w-full">
            <img
              src={images[selectedIndex].image_url}
              alt={`Imagen ${selectedIndex + 1} de ${images.length} de ${propertyTitle}`}
              className="w-full h-auto max-h-[80vh] object-contain mx-auto"
            />
            
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
                  {selectedIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyGallery;