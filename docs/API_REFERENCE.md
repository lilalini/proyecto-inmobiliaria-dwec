# Referencia de la API

## Base URL
http://localhost:5000/api

## Autenticación

| Método | Endpoint | Descripción | Permisos |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Iniciar sesión de usuario. | Pública |
| `GET` | `/auth/verify` | Verificar validez del token actual. | Requiere Token |

**Ejemplo de cuerpo para `/auth/login`:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseñaSegura123"
}

```

# Propiedades

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `GET` | `/properties` | Obtiene el listado de todas las propiedades. Admite filtros. | Pública |
| `GET` | `/properties/:id` | Obtiene los detalles de una propiedad específica por su ID. | Pública |
| `POST` | `/properties` | Crea una nueva propiedad. **Usa `multipart/form-data` para imágenes.** | Solo Admin |
| `PUT` | `/properties/:id` | Actualiza la información de una propiedad existente. | Solo Admin |
| `DELETE` | `/properties/:id` | Elimina una propiedad del sistema. | Solo Admin |

## Parámetros de consulta para `GET /properties`

* `city`: Filtrar por ciudad (ej. `Madrid`).
* `type`: Filtrar por tipo de propiedad (ej. `apartment`, `house`).
* `operation`: Filtrar por operación (ej. `sale`, `rent`).
* `minPrice` / `maxPrice`: Filtrar por rango de precio.
* `bedrooms` / `bathrooms`: Filtrar por número de habitaciones o baños.

## Ejemplo de consulta filtrada

```json
GET /api/properties?city=Madrid&type=apartment&minPrice=100000

```
# Visitas

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `POST` | `/visits` | Programa una nueva visita a una propiedad. | Pública |
| `GET` | `/visits/property/:propertySerial` | Obtiene todas las visitas asociadas a una    propiedad. | Pública |
| `GET` | `/visits/calendar` | Obtiene visitas para un rango de fechas, útil para calendarios. | Pública |
| `GET` | `/visits` | Obtiene el listado completo de todas las visitas. | Solo Admin |
| `PUT` | `/visits/:id/status` | Actualiza el estado de una visita programada. | Solo Admin |
| `DELETE` | `/visits/:id` | Elimina una visita del sistema. | Solo Admin |

## Ejemplo de cuerpo para `POST /visits`

```json
{
  "property_id": 123,
  "client_name": "Ana García López",
  "client_email": "ana.garcia@email.com",
  "client_phone": "+34 612 345 678",
  "visit_date": "2024-02-20T16:30:00.000Z",
  "notes": "Interesada en la reforma de la cocina."
}

```
## Ejemplo de cuerpo para `POST /clients`
```json
{
  "name": "Carlos Méndez",
  "email": "carlos.mendez@email.com",
  "phone": "645 87 41 25",
  "type": "buyer"
}
```
**Valores aceptados para el campo `type`:** `buyer`, `seller`, `tenant`, `landlord`.

# Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| `200 OK` | La solicitud se completó con éxito. |
| `201 Created` | Un nuevo recurso fue creado con éxito (ej. POST). |
| `400 Bad Request` | Error en los datos enviados por el cliente. |
| `401 Unauthorized` | Faltan credenciales de autenticación o son inválidas. |
| `403 Forbidden` | El usuario autenticado no tiene permisos para la acción. |
| `404 Not Found` | El recurso solicitado no existe. |
| `500 Internal Server Error` | Error genérico del servidor. |

# Estructura de Respuesta

Todas las respuestas siguen un formato JSON consistente:

## Éxito

```json
{
  "success": true,
  "data": { ... }, // o [ ... ] para listas
  "message": "Operación completada." // Opcional
}

```


## Error

```json
{
  "success": false,
  "error": "Descripción clara del error.",
  "data": null
}

```
## Nota sobre permisos

* **Pública**: Accesible sin autenticación.
* **Requiere Token**: Necesita encabezado `Authorization: Bearer <JWT_TOKEN>`.
* **Solo Admin**: Necesita token de un usuario con rol de administrador.

