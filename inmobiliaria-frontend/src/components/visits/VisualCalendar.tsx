import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import type { View, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { visitAPI } from '../../services/api';

// Configurar español y localizador
moment.locale('es');
const localizer = momentLocalizer(moment);

// Tipo para los eventos del calendario
interface CalendarEvent {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    clientName: string;
    status: string;
  };
}

// Tipo para las visitas de la API (ajusta según tu interfaz real)
/*interface Visit {
  id: number;
  visit_date: string;
  status: string;
  client_name: string;
  property_title?: string;
}*/

const VisualCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>('month');
  const [loading, setLoading] = useState(true);

  // 1. CARGAR VISITAS
  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await visitAPI.getAll();
      
      if (response.success && response.data) {
        const visits = response.data;
        
        // Convertir visitas a eventos
       const calendarEvents: CalendarEvent[] = visits.map((visit) => {
        const startDate = new Date(visit.visit_date);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        
        return {
            id: visit.id,
            title: `${visit.client_name || 'Cliente'} - ${visit.property_title || 'Visita'}`,
            start: startDate,
            end: endDate,
            resource: {
            clientName: visit.client_name || 'Cliente',
            status: visit.status
            }
        };
    });
            
        setEvents(calendarEvents);
      }
    } catch (error) {
      console.error('Error cargando visitas:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. MANEJAR EVENTOS DEL CALENDARIO
  const handleSelectEvent = (event: CalendarEvent) => {
    alert(`Visita seleccionada:\nCliente: ${event.resource?.clientName}\nEstado: ${event.resource?.status || 'programada'}`);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    console.log('Espacio seleccionado para nueva visita:', slotInfo.start);
    // Aquí podrías abrir un modal para crear visita
  };

  // 3. ESTILOS PARA EVENTOS
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad'; // Azul para programadas
    
    if (event.resource?.status === 'completed') {
      backgroundColor = '#28a745'; // Verde
    } else if (event.resource?.status === 'cancelled') {
      backgroundColor = '#dc3545'; // Rojo
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        color: 'white',
        border: 'none',
        padding: '2px 8px',
        fontSize: '13px'
      }
    };
  };

  // 4. FORMATOS EN ESPAÑOL
        const formats = {
        dateFormat: 'D',
        dayFormat: 'ddd D',
        monthHeaderFormat: 'MMMM YYYY',
        dayHeaderFormat: 'dddd D',
        dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
            return `${start.getDate()} ${start.toLocaleDateString('es', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('es', { month: 'short' })}`;
        }
     };

  // 5. MENSAJES EN ESPAÑOL
  const messages = {
    today: 'Hoy',
    previous: '←',
    next: '→',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Visita',
    noEventsInRange: 'No hay visitas programadas en este período',
    showMore: (count: number) => `+ Ver ${count} más`
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando visitas...</p>
        </div>
      </div>
    );
  }

  // 6. CALENDARIO PRINCIPAL CON TODAS LAS PROPIEDADES NECESARIAS
  return (
    <div className="h-full w-full p-1"> {/* Padding mínimo, altura completa */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ 
          height: 'calc(100vh - 200px)', // Altura responsiva
          minHeight: '600px' // Mínimo para que se vea bien
        }}
        date={currentDate}
        view={currentView}
        onView={setCurrentView}
        onNavigate={setCurrentDate}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable={true}
        eventPropGetter={eventStyleGetter}
        formats={formats}
        messages={messages}
        popup={true}
        scrollToTime={new Date(1970, 1, 1, 8)} // Comenzar a las 8 AM
        // Configuración específica para vistas
        min={new Date(1970, 1, 1, 8, 0, 0)} // Comienzo a las 8 AM
        max={new Date(1970, 1, 1, 20, 0, 0)} // Fin a las 8 PM
        step={60} // Intervalos de 60 minutos
        timeslots={2} // 2 divisiones por hora
        // Habilitar todas las vistas
        views={['month', 'week', 'day', 'agenda']}
      />
    </div>
  );
};

export default VisualCalendar;