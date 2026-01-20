import { useState } from 'react';

interface NewVisitFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  propertyId?: number;
  propertyTitle?: string;
}

const NewVisitForm = ({ onClose, onSuccess, propertyId, propertyTitle }: NewVisitFormProps) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    visit_date: '',
    visit_time: '10:00',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica temporal - luego conectarás con apiService
    console.log('Datos de visita:', { propertyId, ...formData });
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="p-1">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Solicitar visita {propertyTitle && `para: ${propertyTitle}`}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              required
              aria-label="Nombre completo del cliente"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.client_name}
              onChange={(e) => setFormData({...formData, client_name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              required
              aria-label="Número de teléfono del cliente"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.client_phone}
              onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            aria-label="Correo electrónico del cliente"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.client_email}
            onChange={(e) => setFormData({...formData, client_email: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha *
            </label>
            <input
              type="date"
              required
              aria-label="Fecha de la visita"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.visit_date}
              onChange={(e) => setFormData({...formData, visit_date: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.visit_time}
              onChange={(e) => setFormData({...formData, visit_time: e.target.value})}
              aria-label="Hora de la visita"
            >
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas adicionales
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            aria-label="Notas adicionales sobre la visita"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Solicitar visita
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewVisitForm;