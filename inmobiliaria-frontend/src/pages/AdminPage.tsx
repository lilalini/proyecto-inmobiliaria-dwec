import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/admin/PropertyForm';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'properties' | 'visits' | 'users'>('properties');
  const [formExpanded, setFormExpanded] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handlePropertyCreated = () => {
    setFormExpanded(false);
    // Aquí podrías actualizar estadísticas o lista de propiedades
    console.log('Propiedad creada exitosamente');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Admin */}
      <Header />
      
      {/* Header elegante del panel */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Panel de Control</h1>
                <p className="text-blue-200 text-sm mt-0.5">Gestión centralizada del sistema</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-white/20 shadow-sm">
                <div className="text-xs font-medium flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Administrador
                </div>
                <div className="text-gray-300 text-[10px] mt-0.5">Sesión activa</div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white text-gray-800 px-3.5 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 text-sm shadow-sm hover:shadow-md active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación mejorados */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-6 py-3.5 font-medium text-sm transition-all duration-200 relative flex items-center gap-2 ${
                activeTab === 'properties'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Propiedades
              {activeTab === 'properties' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('visits')}
              className={`px-6 py-3.5 font-medium text-sm transition-all duration-200 relative flex items-center gap-2 ${
                activeTab === 'visits'
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Visitas
              {activeTab === 'visits' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600"></span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3.5 font-medium text-sm transition-all duration-200 relative flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Usuarios
              {activeTab === 'users' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'properties' ? (
          <div className="space-y-6">
            {/* Estadísticas mejoradas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Total</p>
                    <div className="text-2xl font-bold text-gray-800 mt-1">15</div>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Propiedades en sistema</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Disponibles</p>
                    <div className="text-2xl font-bold text-gray-800 mt-1">12</div>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Listas para publicar</div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Destacadas</p>
                    <div className="text-2xl font-bold text-gray-800 mt-1">3</div>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Propiedades premium</div>
              </div>
            </div>

            {/* Formulario colapsable */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div 
                className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
                onClick={() => setFormExpanded(!formExpanded)}
              >
                <div className="flex items-center gap-3">
                  <div className={`transform transition-transform duration-200 ${formExpanded ? 'rotate-90' : ''}`}>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Agregar nueva propiedad</h3>
                    <p className="text-xs text-gray-500">Completa los datos para publicar en el portal</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${formExpanded ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
                  {formExpanded ? 'Ocultar formulario' : 'Expandir formulario'}
                </span>
              </div>
              
              {formExpanded && (
                <div className="p-5">
                  <PropertyForm 
                    onSuccess={handlePropertyCreated}
                  />
                </div>
              )}
            </div>

            {/* Lista de propiedades existentes */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Propiedades existentes</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualizar lista
                </button>
              </div>
              <div className="text-center py-8 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-sm">Lista de propiedades se cargará aquí próximamente</p>
                <p className="text-xs mt-1">Funcionalidad de editar/eliminar en desarrollo</p>
              </div>
            </div>
          </div>
        ) : activeTab === 'visits' ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Gestión de Visitas</h2>
            <p className="text-gray-600 mb-4">Calendario y gestión de visitas programadas</p>
            <div className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
              Próximamente
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Gestión de Usuarios</h2>
            <p className="text-gray-600 mb-4">Administración de usuarios y agentes</p>
            <div className="inline-block px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
              Próximamente
            </div>
          </div>
        )}
      </main>

      {/* Footer Admin mejorado */}
      <Footer />
      <div className="border-t border-gray-200 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <p className="text-gray-500 text-sm">
              Panel de administración • Sistema inmobiliario v2.0 • {new Date().getFullYear()}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Última actualización: hoy
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sistema estable
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;