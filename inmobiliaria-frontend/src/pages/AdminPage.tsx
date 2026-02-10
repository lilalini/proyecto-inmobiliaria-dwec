import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import PropertyForm from '../components/admin/PropertyForm';
import PropertyList from '../components/admin/PropertyList';
import VisitList from '../components/admin/VisitList';
import Footer from '../components/common/Footer';
import { propertyAPI, visitAPI } from '../services/api';
import type { Property, Visit } from '../services/api';
import StatsCard from '../components/admin/StatsCard';
import { BuildingIcon, CalendarIcon, CheckIcon, StarIcon } from '../components/common/Icons';
import VisualCalendar from '../components/visits/VisualCalendar';
import ClientesTable from '../components/admin/ClientesTable';
import NewClientModal from '../components/admin/NewClientModal';
import ReportsPage from '../pages/ReportsPage';
  const AdminPage: React.FC = () => {

  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [refreshClientsKey, setRefreshClientsKey] = useState(0);

  // 3. FUNCIÓN PARA REFRESCAR CLIENTES (después de otros fetch functions)
  const refreshClientes = () => {
    setRefreshClientsKey(prev => prev + 1); // Forza re-render de ClientesTable
  };

  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener datos del usuario desde localStorage
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState({ properties: true, visits: true });
  const [formExpanded, setFormExpanded] = useState(false);

  // Determinar la vista activa basada en la URL
  const getActiveView = useCallback(() => {
  if (location.pathname.includes('/admin/visits')) return 'visits';
  if (location.pathname.includes('/admin/calendar')) return 'calendar';
  if (location.pathname.includes('/admin/clients')) return 'clients';
  if (location.pathname.includes('/admin/reports')) return 'reports';
  if (location.pathname.includes('/admin/properties')) return 'properties';
  return 'dashboard';
}, [location.pathname]);

  const [activeView, setActiveView] = useState(getActiveView());

  // Actualizar vista activa cuando cambia la URL
  useEffect(() => {
    setActiveView(getActiveView());
  }, [getActiveView]);

  // Cargar datos del usuario
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedName) setUserName(storedName);
    if (storedRole) setUserRole(storedRole);

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Cargar propiedades
  const fetchProperties = async () => {
    setLoading(prev => ({ ...prev, properties: true }));
    try {
      const response = await propertyAPI.getAll();
      if (response.success) {
        setProperties(response.data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(prev => ({ ...prev, properties: false }));
    }
  };

  // Cargar visitas
  const fetchVisits = async () => {
    setLoading(prev => ({ ...prev, visits: true }));
    try {
      const response = await visitAPI.getAll();
      if (response.success) {
        setVisits(response.data);
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(prev => ({ ...prev, visits: false }));
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchProperties();
    fetchVisits();
  }, []);

  // Manejar creación de propiedad
  const handlePropertyCreated = () => {
    setFormExpanded(false);
    fetchProperties();
  };

// Calcular estadísticas
const availableCount = properties.filter(p => p.status === 'available').length;
const featuredCount = properties.filter(p => p.featured).length;
const scheduledVisits = visits.filter(v => v.status === 'scheduled').length;

// Calcular visitas de esta semana 
const visitsThisWeek = visits.filter(v => {
  try {
    const visitDate = new Date(v.visit_date);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return visitDate >= oneWeekAgo && v.status === 'scheduled';
  } catch (error) {
    console.error('Error parsing date:', v.visit_date, error);
    return false;
  }
}).length;

// Calcular visitas de hoy
const visitsToday = visits.filter(v => {
  try {
    const visitDate = new Date(v.visit_date);
    const today = new Date();
    return visitDate.toDateString() === today.toDateString() && v.status === 'scheduled';
  } catch (error) {
    console.error('Error parsing date for today:', v.visit_date, error);
    return false;
  }
}).length;

// DEBUG: Verificar datos
/*console.log('=== ESTADÍSTICAS DEBUG ===');
console.log('Total visitas:', visits.length);
console.log('Scheduled visits:', scheduledVisits);
console.log('Visitas esta semana:', visitsThisWeek);
console.log('Visitas hoy:', visitsToday);
visits.forEach((v, i) => {
  console.log(`Visita ${i}:`, {
    id: v.id,
    status: v.status,
    date: v.visit_date,
    isScheduled: v.status === 'scheduled'
  });
});*/

  //const today = new Date().toISOString().split('T')[0];
  //const visitsToday = visits.filter(v => v.visit_date.includes(today)).length;


  // Renderizar contenido basado en la vista activa
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Estadísticas del dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="Propiedades totales"
                value={properties.length}
                description={`${availableCount} disponibles`}
                icon={<BuildingIcon size="lg" />}
                color="blue"
              />
              <StatsCard
                title="Visitas programadas"
                value={loading.visits ? '...' : scheduledVisits}
                description={
                  loading.visits ? 'Cargando...' : 
                  `${visitsThisWeek} esta semana • ${visitsToday} hoy`
                }
                icon={<CalendarIcon size="lg" />}
                color="purple"
              />

              <StatsCard
                title="Destacadas"
                value={featuredCount}
                description="Premium selection"
                icon={<StarIcon size="lg" />}
                color="amber"
              />

              <StatsCard
                title="Tasa de disponibilidad"
                value={
                  properties.length > 0 
                    ? `${Math.round((availableCount / properties.length) * 100)}%`
                    : '0%'
                }
                description="Del portfolio total"
                icon={<CheckIcon size="lg" />}
                color="green"
              />
            </div>

            {/* Sección de propiedades */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Gestión de Propiedades</h2>
                  <p className="text-gray-600">Administra todas las propiedades del sistema</p>
                </div>
                <button
                  onClick={() => setFormExpanded(!formExpanded)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  {formExpanded ? 'Cancelar' : 'Nueva Propiedad'}
                </button>
              </div>

              {formExpanded && (
                <div className="mb-8">
                  <PropertyForm onSuccess={handlePropertyCreated} />
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Propiedades recientes</h3>
                {loading.properties ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Cargando propiedades...</p>
                  </div>
                ) : (
                  <PropertyList
                    properties={properties.slice(0, 5)}
                    onEdit={(property) => navigate(`/admin/propiedad/editar/${property.serial}`)}
                    onDelete={(serial) => {
                      if (window.confirm('¿Eliminar esta propiedad?')) {
                        console.log('Eliminar:', serial);
                        fetchProperties();
                      }
                    }}
                  />
                )}
              </div>
            </div>

            {/* Sección de visitas recientes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Visitas Recientes</h2>
                  <p className="text-gray-600">Últimas visitas solicitadas</p>
                </div>
                <button
                  onClick={() => navigate('/admin/visits')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Ver todas
                </button>
              </div>

              {loading.visits ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Cargando visitas...</p>
                </div>
              ) : visits.length > 0 ? (
                <VisitList
                  visits={visits.slice(0, 5)}
                  onRefresh={fetchVisits}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay visitas programadas
                </div>
              )}
            </div>
          </div>
        );

      case 'properties':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Todas las Propiedades</h2>
                  <p className="text-gray-600">Gestión completa del catálogo de propiedades</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormExpanded(!formExpanded)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {formExpanded ? 'Cancelar' : 'Nueva Propiedad'}
                  </button>
                  <button
                    onClick={fetchProperties}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Actualizar
                  </button>
                </div>
              </div>

              {formExpanded && (
                <div className="mb-8">
                  <PropertyForm onSuccess={handlePropertyCreated} />
                </div>
              )}

              {loading.properties ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Cargando propiedades...</p>
                </div>
              ) : (
                <PropertyList
                  properties={properties}
                  onEdit={(property) => navigate(`/admin/propiedad/editar/${property.serial}`)}
                  onDelete={(serial) => {
                    if (window.confirm('¿Eliminar esta propiedad?')) {
                      console.log('Eliminar:', serial);
                      fetchProperties();
                    }
                  }}
                />
              )}
            </div>
          </div>
        );

      case 'visits':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              {loading.visits ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Cargando visitas...</p>
                </div>
              ) : (
                <VisitList
                  visits={visits}
                  onRefresh={fetchVisits}
                />
              )}
            </div>
          </div>
        );
// Vistas de calendario, usuarios y reportes pueden ser añadidas aquí
       case 'calendar':
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"> {/* Quitamos el padding interno general */}
        {/* Encabezado del calendario */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Calendario de Visitas</h2>
              <p className="text-gray-600">Vista interactiva de todas las visitas programadas</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>
        </div>
        
        {/* CONTENEDOR PRINCIPAL DEL CALENDARIO - SIN PADDING, CON ALTURA FIJA */}
        <div className="p-0"> {/* Padding 0 para que el calendario respire */}
          <div className="h-[70vh] min-h-[500px]"> {/* Altura grande y responsiva */}
            <VisualCalendar />
          </div>
        </div>
      </div>
    </div>
  );

  
case 'clients':
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Gestión de Clientes</h2>
            <p className="text-gray-600">Administra clientes registrados (online y oficina)</p>
          </div>
          <button
            onClick={() => setShowNewClientModal(true)}  // ← Botón funcional
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Cliente
          </button>
        </div>
        
        {/* Tabla de clientes con capacidad de refresh */}
        <ClientesTable 
          key={refreshClientsKey}  // ← Fuerza re-render al cambiar
          onRefresh={refreshClientes}
        />
      </div>

      {/* Modal para nuevo cliente */}
      <NewClientModal
        isOpen={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        onSuccess={() => {
          refreshClientes();  // ← Refresca tabla después de crear
          setShowNewClientModal(false);
        }}
      />
    </div>
  );

case 'reports':
  return <ReportsPage />;
      default:
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Sección en desarrollo</h2>
            <p className="text-gray-600 mb-6">Esta funcionalidad estará disponible próximamente.</p>
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Volver al Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Sidebar */}
      <AdminSidebar userName={userName} userRole={userRole} />
      
      {/* Contenido principal con margen para sidebar */}
      <div className="ml-64">
        {/* Header */}
        <AdminHeader 
          title={activeView === 'dashboard' ? 'Dashboard Principal' : 
                activeView === 'properties' ? 'Gestión de Propiedades' :
                activeView === 'visits' ? 'Gestión de Visitas' :
                'Panel de Administración'}
         /* subtitle={activeView === 'dashboard' ? 'Vista general del sistema' :
                   activeView === 'properties' ? 'Administra el catálogo completo' :
                   activeView === 'visits' ? 'Control de visitas programadas' :
                   'Gestión centralizada'}*/
        />

        {/* Contenido */}
        <main className="p-8">
          {renderContent()}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminPage;