export interface PropertyFormData {
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
}

export const validatePropertyForm = (data: Partial<PropertyFormData>): string[] => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) errors.push('El título es obligatorio');
  if (!data.price || data.price <= 0) errors.push('El precio debe ser mayor a 0');
  if (!data.address?.trim()) errors.push('La dirección es obligatoria');
  if (!data.city?.trim()) errors.push('La ciudad es obligatoria');
  if (!data.type) errors.push('El tipo de propiedad es obligatorio');
  if (!data.operation) errors.push('El tipo de operación es obligatorio');
  
  return errors;
};