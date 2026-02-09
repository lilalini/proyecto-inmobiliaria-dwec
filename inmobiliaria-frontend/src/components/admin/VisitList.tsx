import React, { useState } from 'react';
import type { Visit } from '../../services/api';

interface VisitListProps {
  visits: Visit[];
  onStatusChange?: (visitId: number, newStatus: string) => void;
  onRefresh?: () => void;
}

const VisitList: React.FC<VisitListProps> = ({ visits, onStatusChange, onRefresh }) => {
  const [editingStatus, setEditingStatus] = useState<{ visitId: number; status: string } | null>(null);

  const handleStatusChange = (visitId: number, newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(visitId, newStatus);
    }
    setEditingStatus(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { text: string; color: string; bg: string }> = {
      scheduled: { text: 'Programada', color: 'text-blue-700', bg: 'bg-blue-100' },
      completed: { text: 'Completada', color: 'text-green-700', bg: 'bg-green-100' },
      cancelled: { text: 'Cancelada', color: 'text-red-700', bg: 'bg-red-100' },
      no_show: { text: 'No Show', color: 'text-yellow-700', bg: 'bg-yellow-100' }
    };
    
    const config = statusConfig[status] || { text: status, color: 'text-gray-700', bg: 'bg-gray-100' };
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (visits.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay visitas programadas</h3>
        <p className="text-gray-500">Todavía no se han solicitado visitas.</p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Recargar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Gestión de Visitas</h2>
        <p className="text-gray-600">Todas las visitas programadas en el sistema</p>
      </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        )}
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propiedad</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visits.map((visit) => {
                const formatted = formatDate(visit.visit_date);
                return (
                  <tr key={visit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {visit.property_title || `Propiedad #${visit.property_serial}`}
                      </div>
                      <div className="text-sm text-gray-500">ID: {visit.property_serial}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {visit.client_name || 'Sin nombre'}
                      </div>
                      <div className="text-sm text-gray-500">{visit.client_phone || 'Sin teléfono'}</div>
                      <div className="text-sm text-gray-500">{visit.client_email || 'Sin email'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatted.date}</div>
                      <div className="text-sm text-gray-500">{formatted.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStatus?.visitId === visit.id ? (
                        <select
                          value={editingStatus.status}
                          onChange={(e) => setEditingStatus({ ...editingStatus, status: e.target.value })}
                          className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          onBlur={() => handleStatusChange(visit.id, editingStatus.status)}
                          autoFocus
                          title="Seleccionar estado de visita"
                          aria-label="Seleccionar estado de visita"
                        >
                          <option value="scheduled">Programada</option>
                          <option value="completed">Completada</option>
                          <option value="cancelled">Cancelada</option>
                          <option value="no_show">No Show</option>
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingStatus({ visitId: visit.id, status: visit.status })}
                          className="text-left"
                        >
                          {getStatusBadge(visit.status)}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          if (window.confirm('¿Eliminar esta visita?')) {
                            // Aquí iría la llamada a la API para eliminar
                            console.log('Eliminar visita:', visit.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitList;