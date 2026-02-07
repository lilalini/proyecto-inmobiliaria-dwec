// src/components/common/TranslatedInput.tsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from 'react';
import { translate } from '../../utils/translation';

interface TranslatedInputProps {
  label?: string; // Hacerlo opcional
  type?: 'text' | 'number' | 'email' | 'password' | 'tel';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
  ariaLabel?: string;
}

export const TranslatedInput: React.FC<TranslatedInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  ariaLabel
}) => {
  const [translatedPlaceholder, setTranslatedPlaceholder] = useState(placeholder);
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('appLanguage') || 'es';
  });

  // Traducir placeholder cuando cambia el idioma
  useEffect(() => {
    const updatePlaceholder = async () => {
      if (currentLang === 'es' || !placeholder.trim()) {
        setTranslatedPlaceholder(placeholder);
        return;
      }

      try {
        const translated = await translate(placeholder, currentLang);
        setTranslatedPlaceholder(translated);
      } catch (error) {
        console.error('Error traduciendo placeholder:', error);
        setTranslatedPlaceholder(placeholder);
      }
    };

    updatePlaceholder();
  }, [placeholder, currentLang]);

  // Escuchar cambios de idioma
  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ language: string }>;
      const newLang = customEvent.detail?.language || localStorage.getItem('appLanguage') || 'es';
      if (newLang !== currentLang) {
        setCurrentLang(newLang);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [currentLang]);

   return (
    <>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={translatedPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        required={required}
        aria-label={ariaLabel || translatedPlaceholder}
        title={translatedPlaceholder}
      />
    </>
  );
};