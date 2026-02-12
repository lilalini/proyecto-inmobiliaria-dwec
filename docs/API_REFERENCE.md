# Referencia de la API

## Base URL
```
http://localhost:5000/api
```

> **Nota:** La ruta raíz `http://localhost:5000/api` no tiene contenido.  
> Usa los endpoints específicos listados a continuación.

---

## Autenticación

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `POST` | `/auth/login` | Iniciar sesión de usuario | Pública |
| `GET` | `/auth/verify` | Verificar validez del token | Requiere Token |

**Ejemplo POST /auth/login:**
```json
{
  "email": "carlos.rodriguez@apturist.com",
  "password": "admin123"
}
```

**Respuesta éxito:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Carlos Rodríguez",
    "email": "carlos.rodriguez@apturist.com",
    "role": "admin"
  }
}
```

---

## Propiedades

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `GET` | `/properties` | Listado de propiedades con filtros | Pública |
| `GET` | `/properties/:serial` | Detalle de propiedad por serial | Pública |
| `POST` | `/properties` | Crear nueva propiedad | Solo Admin |
| `PUT` | `/properties/:serial` | Actualizar propiedad | Solo Admin |
| `DELETE` | `/properties/:serial` | Eliminar propiedad | Solo Admin |

**Filtros disponibles en GET /properties:**
```
?city=Madrid
?type=apartment|house|penthouse
?operation=sale|rent
?minPrice=100000&maxPrice=500000
?bedrooms=3
?featured=true
```

---

## Visitas

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `POST` | `/visits` | Programar nueva visita | Pública |
| `GET` | `/visits` | Listado completo de visitas | Solo Admin |
| `GET` | `/visits/calendar` | Visitas por rango de fechas | Requiere Token |
| `GET` | `/visits/property/:serial` | Visitas de una propiedad | Pública |
| `PUT` | `/visits/:id/status` | Actualizar estado de visita | Solo Admin |
| `DELETE` | `/visits/:id` | Eliminar visita | Solo Admin |

**Estados de visita:** `scheduled`, `completed`, `cancelled`, `no_show`

---

## Clientes

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `GET` | `/clients` | Listado de clientes | Solo Admin |
| `POST` | `/clients` | Crear nuevo cliente | Solo Admin |
| `PUT` | `/clients/:id` | Actualizar cliente | Solo Admin |
| `DELETE` | `/clients/:id` | Eliminar cliente | Solo Admin |

**Tipos de cliente:** `buyer`, `seller`, `tenant`, `landlord`

---

## Reportes

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `GET` | `/reports/dashboard` | Métricas principales | Solo Admin |
| `GET` | `/reports/visits` | Estadísticas de visitas por mes | Solo Admin |
| `GET` | `/reports/clients` | Distribución de clientes por tipo | Solo Admin |
| `GET` | `/reports/properties` | Estadísticas de propiedades | Solo Admin |

**Parámetros para /reports/visits:**
```
?startDate=2026-01-01&endDate=2026-12-31
```

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| `200 OK` | Solicitud exitosa |
| `201 Created` | Recurso creado correctamente |
| `400 Bad Request` | Error en los datos enviados |
| `401 Unauthorized` | Token no proporcionado o inválido |
| `403 Forbidden` | Sin permisos para la acción |
| `404 Not Found` | Recurso no encontrado |
| `500 Internal Server Error` | Error en el servidor |

---

## Headers Requeridos

**Para endpoints con token:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Para endpoints con imágenes (POST/PUT /properties):**
```
Content-Type: multipart/form-data
```

---

© 2026 Apturist Inmobiliaria - v2.0.0