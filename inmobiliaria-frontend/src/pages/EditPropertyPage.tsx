import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropertyForm from '../components/admin/PropertyForm';
import { propertyAPI } from '../services/api';

const EditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propertyExists, setPropertyExists] = useState(false);

  useEffect(() => {
    const checkPropertyExists = async () => {
      if (!id) {
        setError('ID de propiedad no proporcionado');
        setLoading(false);
        return;
      }

      try {
        const propertyId = parseInt(id, 10);
        if (isNaN(propertyId)) {
          setError('ID de propiedad inválido');
          setLoading(false);
          return;
        }

        const response = await propertyAPI.getById(propertyId);
        if (response.success) {
          setPropertyExists(true);
        } else {
          setError('Propiedad no encontrada');
        }
      } catch (err) {
        setError('Error al verificar la propiedad');
        console.error('Error checking property:', err);
      } finally {
        setLoading(false);
      }
    };

    checkPropertyExists();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Volver al panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al panel
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Editar Propiedad</h1>
          <p className="text-gray-600 mt-2">Modifica los datos de la propiedad</p>
        </div>

        {propertyExists && id && (
          <PropertyForm
            propertyId={parseInt(id, 10)}
            onSuccess={() => {
              setTimeout(() => {
                navigate('/admin');
              }, 1500);
            }}
            onCancel={() => navigate('/admin')}
          />
        )}
      </div>
    </div>
  );
};

export default EditPropertyPage;