import React, { useState, useEffect } from 'react';
import { clientAPI, type Cliente } from '../../services/api';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cliente: Cliente;
}

const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  cliente
}) => {
  const [formData, setFormData] = useState({
    name: cliente.name,
    email: cliente.email,
    phone: cliente.phone || '',
    type: cliente.type as 'buyer' | 'seller' | 'tenant' | 'landlord'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actualizar formData cuando cambia el cliente
  useEffect(() => {
    setFormData({
      name: cliente.name,
      email: cliente.email,
      phone: cliente.phone || '',
      type: cliente.type as 'buyer' | 'seller' | 'tenant' | 'landlord'
    });
    setError(null);
  }, [cliente]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Nombre y email son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await clientAPI.update(cliente.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        type: formData.type
      });

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.error || 'Error al actualizar cliente');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error updating client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Editar Cliente</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: María González"
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="cliente@email.com"
                disabled={loading}
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 612345678"
                disabled={loading}
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de cliente
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                aria-label="Tipo de cliente"
              >
                <option value="buyer">Comprador</option>
                <option value="seller">Vendedor</option>
                <option value="tenant">Inquilino</option>
                <option value="landlord">Propietario</option>
              </select>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;