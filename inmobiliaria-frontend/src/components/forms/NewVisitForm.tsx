import { useState } from 'react';
import { visitAPI } from '../../services/api';

interface NewVisitFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  propertyId?: number;
  propertyTitle?: string;
}

interface Notification {
  type: 'success' | 'error' | null;
  message: string;
}

const NewVisitForm = ({ onClose, onSuccess, propertyId, propertyTitle }: NewVisitFormProps) => {
  const [formData, setFormData] = useState({
    name: '',         
    email: '',          
    phone: '',          
    visit_date: '',
    visit_time: '10:00',
    message: ''         
  });

  const [notification, setNotification] = useState<Notification>({ 
    type: null, 
    message: '' 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función de traducción offline
  const t = (text: string): string => {
    const lang = localStorage.getItem('appLanguage') || 'es';
    
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'Solicitar visita': 'Request Visit',
        'Solicitar visita para:': 'Request Visit for:',
        'Nombre completo *': 'Full Name *',
        'Nombre completo del cliente': 'Client Full Name',
        'Teléfono *': 'Phone *',
        'Número de teléfono del cliente': 'Client Phone Number',
        'Email *': 'Email *',
        'Correo electrónico del cliente': 'Client Email',
        'Fecha *': 'Date *',
        'Fecha de la visita': 'Visit Date',
        'Hora *': 'Time *',
        'Hora de la visita': 'Visit Time',
        'Notas adicionales': 'Additional Notes',
        'Notas adicionales sobre la visita': 'Additional Visit Notes',
        'Cancelar': 'Cancel',
        'Cerrar': 'Close',
        '09:00': '09:00',
        '10:00': '10:00',
        '11:00': '11:00',
        '12:00': '12:00',
        '16:00': '16:00',
        '17:00': '17:00',
        'Error: No se encontro la propiedad': 'Error: Property not found',
        'Solicitud enviada correctamente. Te contactaremos pronto.': 'Request sent successfully. We will contact you soon.',
        'No se pudo crear la visita': 'Could not create visit',
        'Error desconocido al crear la visita': 'Unknown error creating visit',
        'Enviando...': 'Sending...'
      },
      'fr': {
        'Solicitar visita': 'Demander Visite',
        'Solicitar visita para:': 'Demander Visite pour:',
        'Nombre completo *': 'Nom Complet *',
        'Nombre completo del cliente': 'Nom Complet du Client',
        'Teléfono *': 'Téléphone *',
        'Número de teléfono del cliente': 'Numéro de Téléphone du Client',
        'Email *': 'Email *',
        'Correo electrónico del cliente': 'Email du Client',
        'Fecha *': 'Date *',
        'Fecha de la visita': 'Date de la Visite',
        'Hora *': 'Heure *',
        'Hora de la visita': 'Heure de la Visite',
        'Notas adicionales': 'Notes Supplémentaires',
        'Notas adicionales sobre la visita': 'Notes Supplémentaires sur la Visite',
        'Cancelar': 'Annuler',
        'Cerrar': 'Fermer',
        '09:00': '09:00',
        '10:00': '10:00',
        '11:00': '11:00',
        '12:00': '12:00',
        '16:00': '16:00',
        '17:00': '17:00',
        'Error: No se encontro la propiedad': 'Erreur: Propriété non trouvée',
        'Solicitud enviada correctamente. Te contactaremos pronto.': 'Demande envoyée avec succès. Nous vous contacterons bientôt.',
        'No se pudo crear la visita': 'Impossible de créer la visite',
        'Error desconocido al crear la visita': 'Erreur inconnue lors de la création de la visite',
        'Enviando...': 'Envoi en cours...'
      }
    };
    
    return translations[lang]?.[text] || text;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyId) {
      setNotification({
        type: 'error',
        message: t('Error: No se encontro la propiedad')
      });
      return;
    }
    
    setIsSubmitting(true);
    setNotification({ type: null, message: '' });
    
    try {
      const visitDateTime = `${formData.visit_date}T${formData.visit_time}:00`;
      
      const visitData = {
        property_serial: propertyId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        visit_date: visitDateTime,
        message: formData.message
      };

      console.log('Enviando visita:', visitData);
      
      const response = await visitAPI.create(visitData);
      
      if (response.success) {
        console.log('Visita creada:', response.data);
        
        // 1. Mostrar notificación de éxito
        setNotification({
          type: 'success',
          message: t('Solicitud enviada correctamente. Te contactaremos pronto.')
        });
        
        // 2. Deshabilitar el formulario
        setIsSubmitting(true); // Mantener como true para deshabilitar
        
        // 3. NO cerrar automáticamente
        // El usuario verá el mensaje y cerrará manualmente
        
      } else {
        console.error('Error en la respuesta:', response.error);
        setNotification({
          type: 'error',
          message: `${t('Error:')} ${response.error || t('No se pudo crear la visita')}`
        });
        setIsSubmitting(false);
      }
      
    } catch (error: unknown) {
      console.error('Error al crear visita:', error);
      
      if (error instanceof Error) {
        setNotification({
          type: 'error',
          message: `${t('Error:')} ${error.message}`
        });
      } else {
        setNotification({
          type: 'error',
          message: t('Error desconocido al crear la visita')
        });
      }
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    if (notification.type === 'success' && onSuccess) {
      onSuccess();
    }
    onClose();
  };

  const handleCancel = () => {
    setNotification({ type: null, message: '' });
    onClose();
  };

  return (
    <div className="p-1">
      {/* TÍTULO TRADUCIDO */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {propertyTitle ? `${t('Solicitar visita para:')} ${propertyTitle}` : t('Solicitar visita')}
      </h3>

      {/* NOTIFICACIÓN - VISIBLE CUANDO HAY MENSAJE */}
      {notification.type && (
        <div className={`mb-4 p-4 rounded-lg border ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <span className="mr-2 mt-0.5 text-lg">
                {notification.type === 'success' ? '✓' : '✗'}
              </span>
              <div>
                <p className="font-medium">
                  {notification.type === 'success' 
                    ? t('Solicitud enviada') 
                    : t('Error')}
                </p>
                <p className="mt-1">{notification.message}</p>
              </div>
            </div>
            
            {notification.type === 'success' && (
              <button
                type="button"
                onClick={handleCloseNotification}
                className="text-green-600 hover:text-green-800 font-medium px-3 py-1 rounded hover:bg-green-100"
              >
                {t('Cerrar')}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* FORMULARIO - DESHABILITADO SI ES ÉXITO */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('Nombre completo *')}
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting && notification.type === 'success'}
              aria-label={t('Nombre completo del cliente')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('Teléfono *')}
            </label>
            <input
              type="tel"
              required
              disabled={isSubmitting && notification.type === 'success'}
              aria-label={t('Número de teléfono del cliente')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Email *')}
          </label>
          <input
            type="email"
            required
            disabled={isSubmitting && notification.type === 'success'}
            aria-label={t('Correo electrónico del cliente')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('Fecha *')}
            </label>
            <input
              type="date"
              required
              disabled={isSubmitting && notification.type === 'success'}
              aria-label={t('Fecha de la visita')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.visit_date}
              onChange={(e) => setFormData({...formData, visit_date: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('Hora *')}
            </label>
            <select
              disabled={isSubmitting && notification.type === 'success'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.visit_time}
              onChange={(e) => setFormData({...formData, visit_time: e.target.value})}
              aria-label={t('Hora de la visita')}
            >
              <option value="09:00">{t('09:00')}</option>
              <option value="10:00">{t('10:00')}</option>
              <option value="11:00">{t('11:00')}</option>
              <option value="12:00">{t('12:00')}</option>
              <option value="16:00">{t('16:00')}</option>
              <option value="17:00">{t('17:00')}</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Notas adicionales')}
          </label>
          <textarea
            rows={3}
            disabled={isSubmitting && notification.type === 'success'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            aria-label={t('Notas adicionales sobre la visita')}
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {t('Cancelar')}
          </button>
          
          {notification.type !== 'success' ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('Enviando...') : t('Solicitar visita')}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCloseNotification}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {t('Cerrar')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NewVisitForm;