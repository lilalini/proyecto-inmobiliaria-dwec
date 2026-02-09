import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PropertyGallery from '../components/properties/PropertyGallery';
import NewVisitForm from '../components/forms/NewVisitForm';
import type { Property } from '../services/api';
import { propertyAPI } from '../services/api';
import { translateText } from '../utils/translate';
import { getCurrentLanguage } from '../utils/translation';

// Importar Heroicons
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserCircleIcon,
  XMarkIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [translatedDescription, setTranslatedDescription] = useState('');
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  
  // Función de traducción offline para textos estáticos
  const t = (text: string): string => {
    const lang = getCurrentLanguage();
    
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'Cargando información de la propiedad...': 'Loading property information...',
        'No se pudo cargar la propiedad': 'Could not load property',
        'La propiedad solicitada no existe o no está disponible.': 'The requested property does not exist or is not available.',
        'Volver atrás': 'Go Back',
        'Ir al catálogo': 'Go to Catalog',
        'Inicio': 'Home',
        'DISPONIBLE': 'AVAILABLE',
        'VENDIDA': 'SOLD',
        'ALQUILADA': 'RENTED',
        'Solicitar visita': 'Request Visit',
        'Cancelar solicitud': 'Cancel Request',
        'Solicitar visita para esta propiedad': 'Request Visit for this Property',
        'Ubicación aproximada': 'Approximate Location',
        'Mapa de referencia': 'Reference Map',
        'Precio de venta': 'Sale Price',
        'Dorm.': 'Bedr.',
        'Baños': 'Bath',
        'm²': 'm²',
        'Tipo': 'Type',
        'Energía': 'Energy',
        'Garaje': 'Garage',
        'Descripción': 'Description',
        'Contactar agente': 'Contact Agent',
        'Agente': 'Agent',
        'Contactar ahora': 'Contact Now',
        'Contactar al agente': 'Contact Agent',
        'Cerrar ventana de contacto': 'Close Contact Window',
        'Ej: Juan Pérez': 'Eg: John Smith',
        'ejemplo@email.com': 'example@email.com',
        'Me interesa la propiedad': 'I\'m interested in the property',
        'y quisiera más información.': 'and would like more information.',
        'Cancelar': 'Cancel',
        'Enviar mensaje': 'Send Message',
        'Mensaje enviado (funcionalidad por implementar)': 'Message sent (functionality to be implemented)',
        
        // Tipos de propiedad
        'Casa': 'House',
        'Apto': 'Apt',
        'Terr': 'Land',
        'Com.': 'Comm.'
      },
      'fr': {
        'Cargando información de la propiedad...': 'Chargement des informations de la propriété...',
        'No se pudo cargar la propiedad': 'Impossible de charger la propriété',
        'La propiedad solicitada no existe o no está disponible.': 'La propriété demandée n\'existe pas ou n\'est pas disponible.',
        'Volver atrás': 'Retour',
        'Ir al catálogo': 'Aller au Catalogue',
        'Inicio': 'Accueil',
        'DISPONIBLE': 'DISPONIBLE',
        'VENDIDA': 'VENDUE',
        'ALQUILADA': 'LOUÉE',
        'Solicitar visita': 'Demander Visite',
        'Cancelar solicitud': 'Annuler Demande',
        'Solicitar visita para esta propiedad': 'Demander une Visite pour cette Propriété',
        'Ubicación aproximada': 'Emplacement Approximatif',
        'Mapa de referencia': 'Carte de Référence',
        'Precio de venta': 'Prix de Vente',
        'Dorm.': 'Chamb.',
        'Baños': 'SDB',
        'm²': 'm²',
        'Tipo': 'Type',
        'Energía': 'Énergie',
        'Garaje': 'Garage',
        'Descripción': 'Description',
        'Contactar agente': 'Contacter Agent',
        'Agente': 'Agent',
        'Contactar ahora': 'Contacter Maintenant',
        'Contactar al agente': 'Contacter l\'Agent',
        'Cerrar ventana de contacto': 'Fermer Fenêtre de Contact',
        'Ej: Juan Pérez': 'Ex: Jean Dupont',
        'ejemplo@email.com': 'exemple@email.com',
        'Me interesa la propiedad': 'Je suis intéressé par la propriété',
        'y quisiera más información.': 'et je voudrais plus d\'informations.',
        'Cancelar': 'Annuler',
        'Enviar mensaje': 'Envoyer Message',
        'Mensaje enviado (funcionalidad por implementar)': 'Message envoyé (fonctionnalité à implémenter)',
        
        // Tipos de propiedad
        'Casa': 'Maison',
        'Apto': 'Appt',
        'Terr': 'Terra',
        'Com.': 'Comm.'
      }
    };
    
    return translations[lang]?.[text] || text;
  };


  // Escuchar cambios de idioma
useEffect(() => {
  const fetchProperty = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await propertyAPI.getById(parseInt(id));
      
      if (response.success && response.data) {
        const propertyData = response.data;
        setProperty(propertyData);
        
        // TRADUCCIÓN DIRECTAMENTE AQUÍ (sin función separada)
        const currentLang = getCurrentLanguage();
        
        if (currentLang !== 'es') {
          try {
            const translatedTitleText = await translateText(propertyData.title, 'es', currentLang);
            const translatedDesc = await translateText(propertyData.description, 'es', currentLang);
            setTranslatedTitle(translatedTitleText);
            setTranslatedDescription(translatedDesc);
          } catch {
            setTranslatedTitle(propertyData.title);
            setTranslatedDescription(propertyData.description);
          }
        } else {
          setTranslatedTitle(propertyData.title);
          setTranslatedDescription(propertyData.description);
        }
      } else {
        setError(response.error || t('No se pudo cargar la propiedad'));
      }
    } catch {
      setError(t('Error de conexión con el servidor'));
    } finally {
      setLoading(false);
    }
  };

  fetchProperty();
}, [id]); 

    

  const formatPrice = (price: number) => {
    const currentLang = getCurrentLanguage();
    const locale = currentLang === 'es' ? 'es-ES' : 
                   currentLang === 'fr' ? 'fr-FR' : 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Obtener tipo de propiedad traducido
  const getTranslatedType = (type: string): string => {
    const typeMap: Record<string, string> = {
      'house': t('Casa'),
      'apartment': t('Apto'),
      'land': t('Terr'),
      'commercial': t('Com.'),
      'chalet': t('Casa'),
      'penthouse': t('Apto'),
      'office': t('Com.')
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-20 px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-6 text-gray-700 font-medium">{t('Cargando información de la propiedad...')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto py-16 px-4 text-center">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-red-500 text-5xl mb-6">⚠</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('No se pudo cargar la propiedad')}</h1>
            <p className="text-gray-600 mb-8">{error || t('La propiedad solicitada no existe o no está disponible.')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {t('Volver atrás')}
              </button>
              <Link 
                to="/" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
              >
                {t('Ir al catálogo')}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Navegación y acciones */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <nav className="flex items-center text-sm text-gray-600">
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">{t('Inicio')}</Link>
              <span className="mx-3">/</span>
              <span className="text-gray-500">{t('Propiedad')} #{property.serial}</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{translatedTitle}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              property.status === 'available' 
                ? 'bg-green-100 text-green-800' 
                : property.status === 'sold'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {property.status === 'available' ? t('DISPONIBLE') : 
               property.status === 'sold' ? t('VENDIDA') : t('ALQUILADA')}
            </span>
            <button
              type="button"
              onClick={() => setShowVisitForm(!showVisitForm)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {showVisitForm ? t('Cancelar solicitud') : t('Solicitar visita')}
            </button>
          </div>
        </div>

        {/* Formulario de visita */}
        {showVisitForm && (
          <div className="mb-10">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('Solicitar visita para esta propiedad')}</h2>
              <NewVisitForm 
                propertyId={property.serial} 
                propertyTitle={translatedTitle}
                onClose={() => setShowVisitForm(false)}
                onSuccess={() => {
                  setShowVisitForm(false);
                }}
              />
            </div>
          </div>
        )}

        {/* LAYOUT 3 FILAS x 2 COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-6">
            {/* FILA 1: Galería */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <PropertyGallery 
                images={property.images || []} 
                propertyTitle={translatedTitle}
              />
            </div>
            
            {/* FILA 2: Mapa */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center mb-3">
                <MapPinIcon className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-bold text-gray-900">{t('Ubicación aproximada')}</h3>
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 text-3xl mb-2">🗺️</div>
                  <p className="text-sm text-gray-600">Zona {property.city}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('Mapa de referencia')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-6">
            {/* FILA 1: Precio + Características + Descripción */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              {/* Precio */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900">{formatPrice(property.price)}</div>
                <div className="text-gray-600 text-xs">{t('Precio de venta')}</div>
              </div>
              
              {/* Características */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2">
                  <div className="text-sm font-semibold text-gray-900">{property.bedrooms || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{t('Dorm.')}</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-sm font-semibold text-gray-900">{property.bathrooms || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{t('Baños')}</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-sm font-semibold text-gray-900">{property.area}</div>
                  <div className="text-xs text-gray-500">{t('m²')}</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-sm font-semibold text-gray-900">
                    {getTranslatedType(property.type)}
                  </div>
                  <div className="text-xs text-gray-500">{t('Tipo')}</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-sm font-semibold text-gray-900">A</div>
                  <div className="text-xs text-gray-500">{t('Energía')}</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-sm font-semibold text-gray-900">2</div>
                  <div className="text-xs text-gray-500">{t('Garaje')}</div>
                </div>
              </div>
              
              {/* Descripción */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-gray-900 mb-2">{t('Descripción')}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {translatedDescription}
                </p>
              </div>
            </div>
            
            {/* FILA 2: Contacto */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">{t('Contactar agente')}</h3>
              
              <div className="flex items-center mb-3">
                <UserCircleIcon className="w-8 h-8 text-gray-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-gray-900">María González</div>
                  <div className="text-xs text-gray-500">{t('Agente')}</div>
                </div>
              </div>
              
              <div className="space-y-1 text-xs mb-4">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="h-3 w-3 mr-1 text-gray-500" />
                  <span>mgonzalez@inmobiliaria.com</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-3 w-3 mr-1 text-gray-500" />
                  <span>+34 600 123 456</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                {t('Contactar ahora')}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de contacto */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t('Contactar al agente')}</h3>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={t('Cerrar ventana de contacto')}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              alert(t('Mensaje enviado (funcionalidad por implementar)'));
              setShowContactModal(false);
            }}>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('Ej: Juan Pérez')}
                  required
                />
              </div>
              
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('ejemplo@email.com')}
                  required
                />
              </div>
              
              <div className="relative">
                <DevicePhoneMobileIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+34 600 000 000"
                />
              </div>
              
              <div className="relative">
                <ChatBubbleBottomCenterTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`${t('Me interesa la propiedad')} "${translatedTitle}"...`}
                  defaultValue={`${t('Me interesa la propiedad')} "${translatedTitle}" (${formatPrice(property.price)}) ${t('y quisiera más información.')}`}
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  {t('Cancelar')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {t('Enviar mensaje')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetail;