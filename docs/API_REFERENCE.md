# Referencia de la API

## Base URL
http://localhost:5000/api

## Endpoints Principales

### 1. Obtener todas las propiedades
GET /properties

```

### 2. Obtener una propiedad específica
GET /properties/:id

```

### 3. Obtener propiedades con filtros
GET /properties?city=Madrid&type=villa&minPrice=100000&maxPrice=500000

Parámetros disponibles:
- city: Madrid, Barcelona, Valencia, Sevilla, etc.
- type: apartment, house, villa, townhouse, etc.
- operation: sale, rent
- minPrice: número mínimo
- maxPrice: número máximo
- bedrooms: número de habitaciones
- bathrooms: número de baños

```

### 4. Crear una nueva propiedad
POST /properties

Cuerpo de la solicitud (JSON):
{
  "title": "Piso en el centro",
  "description": "Amplio piso con vistas...",
  "city": "Madrid",
  "address": "Calle Mayor 123",
  "type": "apartment",
  "operation": "sale",
  "price": 250000,
  "bedrooms": 3,
  "bathrooms": 2,
  "square_meters": 120,
  "agent_id": 1
}

```

### 5. Actualizar una propiedad
PUT /properties/:id

Cuerpo de la solicitud (JSON):
{
  "price": 260000,
  "description": "Nueva descripción..."
}

```

### 6. Eliminar una propiedad
DELETE /properties/:id

```

## Endpoints de Imágenes

### 1. Obtener imágenes de una propiedad
GET /properties/:id/images

```

### 2. Subir imagen para una propiedad
POST /properties/:id/images

Form-data:
- image: archivo de imagen

```

## Endpoints de Usuarios/Agentes

### 1. Obtener información de un agente
GET /agents/:id

```

### 2. Registrar nuevo usuario
POST /auth/register

Cuerpo de la solicitud (JSON):
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "password": "contraseña123",
  "role": "agent"
}

```

### 3. Iniciar sesión
POST /auth/login

Cuerpo de la solicitud (JSON):
{
  "email": "juan@email.com",
  "password": "contraseña123"
}

Respuesta:
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "role": "agent"
  }
}

```

## Endpoints de Visitas

### 1. Crear una visita
POST /visits

Cuerpo de la solicitud (JSON):
{
  "property_id": 1,
  "client_name": "María García",
  "client_email": "maria@email.com",
  "client_phone": "612345678",
  "visit_date": "2024-02-15T10:30:00Z",
  "notes": "Interesado en ver la terraza"
}

```

### 2. Obtener visitas de una propiedad
GET /properties/:id/visits

```

### 3. Actualizar estado de visita
PUT /visits/:id

Cuerpo de la solicitud (JSON):
{
  "status": "completed"
}

Estados disponibles: scheduled, completed, cancelled, no_show

```

## Códigos de Respuesta

- 200 OK: Solicitud exitosa
- 201 Created: Recurso creado exitosamente
- 400 Bad Request: Datos incorrectos
- 401 Unauthorized: No autenticado
- 403 Forbidden: No autorizado
- 404 Not Found: Recurso no encontrado
- 500 Internal Server Error: Error del servidor

```

## Ejemplo de Uso con curl

Obtener todas las propiedades:
curl http://localhost:5000/api/properties

```

Obtener propiedades en Madrid:
curl "http://localhost:5000/api/properties?city=Madrid"

```

Crear nueva propiedad (con token):
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_token_jwt" \
  -d '{"title":"Piso nuevo","city":"Barcelona","price":300000}'

```