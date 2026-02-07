// inmobiliaria-frontend/src/components/common/SafeImage.tsx
import React, { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode; // Opcional: puedes personalizar el fallback
}

/**
 * Componente SafeImage - Manejo centralizado de errores de imágenes
 * 
 * USO:
 * <SafeImage 
 *   src="/images/logo.jpg" 
 *   alt="Logo" 
 *   className="h-12 w-12"
 * />
 * 
 * Ventajas:
 * 1. Lógica de errores CENTRALIZADA en un solo lugar
 * 2. Reutilizable en TODO el proyecto
 * 3. Mantenible: un cambio aquí afecta a todas las imágenes
 * 4. Profesional: patrón de diseño "Error Boundary" para recursos
 */
const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallback 
}) => {
  const [hasError, setHasError] = useState(false);

  // Fallback por defecto (elegante y genérico)
  const defaultFallback = (
    <div className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center ${className}`}>
      <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    </div>
  );

  if (hasError) {
    return fallback || defaultFallback;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy" // Optimización adicional
    />
  );
};

export default SafeImage;