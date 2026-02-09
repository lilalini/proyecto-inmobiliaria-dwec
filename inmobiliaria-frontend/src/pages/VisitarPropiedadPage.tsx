import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const VisitarPropiedadPage: React.FC = () => {
  // Estado para forzar re-render al cambiar idioma
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('appLanguage') || 'es');
  
  // Lista de ejemplo de propiedades "destacadas" o "recientes" - MANTIENE TUS DATOS
  const propiedadesEjemplo = [
    { 
      id: 1,
      title: 'Ático de lujo con vistas al mar', 
      address: 'Paseo de la Castellana 100, Benidorm', 
      price: '1.250.000 €' 
    },
    { 
      id: 2, 
      title: 'Apartamento de lujo en primera línea de playa', 
      address: 'Calle Mayor 45, Marbella', 
      price: '850.000 €' 
    },
    { 
      id: 3, 
      title: 'Chalet de lujo con piscina y jardín', 
      address: 'Calle de los Pinos 23, Sotogrande', 
      price: '1.850.000 €' 
    },
  ];

  // Función de traducción offline - SIMPLE
  const t = (text: string): string => {
    const lang = localStorage.getItem('appLanguage') || 'es';
    
    const translations: Record<string, Record<string, string>> = {
      'en': {
        '¿Cómo visitar una propiedad?': 'How to Visit a Property?',
        'Te guiamos en el proceso para que puedas conocer la propiedad que te interesa de forma fácil y segura.': 
          'We guide you through the process so you can get to know the property you are interested in easily and safely.',
        
        // Pasos
        'Encuentra tu propiedad ideal': 'Find Your Ideal Property',
        'Navega por nuestro catálogo y usa los filtros para encontrar lo que buscas.': 
          'Browse our catalog and use filters to find what you are looking for.',
        'Ver propiedades disponibles →': 'View Available Properties →',
        
        'Revisa los detalles': 'Check the Details',
        'Haz clic en cualquier propiedad para ver fotos, descripción completa, ubicación y características.': 
          'Click on any property to view photos, full description, location and features.',
        'Allí encontrarás el formulario para solicitar la visita.': 
          'There you will find the form to request a visit.',
        
        'Solicita la visita': 'Request a Visit',
        'Completa el formulario en la página de la propiedad. Un agente se pondrá en contacto contigo para coordinar.': 
          'Complete the form on the property page. An agent will contact you to coordinate.',
        
        // Propiedades populares
        'Propiedades populares para visitar': 'Popular Properties to Visit',
        'Explorar todas las propiedades': 'Explore All Properties',
        
        // Textos de propiedades (OPCIONAL - si quieres traducir los títulos de ejemplo)
        'Ático de lujo con vistas al mar': 'Luxury Penthouse with Sea Views',
        'Apartamento de lujo en primera línea de playa': 'Luxury Apartment on Beachfront',
        'Chalet de lujo con piscina y jardín': 'Luxury Chalet with Pool and Garden',
        
        // Botones
        'Ver detalles': 'View Details'
      },
      'fr': {
        '¿Cómo visitar una propiedad?': 'Comment Visiter une Propriété?',
        'Te guiamos en el proceso para que puedas conocer la propiedad que te interesa de forma fácil y segura.': 
          'Nous vous guidons dans le processus pour que vous puissiez connaître la propriété qui vous intéresse facilement et en toute sécurité.',
        
        // Pasos
        'Encuentra tu propiedad ideal': 'Trouvez Votre Propriété Idéale',
        'Navega por nuestro catálogo y usa los filtros para encontrar lo que buscas.': 
          'Parcourez notre catalogue et utilisez les filtres pour trouver ce que vous cherchez.',
        'Ver propiedades disponibles →': 'Voir les Propriétés Disponibles →',
        
        'Revisa los detalles': 'Vérifiez les Détails',
        'Haz clic en cualquier propiedad para ver fotos, descripción completa, ubicación y características.': 
          'Cliquez sur n\'importe quelle propriété pour voir les photos, la description complète, l\'emplacement et les caractéristiques.',
        'Allí encontrarás el formulario para solicitar la visita.': 
          'Vous y trouverez le formulaire pour demander une visite.',
        
        'Solicita la visita': 'Demander une Visite',
        'Completa el formulario en la página de la propiedad. Un agente se pondrá en contacto contigo para coordinar.': 
          'Remplissez le formulaire sur la page de la propriété. Un agent vous contactera pour coordonner.',
        
        // Propiedades populares
        'Propiedades populares para visitar': 'Propriétés Populaires à Visiter',
        'Explorar todas las propiedades': 'Explorer Toutes les Propriétés',
        
        // Textos de propiedades (OPCIONAL)
        'Ático de lujo con vistas al mar': 'Penthouse de Luxe avec Vue sur Mer',
        'Apartamento de lujo en primera línea de playa': 'Appartement de Luxe en Première Ligne de Plage',
        'Chalet de lujo con piscina y jardín': 'Chalet de Luxe avec Piscine et Jardin',
        
        // Botones
        'Ver detalles': 'Voir Détails'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Título y descripción - CON TRADUCCIÓN */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('¿Cómo visitar una propiedad?')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('Te guiamos en el proceso para que puedas conocer la propiedad que te interesa de forma fácil y segura.')}
          </p>
        </div>

        {/* Pasos del proceso - DISEÑO ORIGINAL CON TRADUCCIÓN */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="text-blue-600 text-3xl font-bold mb-4">1</div>
            <h3 className="text-xl font-semibold mb-3">
              {t('Encuentra tu propiedad ideal')}
            </h3>
            <p className="text-gray-700 mb-6">
              {t('Navega por nuestro catálogo y usa los filtros para encontrar lo que buscas.')}
            </p>
            <Link to="/" className="inline-block text-blue-600 font-semibold hover:text-blue-800">
              {t('Ver propiedades disponibles →')}
            </Link>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="text-blue-600 text-3xl font-bold mb-4">2</div>
            <h3 className="text-xl font-semibold mb-3">
              {t('Revisa los detalles')}
            </h3>
            <p className="text-gray-700 mb-6">
              {t('Haz clic en cualquier propiedad para ver fotos, descripción completa, ubicación y características.')}
            </p>
            <p className="text-sm text-gray-500">
              {t('Allí encontrarás el formulario para solicitar la visita.')}
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="text-blue-600 text-3xl font-bold mb-4">3</div>
            <h3 className="text-xl font-semibold mb-3">
              {t('Solicita la visita')}
            </h3>
            <p className="text-gray-700 mb-6">
              {t('Completa el formulario en la página de la propiedad. Un agente se pondrá en contacto contigo para coordinar.')}
            </p>
          </div>
        </div>

        {/* Propiedades de ejemplo - DISEÑO ORIGINAL CON TRADUCCIÓN OPCIONAL */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            {t('Propiedades populares para visitar')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {propiedadesEjemplo.map(prop => (
              <Link 
                key={prop.id} 
                to={`/propiedad/${prop.id}`}
                className="block bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Título traducido OPCIONALMENTE - puedes quitar t() si no quieres traducir títulos de ejemplo */}
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {t(prop.title)}
                  </h3>
                  <p className="text-gray-600 mb-3">{prop.address}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">{prop.price}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {t('Ver detalles')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg px-10 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            {t('Explorar todas las propiedades')}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VisitarPropiedadPage;