import React from 'react';
import { Link } from 'react-router-dom';
import VisitCalendar from '../components/visits/VisitCalendar';
import Footer from '../components/common/Footer';


const CalendarPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo y nombre */}
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-lg">
                <img 
                  src="/images/logo.jpg" 
                  alt="Logo Apturist" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Calendario de Visitas</h1>
                <p className="text-blue-200">Gestiona todas las visitas programadas</p>
              </div>
            </div>
            
            {/* Navegación */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="hover:text-blue-200 transition-colors font-medium">Inicio</Link>
              <Link to="/calendario" className="hover:text-blue-200 transition-colors font-medium">Calendario</Link>
              <button className="hover:text-blue-200 transition-colors font-medium">Servicios</button>
              <Link to="/contacto" className="hover:text-blue-200 transition-colors font-medium">Contacto</Link>
              <button className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Valorar propiedad
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendario principal */}
          <div className="lg:col-span-2">
            <VisitCalendar />
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Visitas esta semana:</span>
                  <span className="font-bold text-blue-700">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Visitas hoy:</span>
                  <span className="font-bold text-green-700">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tasa de cancelación:</span>
                  <span className="font-bold text-red-700">10%</span>
                </div>
              </div>
            </div>

            {/* Próximas visitas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Próximas visitas</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-medium text-gray-800">Ático de lujo</p>
                  <p className="text-sm text-gray-600">Hoy, 16:00</p>
                  <p className="text-sm text-gray-500">María González</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-medium text-gray-800">Piso reformado</p>
                  <p className="text-sm text-gray-600">Mañana, 11:00</p>
                  <p className="text-sm text-gray-500">Carlos Ruiz</p>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones rápidas</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Nueva visita
                </button>
                <button className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  Exportar calendario
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Ver reporte mensual
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CalendarPage;