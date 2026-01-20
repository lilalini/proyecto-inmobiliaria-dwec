export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'house', label: 'Casa' },
  { value: 'chalet', label: 'Chalet' },
  { value: 'penthouse', label: 'Ático' },
  { value: 'commercial', label: 'Local Comercial' },
  { value: 'office', label: 'Oficina' },
  { value: 'land', label: 'Terreno' }
];

export const OPERATION_TYPES = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'sale_rent', label: 'Venta/Alquiler' }
];

export const STATUS_TYPES = [
  { value: 'available', label: 'Disponible' },
  { value: 'reserved', label: 'Reservado' },
  { value: 'sold', label: 'Vendido' },
  { value: 'rented', label: 'Alquilado' },
  { value: 'inactive', label: 'Inactivo' }
];

export const CITIES = [
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 
  'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Bilbao'
];

export const BEDROOM_OPTIONS = Array.from({ length: 6 }, (_, i) => i + 1);
export const BATHROOM_OPTIONS = Array.from({ length: 5 }, (_, i) => i + 1);