import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    property: ''
  });

  const [currentLang, setCurrentLang] = useState(localStorage.getItem('appLanguage') || 'es');

  // Función de traducción offline
  const t = (text: string): string => {
    const lang = localStorage.getItem('appLanguage') || 'es';
    
    const translations: Record<string, Record<string, string>> = {
      'en': {
        // Títulos y textos principales
        'Contacta con Nosotros': 'Contact Us',
        '¿Tienes preguntas sobre alguna propiedad? ¿Quieres visitar? ¡Escríbenos!': 
          'Do you have questions about a property? Want to visit? Write to us!',
        
        // Campos del formulario
        'Nombre completo *': 'Full Name *',
        'Tu nombre': 'Your Name',
        'Email *': 'Email *',
        'tu@email.com': 'your@email.com',
        'Teléfono': 'Phone',
        '+34 600 000 000': '+34 600 000 000',
        'Propiedad de interés': 'Property of Interest',
        'Selecciona una propiedad (opcional)': 'Select a property (optional)',
        'Mensaje *': 'Message *',
        'Hola, me interesa saber más sobre...': 'Hello, I\'m interested in learning more about...',
        'Acepto la política de privacidad y el tratamiento de mis datos para contactarme.':
          'I accept the privacy policy and the processing of my data to contact me.',
        'Enviar Mensaje': 'Send Message',
        'Formulario enviado. Nos pondremos en contacto contigo pronto.':
          'Form submitted. We will contact you soon.',
        
        // Opciones de propiedades
        'Ático de lujo con piscina': 'Luxury Penthouse with Pool',
        'Piso reformado en centro histórico': 'Renovated Apartment in Historic Center',
        'Chalet con jardín en urbanización': 'Chalet with Garden in Gated Community',
        'Local comercial a pie de calle': 'Street-Level Commercial Space',
        'Terreno urbanizable': 'Developable Land',
        
        // Sección de contacto alternativo
        'Otras formas de contacto': 'Other Ways to Contact Us',
        'L-V 10:00-19:00': 'Mon-Fri 10:00-19:00',
        'Email': 'Email',
        'Respuesta en 24h': 'Response within 24h',
        'Oficina': 'Office',
        'Calle Sierra Mariola 29': '29 Sierra Mariola Street',
        'La Nucia, Alicante': 'La Nucia, Alicante'
      },
      'fr': {
        'Contacta con Nosotros': 'Contactez-Nous',
        '¿Tienes preguntas sobre alguna propiedad? ¿Quieres visitar? ¡Escríbenos!': 
          'Vous avez des questions sur une propriété ? Vous voulez visiter ? Écrivez-nous !',
        
        // Campos del formulario
        'Nombre completo *': 'Nom Complet *',
        'Tu nombre': 'Votre Nom',
        'Email *': 'Email *',
        'tu@email.com': 'votre@email.com',
        'Teléfono': 'Téléphone',
        '+34 600 000 000': '+34 600 000 000',
        'Propiedad de interés': 'Propriété d\'Intérêt',
        'Selecciona una propiedad (opcional)': 'Sélectionnez une propriété (optionnel)',
        'Mensaje *': 'Message *',
        'Hola, me interesa saber más sobre...': 'Bonjour, je suis intéressé à en savoir plus sur...',
        'Acepto la política de privacidad y el tratamiento de mis datos para contactarme.':
          'J\'accepte la politique de confidentialité et le traitement de mes données pour me contacter.',
        'Enviar Mensaje': 'Envoyer Message',
        'Formulario enviado. Nos pondremos en contacto contigo pronto.':
          'Formulaire envoyé. Nous vous contacterons bientôt.',
        
        // Opciones de propiedades
        'Ático de lujo con piscina': 'Penthouse de Luxe avec Piscine',
        'Piso reformado en centro histórico': 'Appartement Rénové dans le Centre Historique',
        'Chalet con jardín en urbanización': 'Chalet avec Jardin en Lotissement',
        'Local comercial a pie de calle': 'Local Commercial en Rez-de-Chaussée',
        'Terreno urbanizable': 'Terrain Constructible',
        
        // Sección de contacto alternativo
        'Otras formas de contacto': 'Autres Moyens de Contact',
        'L-V 10:00-19:00': 'Lun-Ven 10:00-19:00',
        'Email': 'Email',
        'Respuesta en 24h': 'Réponse sous 24h',
        'Oficina': 'Bureau',
        'Calle Sierra Mariola 29': '29 Rue Sierra Mariola',
        'La Nucia, Alicante': 'La Nucia, Alicante'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('Formulario enviado. Nos pondremos en contacto contigo pronto.'));
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      property: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {t('Contacta con Nosotros')}
          </h1>
          <p className="text-gray-600 text-center mb-10">
            {t('¿Tienes preguntas sobre alguna propiedad? ¿Quieres visitar? ¡Escríbenos!')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Nombre completo *')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('Tu nombre')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Email *')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('tu@email.com')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Teléfono')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('+34 600 000 000')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Propiedad de interés')}
                </label>
                <select
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label={t('Seleccionar propiedad de interés')}
                >
                  <option value="">{t('Selecciona una propiedad (opcional)')}</option>
                  <option value="Ático de lujo con piscina">{t('Ático de lujo con piscina')}</option>
                  <option value="Piso reformado en centro histórico">{t('Piso reformado en centro histórico')}</option>
                  <option value="Chalet con jardín en urbanización">{t('Chalet con jardín en urbanización')}</option>
                  <option value="Local comercial a pie de calle">{t('Local comercial a pie de calle')}</option>
                  <option value="Terreno urbanizable">{t('Terreno urbanizable')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Mensaje *')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('Hola, me interesa saber más sobre...')}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="privacy"
                required
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                {t('Acepto la política de privacidad y el tratamiento de mis datos para contactarme.')}
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
            >
              {t('Enviar Mensaje')}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('Otras formas de contacto')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-blue-600 text-2xl mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">{t('Teléfono')}</h3>
                <p className="text-gray-600">+34 642 212 431</p>
                <p className="text-sm text-gray-500">{t('L-V 10:00-19:00')}</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-blue-600 text-2xl mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">{t('Email')}</h3>
                <p className="text-gray-600">info@apturist.com</p>
                <p className="text-sm text-gray-500">{t('Respuesta en 24h')}</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-blue-600 text-2xl mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">{t('Oficina')}</h3>
                <p className="text-gray-600">{t('Calle Sierra Mariola 29')}</p>
                <p className="text-sm text-gray-500">{t('La Nucia, Alicante')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;