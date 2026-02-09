// ServicesPage.tsx - Versión Optimizada y Corregida
// ============================================
// Página: "Nuestros Servicios"
// Ruta: '/servicios' (definida en App.tsx)
// Propósito: Mostrar todos los servicios que ofrece la inmobiliaria de forma clara y sin elementos superfluos.
// ============================================

import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';

const ServicesPage: React.FC = () => {
  // Estado para re-render al cambiar idioma
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('appLanguage') || 'es');
  
  // Función de traducción offline
  const t = (text: string): string => {
    const lang = localStorage.getItem('appLanguage') || 'es';
    
    const translations: Record<string, Record<string, string>> = {
      'en': {
        // Títulos y textos principales
        'Nuestros Servicios': 'Our Services',
        'Soluciones especializadas y personalizadas para cada paso de tu proceso inmobiliario.': 
          'Specialized and personalized solutions for every step of your real estate process.',
        
        // Servicios
        'Venta de Propiedades': 'Property Sales',
        'Gestión completa del proceso de venta, desde la valoración hasta la firma de escrituras.': 
          'Complete management of the sales process, from valuation to signing of deeds.',
        'Alquiler Residencial y Comercial': 'Residential and Commercial Rental',
        'Servicio integral de alquiler con gestión de contratos y mantenimiento.': 
          'Comprehensive rental service with contract management and maintenance.',
        'Tasaciones Profesionales': 'Professional Appraisals',
        'Valoración precisa de inmuebles con informes detallados y certificados.': 
          'Accurate property valuation with detailed and certified reports.',
        'Asesoramiento Legal': 'Legal Advice',
        'Acompañamiento legal en todas las etapas de la transacción inmobiliaria.': 
          'Legal support at all stages of the real estate transaction.',
        'Gestión de Inversiones': 'Investment Management',
        'Asesoramiento para inversores en el sector inmobiliario.': 
          'Advice for investors in the real estate sector.',
        'Consultoría Inmobiliaria': 'Real Estate Consulting',
        'Soluciones personalizadas para proyectos y desarrollos inmobiliarios.': 
          'Customized solutions for real estate projects and developments.',
        
        // Características de servicios
        'Valoración profesional': 'Professional Valuation',
        'Marketing digital': 'Digital Marketing',
        'Gestión de visitas': 'Visit Management',
        'Asesoramiento legal': 'Legal Advice',
        'Búsqueda de inquilinos': 'Tenant Search',
        'Contratación': 'Hiring',
        'Gestión de incidencias': 'Incident Management',
        'Cobro de rentas': 'Rent Collection',
        'Informe técnico': 'Technical Report',
        'Comparativa de mercado': 'Market Comparison',
        'Certificación oficial': 'Official Certification',
        'Asesoramiento fiscal': 'Tax Advice',
        'Revisión de contratos': 'Contract Review',
        'Tramitación notarial': 'Notarial Processing',
        'Gestión hipotecaria': 'Mortgage Management',
        'Análisis de rentabilidad': 'Profitability Analysis',
        'Búsqueda de oportunidades': 'Opportunity Search',
        'Gestión de cartera': 'Portfolio Management',
        'Optimización fiscal': 'Tax Optimization',
        'Estudios de mercado': 'Market Studies',
        'Planificación estratégica': 'Strategic Planning',
        'Desarrollo de proyectos': 'Project Development',
        'Gestión de obras': 'Work Management',
        
        // Sección inferior
        '¿Cómo podemos ayudarte?': 'How can we help you?',
        'Cuéntanos qué necesitas y uno de nuestros expertos te guiará con la mejor solución, sin compromiso.':
          'Tell us what you need and one of our experts will guide you with the best solution, no obligation.',
        'Hablar con un asesor': 'Talk to an Advisor',
        'Te contactaremos en menos de 24 horas.': 'We will contact you within 24 hours.',
        'Incluye:': 'Includes:'
      },
      'fr': {
        'Nuestros Servicios': 'Nos Services',
        'Soluciones especializadas y personalizadas para cada paso de tu proceso inmobiliario.': 
          'Solutions spécialisées et personnalisées pour chaque étape de votre processus immobilier.',
        
        // Servicios
        'Venta de Propiedades': 'Vente de Propriétés',
        'Gestión completa del proceso de venta, desde la valoración hasta la firma de escrituras.': 
          'Gestion complète du processus de vente, de l\'évaluation à la signature des actes.',
        'Alquiler Residencial y Comercial': 'Location Résidentielle et Commerciale',
        'Servicio integral de alquiler con gestión de contratos y mantenimiento.': 
          'Service de location complet avec gestion des contrats et maintenance.',
        'Tasaciones Profesionales': 'Expertises Professionnelles',
        'Valoración precisa de inmuebles con informes detallados y certificados.': 
          'Évaluation précise des biens avec rapports détaillés et certifiés.',
        'Asesoramiento Legal': 'Conseil Juridique',
        'Acompañamiento legal en todas las étapes de la transacción inmobiliaria.': 
          'Accompagnement juridique à toutes les étapes de la transaction immobilière.',
        'Gestión de Inversiones': 'Gestion d\'Investissements',
        'Asesoramiento para inversores en el sector inmobiliario.': 
          'Conseil aux investisseurs dans le secteur immobilier.',
        'Consultoría Inmobiliaria': 'Conseil Immobilier',
        'Soluciones personalizadas para proyectos y desarrollos inmobiliarios.': 
          'Solutions personnalisées pour projets et développements immobiliers.',
        
        // Características de servicios
        'Valoración profesional': 'Évaluation Professionnelle',
        'Marketing digital': 'Marketing Digital',
        'Gestión de visitas': 'Gestion des Visites',
        'Asesoramiento legal': 'Conseil Juridique',
        'Búsqueda de inquilinos': 'Recherche de Locataires',
        'Contratación': 'Recrutement',
        'Gestión de incidencias': 'Gestion des Incidents',
        'Cobro de rentas': 'Recouvrement des Loyers',
        'Informe técnico': 'Rapport Technique',
        'Comparativa de mercado': 'Comparaison de Marché',
        'Certificación oficial': 'Certification Officielle',
        'Asesoramiento fiscal': 'Conseil Fiscal',
        'Revisión de contratos': 'Révision des Contrats',
        'Tramitación notarial': 'Traitement Notarial',
        'Gestión hipotecaria': 'Gestion Hypothécaire',
        'Análisis de rentabilidad': 'Analyse de Rentabilité',
        'Búsqueda de oportunidades': 'Recherche d\'Opportunités',
        'Gestión de cartera': 'Gestion de Portefeuille',
        'Optimización fiscal': 'Optimisation Fiscale',
        'Estudios de mercado': 'Études de Marché',
        'Planificación estratégica': 'Planification Stratégique',
        'Desarrollo de proyectos': 'Développement de Projets',
        'Gestión de obras': 'Gestion des Travaux',
        
        // Sección inferior
        '¿Cómo podemos ayudarte?': 'Comment pouvons-nous vous aider?',
        'Cuéntanos qué necesitas y uno de nuestros expertos te guiará con la mejor solución, sin compromiso.':
          'Dites-nous ce dont vous avez besoin et un de nos experts vous guidera avec la meilleure solution, sans engagement.',
        'Hablar con un asesor': 'Parler à un Conseiller',
        'Te contactaremos en menos de 24 horas.': 'Nous vous contacterons dans les 24 heures.',
        'Incluye:': 'Comprend:'
      }
    };
    
    return translations[lang]?.[text] || text;
  };

  // Escuchar cambios de idioma
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem('appLanguage') || 'es';
      if (newLang !== currentLang) {
        setCurrentLang(newLang);
      }
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, [currentLang]);

  const services = [
    {
      title: 'Venta de Propiedades',
      description: 'Gestión completa del proceso de venta, desde la valoración hasta la firma de escrituras.',
      features: ['Valoración profesional', 'Marketing digital', 'Gestión de visitas', 'Asesoramiento legal'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: 'Alquiler Residencial y Comercial',
      description: 'Servicio integral de alquiler con gestión de contratos y mantenimiento.',
      features: ['Búsqueda de inquilinos', 'Contratación', 'Gestión de incidencias', 'Cobro de rentas'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Tasaciones Profesionales',
      description: 'Valoración precisa de inmuebles con informes detallados y certificados.',
      features: ['Informe técnico', 'Comparativa de mercado', 'Certificación oficial', 'Asesoramiento fiscal'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Asesoramiento Legal',
      description: 'Acompañamiento legal en todas las etapas de la transacción inmobiliaria.',
      features: ['Revisión de contratos', 'Tramitación notarial', 'Gestión hipotecaria', 'Asesoría fiscal'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: 'Gestión de Inversiones',
      description: 'Asesoramiento para inversores en el sector inmobiliario.',
      features: ['Análisis de rentabilidad', 'Búsqueda de oportunidades', 'Gestión de cartera', 'Optimización fiscal'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Consultoría Inmobiliaria',
      description: 'Soluciones personalizadas para proyectos y desarrollos inmobiliarios.',
      features: ['Estudios de mercado', 'Planificación estratégica', 'Desarrollo de proyectos', 'Gestión de obras'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Cabecera Elegante */}
        <div className="text-center mb-16">
          <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-6 rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            {t('Nuestros Servicios')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('Soluciones especializadas y personalizadas para cada paso de tu proceso inmobiliario.')}
          </p>
        </div>

        {/* Grid de Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {t(service.title)}
                  </h3>
                </div>

                <p className="text-gray-600 mb-6">
                  {t(service.description)}
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                    {t('Incluye:')}
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{t(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de Cierre */}
        <div className="text-center border-t border-gray-200 pt-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('¿Cómo podemos ayudarte?')}
            </h2>
            <p className="text-gray-600 text-lg mb-10">
              {t('Cuéntanos qué necesitas y uno de nuestros expertos te guiará con la mejor solución, sin compromiso.')}
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              {t('Hablar con un asesor')}
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              {t('Te contactaremos en menos de 24 horas.')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;