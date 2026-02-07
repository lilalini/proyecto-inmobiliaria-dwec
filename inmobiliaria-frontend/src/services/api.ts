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
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
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

  // FUNCIÓN UPDATE CORREGIDA
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

  // FUNCIÓN DELETE CORREGIDA
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
      const response = await api.get('/visits');
      return { success: true, data: response.data };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
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
      const response = await api.post('/visits', visitData);
      return { success: true, data: response.data };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return {
        success: false,
        data: {} as Visit,
        error: errorMessage
      };
    }
  }
};

export default api;