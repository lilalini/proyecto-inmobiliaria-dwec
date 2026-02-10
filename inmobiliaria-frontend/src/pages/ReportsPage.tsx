// frontend/src/pages/ReportsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,  Sector
} from 'recharts';
import { reportAPI, type ReportDashboard, type ReportVisitas, type ReportClientes, type ReportPropiedades } from '../services/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// Importar iconos profesionales de tu sistema
import { ReportIcon, DownloadIcon, RefreshIcon, BuildingIcon, CalendarIcon, UserIcon, HomeIcon } from '../components/common/Icons';
import StatsCard from '../components/admin/StatsCard';

// ========== TIPOS PARA LOS GRÁFICOS ==========
interface VisitChartData {
  mes: string;
  visitas: number;
}

interface ClientChartData {
  name: string;
  value: number;
  porcentaje: number;
}

// Colores para gráficos
const COLORS = [
  '#3B82F6', // Azul brillante
  '#10B981', // Verde esmeralda  
  '#8B5CF6', // Violeta
  '#F59E0B', // Ámbar
  '#EF4444', // Rojo coral
  '#06B6D4', // Cian
];

  const ReportsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reportType, setReportType] = useState('dashboard');
    const initialStartDate = startOfMonth(subMonths(new Date(), 6));
    const initialEndDate = endOfMonth(new Date());
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    initialStartDate,
    initialEndDate
  ]);
  const [startDate, endDate] = dateRange;
  
  // Estados con los tipos exactos de tu API
  const [dashboardData, setDashboardData] = useState<ReportDashboard | null>(null);
  const [visitStats, setVisitStats] = useState<ReportVisitas | null>(null);
  const [clientStats, setClientStats] = useState<ReportClientes | null>(null);
  const [propertyStats, setPropertyStats] = useState<ReportPropiedades | null>(null);

  type PieDataItem = {
  name: string;
  value: number;
  porcentaje: number;
};

   const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportAPI.dashboard();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.error || 'Error al cargar reportes');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error cargando reportes:', err);
    } finally {
      setLoading(false);
    }
  }, []); 

  const loadVisitStats = useCallback(async () => {
    if (!startDate || !endDate) return;
    try {
      const response = await reportAPI.visits(
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      );
      if (response.success) {
        setVisitStats(response.data);
      }
    } catch (err) {
      console.error('Error cargando estadísticas de visitas:', err);
    }
  }, [startDate, endDate]); // Depende de las fechas

  const loadClientStats = useCallback(async () => {
    try {
      const response = await reportAPI.clients();
      if (response.success) {
        setClientStats(response.data);
      }
    } catch (err) {
      console.error('Error cargando estadísticas de clientes:', err);
    }
  }, []); // Sin dependencias

  const loadPropertyStats = useCallback(async () => {
    try {
      const response = await reportAPI.properties();
      if (response.success) {
        setPropertyStats(response.data);
      }
    } catch (err) {
      console.error('Error cargando estadísticas de propiedades:', err);
    }
  }, []); // Sin dependencias

//=======================================================================

const handleExport = () => {
  let content = '';
  let filename = '';
  
  switch (reportType) {
    case 'visits':
      if (!visitStats?.por_mes || visitStats.por_mes.length === 0) {
        alert('No hay datos de visitas para exportar');
        return;
      }
      content = visitStats.por_mes.map(item => 
        `${item.mes},${item.visitas_mes},${item.programadas || 0},${item.completadas || 0},${item.canceladas || 0}`
      ).join('\n');
      content = 'Mes,Visitas Totales,Programadas,Completadas,Canceladas\n' + content;
      filename = `visitas_${new Date().toISOString().split('T')[0]}.csv`;
      break;
      
    case 'clients':
      if (!clientStats?.por_tipo || clientStats.por_tipo.length === 0) {
        alert('No hay datos de clientes para exportar');
        return;
      }
      content = clientStats.por_tipo.map(item => {
        const tipo = item.type === 'buyer' ? 'Comprador' :
                    item.type === 'seller' ? 'Vendedor' :
                    item.type === 'tenant' ? 'Inquilino' : 'Propietario';
        return `${tipo},${item.cantidad},${item.porcentaje}%`;
      }).join('\n');
      content = 'Tipo,Cantidad,Porcentaje\n' + content;
      filename = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
      break;
      
    case 'properties':
      if (!propertyStats?.por_tipo || propertyStats.por_tipo.length === 0) {
        alert('No hay datos de propiedades para exportar');
        return;
      }
      content = propertyStats.por_tipo.map(item => 
        `${item.type},${item.cantidad},$${item.precio_promedio.toLocaleString()},$${item.precio_minimo.toLocaleString()},$${item.precio_maximo.toLocaleString()}`
      ).join('\n');
      content = 'Tipo,Cantidad,Precio Promedio,Precio Mínimo,Precio Máximo\n' + content;
      filename = `propiedades_${new Date().toISOString().split('T')[0]}.csv`;
      break;
      
    default: // dashboard
      if (!dashboardData?.metricas || dashboardData.metricas.length === 0) {
        alert('No hay datos del dashboard para exportar');
        return;
      }
      content = dashboardData.metricas.map(item => 
        `${item.label},${item.value}`
      ).join('\n');
      content = 'Métrica,Valor\n' + content;
      filename = `dashboard_${new Date().toISOString().split('T')[0]}.csv`;
  }
  
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
//============================================================================


  useEffect(() => {
    loadDashboardData();
    loadClientStats();
    loadVisitStats();
  }, [loadDashboardData, loadClientStats, loadVisitStats]); //Todas las dependencias

  const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setReportType(type);
    if (type === 'visits') loadVisitStats();
    if (type === 'clients') loadClientStats();
    if (type === 'properties') loadPropertyStats();
  };

  const prepareVisitChartData = (): VisitChartData[] => {
  console.log('DEBUG: visitStats:', visitStats);
  console.log('DEBUG: por_mes:', visitStats?.por_mes);
  console.log('DEBUG: por_mes length:', visitStats?.por_mes?.length);
  
  // Verificación segura
  if (!visitStats || !visitStats.por_mes || !Array.isArray(visitStats.por_mes)) {
    return [];
  }
  
  return visitStats.por_mes.map((item) => ({
    mes: item.mes,
    visitas: item.visitas_mes || 0
  }));
};

  const prepareClientTypeData = (): ClientChartData[] => {
    if (!clientStats?.por_tipo) return [];
    return clientStats.por_tipo.map((item) => ({
      name: item.type === 'buyer' ? 'Comprador' :
            item.type === 'seller' ? 'Vendedor' :
            item.type === 'tenant' ? 'Inquilino' : 'Propietario',
      value: item.cantidad,
      porcentaje: item.porcentaje
    }));
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'scheduled': return 'Programada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      case 'no_show': return 'No Show';
      default: return status;
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDateChange = (update: [Date | null, Date | null] | null) => {
    if (update) {
      setDateRange(update);
    } else {
      setDateRange([null, null]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshIcon className="animate-spin h-12 w-12 text-blue-600 mx-auto" size="lg" />
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error al cargar reportes</p>
        <p className="text-sm">{error}</p>
        <button 
          onClick={loadDashboardData}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm flex items-center"
        >
          <RefreshIcon className="w-4 h-4 mr-1" size="sm" />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header del reporte */}
      <div className="mb-8 flex items-center">
        <ReportIcon className="text-3xl text-gray-700 mr-3" size="lg" />
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
            <p className="text-gray-600 mt-2">Estadísticas detalladas y métricas de rendimiento</p>
        </div>
        </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Reporte
            </label>
            <select
              value={reportType}
              onChange={handleReportTypeChange}
              aria-label="Seleccionar tipo de reporte"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dashboard">Dashboard General</option>
              <option value="visits">Reporte de Visitas</option>
              <option value="clients">Reporte de Clientes</option>
              <option value="properties">Reporte de Propiedades</option>
            </select>
          </div>
          
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de fechas
            </label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              isClearable={true}
              placeholderText="Seleccionar rango"
              dateFormat="dd/MM/yyyy"
              aria-label="Seleccionar rango de fechas para el reporte"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-4 flex gap-3">
            <button 
              onClick={loadDashboardData}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
            >
              <RefreshIcon className="w-5 h-5 mr-2" />
              Actualizar
            </button>
            <button 
              onClick={handleExport}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard General */}
      {dashboardData && reportType === 'dashboard' && (
        <>
          {/* Métricas principales - CON StatsCard */}
          {dashboardData.metricas && dashboardData.metricas.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title={dashboardData.metricas[0]?.label || 'Propiedades'}
                value={dashboardData.metricas[0]?.value || 0}
                icon={<BuildingIcon size="lg" />}
                color="blue"
                trend={{ value: 12, label: 'este mes' }}
              />
              
              <StatsCard
                title={dashboardData.metricas[1]?.label || 'Clientes'}
                value={dashboardData.metricas[1]?.value || 0}
                icon={<UserIcon size="lg" />}
                color="green"
                trend={{ value: 8, label: 'este mes' }}
              />
              
              <StatsCard
                title={dashboardData.metricas[2]?.label || 'Visitas Hoy'}
                value={dashboardData.metricas[2]?.value || 0}
                icon={<CalendarIcon size="lg" />}
                color="purple"
                trend={{ value: 15, label: 'este mes' }}
              />
              
              <StatsCard
                title={dashboardData.metricas[3]?.label || 'Destacadas'}
                value={dashboardData.metricas[3]?.value || 0}
                icon={<HomeIcon size="lg" />}
                color="amber"
                trend={{ value: 5, label: 'este mes' }}
              />
            </div>
          )}

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Gráfico de visitas */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitas por Mes</h3>
              
              <div className="h-[320px] w-full">
                {visitStats && visitStats.por_mes && visitStats.por_mes.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareVisitChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} visitas`, 'Cantidad']}
                        labelFormatter={(label) => `Mes: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="visitas" name="Visitas" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    {visitStats ? 'No hay datos de visitas' : 'Cargando...'}
                  </div>
                )}
              </div>
            </div>
            {/* Gráfico de clientes */}
            <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Clientes</h3>
            
            <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
            data={prepareClientTypeData()}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => {
                const data = entry.payload as unknown as PieDataItem;
                return `${data.name}: ${data.porcentaje}%`;
            }}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            shape={(props) => {
                const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, index } = props;
                return (
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={COLORS[index % COLORS.length]}
                />
                );
            }}
            />
            <Tooltip
            formatter={(value, name, props) => {
                const payloadData = props.payload as unknown as PieDataItem;
                return [`${value} clientes (${payloadData.porcentaje}%)`, name];
            }}
                    />
                <Legend />
            </PieChart>
            </ResponsiveContainer>
        </div>
        </div>
          </div>

          {/* Tabla de visitas recientes */}
          {dashboardData.visitas_recientes && dashboardData.visitas_recientes.length > 0 && (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Visitas Recientes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Propiedad</th>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.visitas_recientes.map((visita, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900">
                          {visita.client_name || 'N/A'}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900">
                          {visita.property_title || 'N/A'}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-base text-gray-500">
                          {visita.visit_date ? new Date(visita.visit_date).toLocaleDateString('es-ES') : 'N/A'}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <span className={`px-3 py-2 text-sm font-medium rounded-full ${getStatusClass(visita.status)}`}>
                            {getStatusText(visita.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Reporte específico de visitas */}
      {reportType === 'visits' && visitStats && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reporte Detallado de Visitas</h2>
          
          {/* Resumen */}
          {visitStats.resumen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                title="Total Visitas"
                value={visitStats.total_registros}
                icon={<CalendarIcon size="lg" />}
                color="blue"
              />
              
              <StatsCard
                title="Promedio por Mes"
                value={
                  visitStats.por_mes.length > 0 
                    ? (visitStats.total_registros / visitStats.por_mes.length).toFixed(1)
                    : '0'
                }
                icon={<CalendarIcon size="lg" />}
                color="green"
              />
              
              <StatsCard
                title="Período Analizado"
                value={`${visitStats.por_mes.length} meses`}
                icon={<CalendarIcon size="lg" />}
                color="purple"
              />
            </div>
          )}

          {/* Tabla detallada */}
          {visitStats.por_mes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Visitas por Mes</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Visitas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programadas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completadas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canceladas</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {visitStats.por_mes.map((mes, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{mes.mes}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{mes.visitas_mes}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{mes.programadas || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{mes.completadas || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{mes.canceladas || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reporte específico de clientes */}
      {reportType === 'clients' && clientStats && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reporte Detallado de Clientes</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumen General</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard
                title="Total Clientes"
                value={clientStats.total}
                icon={<UserIcon size="lg" />}
                color="blue"
              />
              
              <StatsCard
                title="Compradores"
                value={clientStats.por_tipo.find(t => t.type === 'buyer')?.cantidad || 0}
                icon={<UserIcon size="lg" />}
                color="green"
              />
              
              <StatsCard
                title="Vendedores"
                value={clientStats.por_tipo.find(t => t.type === 'seller')?.cantidad || 0}
                icon={<UserIcon size="lg" />}
                color="purple"
              />
              
              <StatsCard
                title="Inquilinos"
                value={clientStats.por_tipo.find(t => t.type === 'tenant')?.cantidad || 0}
                icon={<UserIcon size="lg" />}
                color="amber"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reporte específico de propiedades */}
      {reportType === 'properties' && propertyStats && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reporte Detallado de Propiedades</h2>
          
          {propertyStats.resumen && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumen General</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                  title="Precio Promedio"
                  value={`€${propertyStats.resumen.precio_promedio.toLocaleString()}`}
                  icon={<HomeIcon size="lg" />}
                  color="blue"
                />
                
                <StatsCard
                  title="Precio Mínimo"
                  value={`€${propertyStats.resumen.precio_minimo.toLocaleString()}`}
                  icon={<HomeIcon size="lg" />}
                  color="green"
                />
                
                <StatsCard
                  title="Precio Máximo"
                  value={`€${propertyStats.resumen.precio_maximo.toLocaleString()}`}
                  icon={<HomeIcon size="lg" />}
                  color="purple"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;