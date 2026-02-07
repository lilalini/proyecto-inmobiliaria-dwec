// src/components/common/TranslatedText.tsx - VERSIÓN SIMPLIFICADA
import React, { useState, useEffect } from 'react';

interface TranslatedTextProps {
  text: string;
  className?: string;
  tag?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'div' | 'strong' | 'em';
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  text, 
  className = '', 
  tag = 'span'
}) => {
  const [translatedText, setTranslatedText] = useState(text);
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('appLanguage') || 'es';
  });

  // Actualizar traducción cuando cambia el texto o el idioma
  useEffect(() => {
    const updateTranslation = async () => {
      if (currentLang === 'es' || !text.trim()) {
        setTranslatedText(text);
        return;
      }

      try {
        // Importar dinámicamente para evitar ciclos
        const { translate } = await import('../../utils/translation');
        const result = await translate(text, currentLang);
        setTranslatedText(result);
      } catch (error) {
        console.error('Error traduciendo:', error);
        setTranslatedText(text);
      }
    };

    updateTranslation();
  }, [text, currentLang]);

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

  // Renderizado según el tag
  switch (tag) {
    case 'h1': return <h1 className={className}>{translatedText}</h1>;
    case 'h2': return <h2 className={className}>{translatedText}</h2>;
    case 'h3': return <h3 className={className}>{translatedText}</h3>;
    case 'h4': return <h4 className={className}>{translatedText}</h4>;
    case 'h5': return <h5 className={className}>{translatedText}</h5>;
    case 'p': return <p className={className}>{translatedText}</p>;
    case 'div': return <div className={className}>{translatedText}</div>;
    case 'strong': return <strong className={className}>{translatedText}</strong>;
    case 'em': return <em className={className}>{translatedText}</em>;
    default: return <span className={className}>{translatedText}</span>;
  }
};

export default TranslatedText;