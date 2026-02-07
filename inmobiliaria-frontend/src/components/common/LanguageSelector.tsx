// src/components/common/LanguageSelector.tsx
import React, { useState, useEffect } from 'react';

interface LanguageSelectorProps {
  onLanguageChange?: (lang: string) => void;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  onLanguageChange, 
  className = '' 
}) => {
  // Estado local para el idioma actual
  const [language, setLanguageState] = useState<'es' | 'en' | 'fr'>(() => {
    const saved = localStorage.getItem('appLanguage');
    return (saved && ['es', 'en', 'fr'].includes(saved)) 
      ? saved as 'es' | 'en' | 'fr' 
      : 'es';
  });
  
  const [isTranslating, setIsTranslating] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'es' | 'en' | 'fr';
    
    if (newLang === language) return;
    
    setIsTranslating(true);
    
    try {
      // 1. Guardar en localStorage
      localStorage.setItem('appLanguage', newLang);
      
      // 2. Actualizar estado local
      setLanguageState(newLang);
      
      // 3. Disparar evento personalizado (para TranslatedText)
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: newLang }
      }));
      
      // 4. Notificar al padre (si existe)
      if (onLanguageChange) onLanguageChange(newLang);
      
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setTimeout(() => {
        setIsTranslating(false);
      }, 300);
    }
  };

  // Escuchar cambios desde otros componentes
  useEffect(() => {
    const handleLanguageChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ language: string }>;
      if (customEvent.detail?.language && customEvent.detail.language !== language) {
        const newLang = customEvent.detail.language as 'es' | 'en' | 'fr';
        setLanguageState(newLang);
      }
    };
    
    // Escuchar eventos personalizados
    window.addEventListener('languageChanged', handleLanguageChanged);
    
    // Escuchar cambios en localStorage (desde otras pestañas)
    const handleStorageChange = () => {
      const saved = localStorage.getItem('appLanguage');
      if (saved && ['es', 'en', 'fr'].includes(saved)) {
        const newLang = saved as 'es' | 'en' | 'fr';
        if (newLang !== language) {
          setLanguageState(newLang);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChanged);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [language]);

  return (
    <div className={`relative ${className}`}>
      <select
        value={language}
        onChange={handleLanguageChange}
        className="bg-blue-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer pr-8"
        aria-label="Seleccionar idioma"
        title="Seleccionar idioma"
        disabled={isTranslating}
      >
        <option value="es">ES - Español</option>
        <option value="en">EN - English</option>
        <option value="fr">FR - Français</option>
      </select>
      
      {/* Icono de flecha */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isTranslating && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Traduciendo...
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;