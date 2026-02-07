/**
 * VALIDACIONES BACKEND - DEBEN COINCIDIR CON FRONTEND
 * Fuente única de verdad para reglas de validación
 */

// COPIAR EXACTAMENTE LOS VALORES DEL FRONTEND
const VALID_TYPES = ['apartment', 'house', 'chalet', 'penthouse', 'commercial', 'office', 'land'];
const VALID_OPERATIONS = ['sale', 'rent', 'sale_rent']; 
const VALID_STATUSES = ['available', 'reserved', 'sold', 'rented', 'inactive']; 
const VALID_CITIES = [
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 
  'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Bilbao'
];

/**
 * Validación para CREAR propiedad (campos completos)
 */
export const validatePropertyCreate = (data) => {
  const errors = [];
  
  // 1. TÍTULO - mínimo 5 caracteres
  if (!data.title || data.title.trim().length < 5) {
    errors.push('El título debe tener al menos 5 caracteres');
  }
  
  // 2. PRECIO - requerido y positivo
  if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
    errors.push('El precio debe ser un número mayor a 0');
  }
  
  // 3. TIPO - debe ser de la lista del frontend
  if (!data.type || !VALID_TYPES.includes(data.type)) {
    errors.push(`Tipo de propiedad inválido. Válidos: ${VALID_TYPES.join(', ')}`);
  }
  
  // 4. OPERACIÓN - debe ser de la lista del frontend
  if (!data.operation || !VALID_OPERATIONS.includes(data.operation)) {
    errors.push(`Tipo de operación inválido. Válidos: ${VALID_OPERATIONS.join(', ')}`);
  }
  
  // 5. DIRECCIÓN - mínimo 10 caracteres
  if (!data.address || data.address.trim().length < 10) {
    errors.push('La dirección debe tener al menos 10 caracteres');
  }
  
  // 6. CIUDAD - debe ser de la lista del frontend
  if (!data.city || !VALID_CITIES.includes(data.city)) {
    errors.push(`Ciudad inválida. Válidas: ${VALID_CITIES.join(', ')}`);
  }
  
  // 7. DORMITORIOS - opcional, pero si existe debe ser >= 0
  if (data.bedrooms !== undefined && (isNaN(data.bedrooms) || data.bedrooms < 0)) {
    errors.push('Los dormitorios deben ser un número mayor o igual a 0');
  }
  
  // 8. BAÑOS - opcional, pero si existe debe ser >= 0
  if (data.bathrooms !== undefined && (isNaN(data.bathrooms) || data.bathrooms < 0)) {
    errors.push('Los baños deben ser un número mayor o igual a 0');
  }
  
  // 9. ÁREA - opcional, pero si existe debe ser > 0
  if (data.area !== undefined && (isNaN(data.area) || data.area <= 0)) {
    errors.push('El área debe ser un número mayor a 0');
  }
  
  // 10. ESTADO - opcional, pero si existe debe ser válido
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Estado inválido. Válidos: ${VALID_STATUSES.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validación para ACTUALIZAR propiedad (campos parciales)
 */
export const validatePropertyUpdate = (data) => {
  const errors = [];
  const allowedFields = {};
  
  // Campos permitidos para actualización (misma lista que antes)
  const UPDATEABLE_FIELDS = [
    'title', 'description', 'type', 'operation', 'address', 'city',
    'price', 'bedrooms', 'bathrooms', 'area', 'status', 'featured', 'agent_id'
  ];
  
  // 1. Filtrar solo campos permitidos
  Object.keys(data).forEach(key => {
    if (UPDATEABLE_FIELDS.includes(key)) {
      allowedFields[key] = data[key];
    }
  });
  
  // 2. Validar cada campo si está presente (mismas reglas que creación)
  if (allowedFields.title !== undefined && allowedFields.title.trim().length < 5) {
    errors.push('El título debe tener al menos 5 caracteres');
  }
  
  if (allowedFields.price !== undefined && (isNaN(allowedFields.price) || allowedFields.price <= 0)) {
    errors.push('El precio debe ser mayor a 0');
  }
  
  if (allowedFields.type !== undefined && !VALID_TYPES.includes(allowedFields.type)) {
    errors.push(`Tipo inválido. Válidos: ${VALID_TYPES.join(', ')}`);
  }
  
  if (allowedFields.operation !== undefined && !VALID_OPERATIONS.includes(allowedFields.operation)) {
    errors.push(`Operación inválida. Válidas: ${VALID_OPERATIONS.join(', ')}`);
  }
  
  if (allowedFields.city !== undefined && !VALID_CITIES.includes(allowedFields.city)) {
    errors.push(`Ciudad inválida. Válidas: ${VALID_CITIES.join(', ')}`);
  }
  
  if (allowedFields.area !== undefined && (isNaN(allowedFields.area) || allowedFields.area <= 0)) {
    errors.push('El área debe ser mayor a 0');
  }
  
  if (allowedFields.status !== undefined && !VALID_STATUSES.includes(allowedFields.status)) {
    errors.push(`Estado inválido. Válidos: ${VALID_STATUSES.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    filteredData: allowedFields
  };
};

/**
 * Validar ID de propiedad (serial)
 */
export const validatePropertyId = (id) => {
  return id && typeof id === 'string' && id.trim().length > 0;
};

/**
 * Exportar CONSTANTES (por si las necesitamos en otros lugares)
 */
export const VALIDATION_CONSTANTS = {
  TYPES: VALID_TYPES,
  OPERATIONS: VALID_OPERATIONS,
  STATUSES: VALID_STATUSES,
  CITIES: VALID_CITIES,
  MIN_TITLE_LENGTH: 5,
  MIN_ADDRESS_LENGTH: 10
};