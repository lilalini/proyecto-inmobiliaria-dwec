// src/utils/translation.ts
import { translateText } from './translate';

// Cache para traducciones ONLINE (evita llamadas repetidas a API)
const translationCache: Record<string, string> = {};

// Obtener idioma actual
export const getCurrentLanguage = (): string => {
  const lang = localStorage.getItem('appLanguage');
  return lang && ['es', 'en', 'fr'].includes(lang) ? lang : 'es';
};

// Escuchadores para cambios de idioma
type LanguageChangeCallback = (lang: string) => void;
const languageChangeCallbacks: LanguageChangeCallback[] = [];

// Cambiar idioma y notificar a todos
export const setCurrentLanguage = (lang: string): void => {
  if (!['es', 'en', 'fr'].includes(lang)) {
    console.warn(`Idioma no soportado: ${lang}. Usando español.`);
    lang = 'es';
  }
  
  localStorage.setItem('appLanguage', lang);
  console.log(`Idioma cambiado a: ${lang}`);
  
  // Notificar a todos los escuchadores
  languageChangeCallbacks.forEach(callback => {
    try {
      callback(lang);
    } catch (error) {
      console.error('Error en callback de cambio de idioma:', error);
    }
  });
};

// Suscribirse a cambios de idioma
export const onLanguageChange = (callback: LanguageChangeCallback): (() => void) => {
  languageChangeCallbacks.push(callback);
  
  // Devolver función para desuscribirse
  return () => {
    const index = languageChangeCallbacks.indexOf(callback);
    if (index > -1) {
      languageChangeCallbacks.splice(index, 1);
    }
  };
};

// Función principal de traducción INTELIGENTE
export const translate = async (
  text: string,
  targetLang?: string,
  sourceLang: string = 'es'
): Promise<string> => {
  if (!text.trim()) return text;
  
  const finalTargetLang = targetLang || getCurrentLanguage();
  
  // Mismo idioma = no traducir
  if (finalTargetLang === sourceLang) {
    return text;
  }

  // Crear clave de cache única
  const cacheKey = `${sourceLang}-${finalTargetLang}-${text}`;
  
  // Verificar cache primero (para traducciones ONLINE previas)
  if (translationCache[cacheKey]) {
    console.log(`Cache HIT: "${text}"`);
    return translationCache[cacheKey];
  }

  console.log(`Traduciendo: "${text}" (${sourceLang} → ${finalTargetLang})`);
  
  // Usar translateText (que decide si usar offline o API)
  const translated = await translateText(text, sourceLang, finalTargetLang);
  
  // Guardar en cache SOLO si fue una traducción ONLINE (API)
  // Las offline ya están en CRITICAL_TRANSLATIONS
  if (translated !== text) {
    translationCache[cacheKey] = translated;
  }
  
  return translated;
};

// Traducir múltiples textos de forma eficiente
export const translateMultiple = async (
  texts: Record<string, string>,
  targetLang?: string,
  sourceLang: string = 'es'
): Promise<Record<string, string>> => {
  const results: Record<string, string> = {};
  const finalTargetLang = targetLang || getCurrentLanguage();
  
  // Si es el mismo idioma, devolver textos originales
  if (finalTargetLang === sourceLang) {
    return { ...texts };
  }
  
  // Preparar promesas de traducción
  const promises = Object.entries(texts).map(async ([key, text]) => {
    results[key] = await translate(text, finalTargetLang, sourceLang);
  });
  
  // Esperar todas las traducciones
  await Promise.all(promises);
  
  return results;
};