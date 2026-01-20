import React, { useEffect, useState } from 'react';
import { visitAPI } from '../../services/api';
import type { Visit } from "../../services/api";
import NewVisitForm from '../forms/NewVisitForm';

const VisitCalendar: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showNewVisitForm, setShowNewVisitForm] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await visitAPI.getAll();
      if (response.success) {
        setVisits(response.data);
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVisitsForSelectedDate = () => {
    return visits.filter(visit => 
      visit.visit_date.startsWith(selectedDate)
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      scheduled: 'Programada',
      completed: 'Completada',
      cancelled: 'Cancelada',
      no_show: 'No se presentó'
    };
    return statusMap[status] || status;
  };

  const handleNewVisitSuccess = () => {
    fetchVisits();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const todaysVisits = getVisitsForSelectedDate();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Calendario de Visitas</h2>
        <p className="text-gray-600">Gestiona las visitas programadas a las propiedades</p>
      </div>

      {/* Selector de fecha */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar fecha:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Seleccionar fecha para ver visitas"
          title="Selecciona una fecha para ver las visitas programadas"
        />
        <div className="mt-2 text-sm text-gray-500">
          {new Date(selectedDate).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">
            {visits.length}
          </div>
          <div className="text-sm text-blue-600">Total visitas</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-700">
            {visits.filter(v => v.status === 'scheduled').length}
          </div>
          <div className="text-sm text-green-600">Programadas</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-700">
            {visits.filter(v => v.status === 'completed').length}
          </div>
          <div className="text-sm text-purple-600">Completadas</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-700">
            {todaysVisits.length}
          </div>
          <div className="text-sm text-gray-600">Hoy</div>
        </div>
      </div>

      {/* Lista de visitas para la fecha seleccionada */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Visitas para esta fecha ({todaysVisits.length})
        </h3>

        {todaysVisits.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-4xl mb-4">No hay visitas</div>
            <p className="text-gray-600">No hay visitas programadas para esta fecha</p>
            <p className="text-gray-500 text-sm mt-1">Selecciona otra fecha o programa una nueva visita</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysVisits.map((visit) => (
              <div key={visit.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{visit.property_title}</h4>
                    <p className="text-sm text-gray-600">{visit.property_address}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Cliente: {visit.client_name}</span>
                      <span className="text-sm">Tel: {visit.client_phone}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{visit.notes}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                      {getStatusText(visit.status)}
                    </span>
                    <div className="mt-2 text-sm text-gray-600">
                      {formatDate(visit.visit_date)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">
                    Editar
                  </button>
                  <button className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">
                    Cancelar
                  </button>
                  <button className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200">
                    Completar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón para nueva visita */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button 
          onClick={() => setShowNewVisitForm(true)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          + Programar nueva visita
        </button>
      </div>

      {/* Formulario modal */}
      {showNewVisitForm && (
        <NewVisitForm
          onClose={() => setShowNewVisitForm(false)}
          onSuccess={handleNewVisitSuccess}
        />
      )}
    </div>
  );
};

export default VisitCalendar;