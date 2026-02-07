// src/utils/languageState.ts
let currentLanguage = localStorage.getItem('appLanguage') || 'es';
let listeners: Array<() => void> = [];

export const getLanguage = () => currentLanguage;

export const setLanguage = (lang: string) => {
  currentLanguage = lang;
  localStorage.setItem('appLanguage', lang);
  
  // Notificar a TODOS los listeners
  listeners.forEach(listener => listener());
};

export const onLanguageChange = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};