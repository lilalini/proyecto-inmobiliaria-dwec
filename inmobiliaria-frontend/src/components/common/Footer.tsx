import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  // Función simple de traducción offline
  const t = (text: string): string => {
    const lang = localStorage.getItem('appLanguage') || 'es';
    
    const translations: Record<string, Record<string, string>> = {
      'en': {
        // Títulos y textos principales 
        'Más de 5 años ayudándote a encontrar el hogar perfecto.': 'Over 5 years helping you find the perfect home.',
        'Enlaces': 'Links',
        'Inicio': 'Home',
        'Visitar Propiedad': 'Visit Property',
        'Servicios': 'Services',
        'Contacto': 'Contact',
        'Horario': 'Opening Hours',
        'L-V: 10:00-19:00': 'Mon-Fri: 10:00-19:00',
        'Sáb: 10:00-14:00': 'Sat: 10:00-14:00',
        '© 2026 Apturist Inmobiliaria. Todos los derechos reservados.': '© 2026 Apturist Real Estate. All rights reserved.',
        
        // Textos de contacto
        '+34 642 212 431': '+34 642 212 431',
        'info@apturist.com': 'info@apturist.com'
      },
      'fr': {
        // Títulos y textos principales 
        'Más de 5 años ayudándote a encontrar el hogar perfecto.': 'Plus de 5 ans à vous aider à trouver la maison parfaite.',
        'Enlaces': 'Liens',
        'Inicio': 'Accueil',
        'Visitar Propiedad': 'Visiter Propriété',
        'Servicios': 'Services',
        'Contacto': 'Contact',
        'Horario': 'Heures d\'ouverture',
        'L-V: 10:00-19:00': 'Lun-Ven: 10:00-19:00',
        'Sáb: 10:00-14:00': 'Sam: 10:00-14:00',
        '© 2026 Apturist Inmobiliaria. Todos los derechos reservados.': '© 2026 Apturist Immobilier. Tous droits réservés.',
        
        '+34 642 212 431': '+34 642 212 431',
        'info@apturist.com': 'info@apturist.com'
      }
    };
    
    return translations[lang]?.[text] || text;
  };

  // Escuchar cambios de idioma para forzar re-render
  const [currentLang, setCurrentLang] = React.useState(localStorage.getItem('appLanguage') || 'es');
  
  React.useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem('appLanguage') || 'es';
      if (newLang !== currentLang) {
        setCurrentLang(newLang);
      }
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, [currentLang]);

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Apturist</h3>
            <p className="text-gray-300 text-sm">
              {t('Más de 5 años ayudándote a encontrar el hogar perfecto.')}
            </p>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-2">{t('Enlaces')}</h4>
            <div className="space-y-1">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors block text-sm">
                {t('Inicio')}
              </Link>
              <Link to="/visitar-propiedad" className="text-gray-300 hover:text-white transition-colors block text-sm">
                {t('Visitar Propiedad')}
              </Link>
              <Link to="/servicios" className="text-gray-300 hover:text-white transition-colors block text-sm">
                {t('Servicios')}
              </Link>
              <Link to="/contacto" className="text-gray-300 hover:text-white transition-colors block text-sm">
                {t('Contacto')}
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-2">{t('Contacto')}</h4>
            <div className="space-y-1.5 text-gray-300 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>{t('+34 642 212 431')}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>{t('info@apturist.com')}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-2">{t('Horario')}</h4>
            <div className="text-gray-300 text-sm">
              <div>{t('L-V: 10:00-19:00')}</div>
              <div>{t('Sáb: 10:00-14:00')}</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-4 pt-3 text-center text-gray-400 text-sm">
          <p>{t('© 2026 Apturist Inmobiliaria. Todos los derechos reservados.').replace('Apturist Real Estate', 'Apturist').replace('Apturist Immobilier', 'Apturist')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;