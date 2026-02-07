// VERSIÓN SIMPLIFICADA SIN LOADING STATE
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropertyForm from '../components/admin/PropertyForm';


const PropertyEditPage: React.FC = () => {
  const { serial } = useParams<{ serial: string }>();
  const navigate = useNavigate();

  // Verificar autenticación inmediatamente
  const token = localStorage.getItem('authToken');
  if (!token) {
    navigate('/login');
    return null; // O un componente de redirección
  }

  if (!serial) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Error: No se especificó ID de propiedad</p>
          <button
            onClick={() => navigate('/admin')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Volver al panel
          </button>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    alert('Propiedad actualizada correctamente');
    navigate('/admin');
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2.5 rounded-xl shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Editar Propiedad</h1>
                <p className="text-amber-200 text-sm mt-0.5">ID: {serial}</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Volver al panel
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <PropertyForm
          propertyId={parseInt(serial)}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
};

export default PropertyEditPage;