// api.ts - VERSIÓN CORREGIDA SIN ERRORES
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Property {
  serial: number;
  title: string;
  description: string;
  type: string;
  operation: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: string;
  featured: boolean;
  agent_id: number;
  created_at: string;
  updated_at: string;
  images: Array<{
    id: number;
    image_url: string;
    is_main?: boolean;
    image_order?: number;
  }>;
}

export interface Visit {
  id: number;
  property_serial: number;
  client_id: number;
  visit_date: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes: string;
  created_at: string;
  property_title?: string;
  property_address?: string;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface CalendarVisit {
  id: number | string;
  title: string;
  start: string;
  end: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  status: string;
  property_title: string;
  property_serial: string;
  allDay: boolean;
}

export interface Cliente {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  created_at_formatted: string;
  total_visits: number;
}


export const propertyAPI = {
  getAll: async (): Promise<ApiResponse<Property[]>> => {
    try {
      const response = await api.get('/properties');
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return {
        success: false,
        data: [],
        error: errorMessage
      };
    }
  },

  getById: async (serial: number): Promise<ApiResponse<Property>> => {
    try {
      const response = await api.get(`/properties/${serial}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return {
        success: false,
        data: {} as Property,
        error: errorMessage
      };
    }
  },

  create: async (propertyData: FormData): Promise<ApiResponse<Property>> => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await api.post('/properties', propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return {
        success: false,
        data: {} as Property,
        error: errorMessage
      };
    }
  },

 
  update: async (serial: number, propertyData: FormData): Promise<ApiResponse<Property>> => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await api.put(`/properties/${serial}`, propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return {
        success: false,
        data: {} as Property,
        error: errorMessage
      };
    }
  },

  
  delete: async (serial: number): Promise<ApiResponse<{ message: string }>> => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await api.delete(`/properties/${serial}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return {
        success: false,
        data: { message: '' },
        error: errorMessage
      };
    }
  }
};

export const visitAPI = {
  getAll: async (): Promise<ApiResponse<Visit[]>> => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.warn('No auth token found for visitAPI.getAll()');
        return {
          success: false,
          data: [],
          error: 'No autenticado. Por favor, inicia sesión.'
        };
      }
      
      const response = await api.get('/visits', {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      console.log('visitAPI.getAll() response:', response.data);
      
      const visitsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);
      
      return { 
        success: true, 
        data: visitsData 
      };
      
    } catch (error: unknown) {
      console.error('Error en visitAPI.getAll():', error);
      
      let errorMessage = 'Error desconocido al cargar visitas';
      
      if (axios.isAxiosError(error)) {
        // Error específico de Axios
        if (error.response) {
          errorMessage = error.response.data?.error || 
                        error.response.data?.message || 
                        `Error ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
          errorMessage = 'Error de conexión. Verifica tu red.';
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        data: [],
        error: errorMessage
      };
    }
  },

  getVisits: async (): Promise<ApiResponse<Visit[]>> => {
    return visitAPI.getAll();
  },

  create: async (visitData: Partial<Visit>): Promise<ApiResponse<Visit>> => {
    try {
      console.log('Enviando visita:', visitData);
      
      const response = await api.post('/visits', visitData);
      
      console.log('Visita creada response:', response.data);
      
      return { 
        success: true, 
        data: response.data 
      };
      
    } catch (error: unknown) {
      console.error('Error en visitAPI.create():', error);
      
      let errorMessage = 'Error desconocido al crear visita';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.error || 
                        error.response.data?.message || 
                        `Error ${error.response.status}`;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        data: {} as Visit,
        error: errorMessage
      };
    }
  },

   getCalendarVisits: async (startDate?: string, endDate?: string): Promise<ApiResponse<CalendarVisit[]>> => {
    try {
      const token = localStorage.getItem('authToken');
      
      let url = '/visits/calendar';
      
      if (startDate && endDate) {
        url += `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
      }
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.get(url, { headers });
      
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : []
      };
      
    } catch (error: unknown) {
      console.error('Error en visitAPI.getCalendarVisits():', error);
      
      let errorMessage = 'Error al obtener visitas para calendario';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.error || 
                        error.response.data?.message || 
                        `Error ${error.response.status}`;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        data: [],
        error: errorMessage
      };
    }
  },

  };

// API PARA CLIENTES
// En frontend/src/services/api.ts
export const clientAPI = {
  // Método GET para obtener todos los clientes
  getAll: async (): Promise<ApiResponse<Cliente[]>> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.get('/clients', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      // Asegúrate que devuelva el formato correcto
      return {
        success: response.data.success || true,
        data: response.data.data || response.data || []
      };
    } catch (error) {
      console.error('Error en clientAPI.getAll():', error);
      return { 
        success: false, 
        data: [], 
        error: 'Error al cargar clientes' 
      };
    }
  },

  // Método POST para crear cliente
  create: async (clientData: { 
    name: string; 
    email: string; 
    phone?: string; 
    type?: string 
  }): Promise<ApiResponse<Cliente>> => {
    try {
      const token = localStorage.getItem('authToken');
      
      // IMPORTANTE: La tabla clients usa 'name', 'phone', 'type' (inglés)
      const dataToSend = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone || '',
        type: clientData.type || 'buyer'
      };
      
      const response = await api.post('/clients', dataToSend, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error) {
      console.error('Error en clientAPI.create():', error);
      return {
        success: false,
        data: {} as Cliente,
        error: 'Error al crear cliente'
      };
    }
  },

   // NUEVOS: update y delete
  update: async (id: number, clientData: Partial<Cliente>): Promise<ApiResponse<Cliente>> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.put(`/clients/${id}`, clientData, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error) {
      console.error('Error en clientAPI.update():', error);
      return {
        success: false,
        data: {} as Cliente,
        error: 'Error al actualizar cliente'
      };
    }
  },
  
  delete: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.delete(`/clients/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      return {
        success: response.data.success,
        data: response.data,
        error: response.data.error
      };
    } catch (error) {
      console.error('Error en clientAPI.delete():', error);
      return {
        success: false,
        data: { message: '' },
        error: 'Error al eliminar cliente'
      };
    }
  }
};
export default api;

  
 
