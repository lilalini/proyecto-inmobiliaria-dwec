# Documentación de Base de Datos

## Esquema de la Base de Datos

### 1. Tabla: properties (Propiedades)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `serial` | SERIAL PRIMARY KEY | Identificador único de propiedad |
| `title` | VARCHAR(200) NOT NULL | Título de la propiedad |
| `description` | TEXT | Descripción detallada |
| `type` | VARCHAR(50) NOT NULL | Tipo: apartment, house, commercial, office, land, chalet, penthouse |
| `operation` | VARCHAR(20) NOT NULL | Operación: sale, rent, sale_rent |
| `address` | VARCHAR(255) NOT NULL | Dirección completa |
| `city` | VARCHAR(100) NOT NULL | Ciudad |
| `price` | DECIMAL(12,2) | Precio |
| `bedrooms` | INTEGER | Número de habitaciones |
| `bathrooms` | INTEGER | Número de baños |
| `area` | DECIMAL(8,2) | Metros cuadrados |
| `status` | VARCHAR(20) | Estado: available, reserved, sold, rented, inactive |
| `featured` | BOOLEAN | Propiedad destacada |
| `agent_id` | INTEGER REFERENCES users(id) | Agente asignado |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

---

### 2. Tabla: property_images (Imágenes)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Identificador único |
| `property_serial` | INTEGER REFERENCES properties(serial) ON DELETE CASCADE | Propiedad asociada |
| `image_url` | VARCHAR(500) NOT NULL | URL de la imagen |
| `image_order` | INTEGER DEFAULT 0 | Orden de visualización |
| `is_main` | BOOLEAN DEFAULT false | Imagen principal |
| `uploaded_at` | TIMESTAMP | Fecha de subida |
| `description` | VARCHAR(200) | Descripción de la imagen |

---

### 3. Tabla: users (Usuarios/Agentes)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Identificador único |
| `name` | VARCHAR(255) NOT NULL | Nombre completo |
| `email` | VARCHAR(255) UNIQUE NOT NULL | Correo electrónico |
| `password` | VARCHAR(255) NOT NULL | Hash de contraseña |
| `role` | VARCHAR(20) | Rol: admin, agent, manager |
| `created_at` | TIMESTAMP | Fecha de creación |

**Roles disponibles:** `admin`, `agent`, `manager`

---

### 4. Tabla: clients (Clientes)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Identificador único |
| `name` | VARCHAR(255) NOT NULL | Nombre completo |
| `email` | VARCHAR(150) UNIQUE | Correo electrónico |
| `phone` | VARCHAR(20) | Teléfono |
| `type` | VARCHAR(20) | Tipo: buyer, seller, tenant, landlord |
| `created_at` | TIMESTAMP | Fecha de creación |

**Tipos de cliente:** `buyer` (comprador), `seller` (vendedor), `tenant` (inquilino), `landlord` (propietario)

---

### 5. Tabla: visits (Visitas)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Identificador único |
| `property_serial` | INTEGER REFERENCES properties(serial) ON DELETE CASCADE | Propiedad a visitar |
| `client_id` | INTEGER REFERENCES clients(id) ON DELETE CASCADE | Cliente |
| `visit_date` | TIMESTAMP NOT NULL | Fecha y hora de la visita |
| `status` | VARCHAR(20) | Estado: scheduled, completed, cancelled, no_show |
| `notes` | TEXT | Notas adicionales |
| `created_at` | TIMESTAMP | Fecha de creación |

**Estados:** `scheduled` (programada), `completed` (completada), `cancelled` (cancelada), `no_show` (no asistió)

---

### 6. Tabla: features (Características)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Identificador único |
| `name` | VARCHAR(100) NOT NULL | Nombre de la característica |
| `icon` | VARCHAR(50) | Icono asociado |
| `category` | VARCHAR(50) | Categoría |

---

### 7. Tabla: property_features (Relación Propiedad-Característica)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `property_serial` | INTEGER REFERENCES properties(serial) ON DELETE CASCADE | Propiedad |
| `feature_id` | INTEGER REFERENCES features(id) ON DELETE CASCADE | Característica |
| PRIMARY KEY | (property_serial, feature_id) | Clave compuesta |

---

### 8. Tabla: audit_log (Auditoría)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Identificador único |
| `table_name` | VARCHAR(50) NOT NULL | Tabla afectada |
| `record_id` | INTEGER NOT NULL | ID del registro |
| `action` | VARCHAR(10) NOT NULL | INSERT, UPDATE, DELETE |
| `old_values` | JSONB | Valores anteriores |
| `new_values` | JSONB | Valores nuevos |
| `changed_by` | INTEGER REFERENCES users(id) | Usuario que realizó el cambio |
| `changed_at` | TIMESTAMP | Fecha del cambio |

---

### 9. Tabla: price_history (Historial de Precios)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Identificador único |
| `property_serial` | INTEGER REFERENCES properties(serial) ON DELETE CASCADE | Propiedad |
| `old_price` | DECIMAL(12,2) | Precio anterior |
| `new_price` | DECIMAL(12,2) | Precio nuevo |
| `change_date` | TIMESTAMP | Fecha del cambio |
| `changed_by` | INTEGER REFERENCES users(id) | Usuario |
| `reason` | VARCHAR(200) | Motivo del cambio |

---

## Relaciones entre Tablas

```
users 1 ────< properties (agent_id) >──── 1 clients
       │                                  │
       │                                  │
       └───< visits (client_id) <────────┘
               │
               └───< properties (property_serial)
                        │
                        └───< property_images
                        └───< property_features >─── features
                        └───< price_history
```

---

## Índices Recomendados

```sql
-- Propiedades
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_agent ON properties(agent_id);

-- Imágenes
CREATE INDEX idx_property_images_property ON property_images(property_serial);
CREATE INDEX idx_property_images_main ON property_images(property_serial, is_main);

-- Visitas
CREATE INDEX idx_visits_property ON visits(property_serial);
CREATE INDEX idx_visits_date ON visits(visit_date);
CREATE INDEX idx_visits_status ON visits(status);

-- Usuarios y clientes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_clients_email ON clients(email);
```

---

## Scripts SQL

### schema.sql - Crear tablas

El archivo completo `schema.sql` contiene todas las sentencias CREATE TABLE, funciones y triggers documentados en el repositorio.

**Ubicación:** `/database/schema.sql`

### seed.sql - Datos de ejemplo

El archivo `seed.sql` contiene los datos iniciales:
- Usuarios (Carlos Rodríguez, Laura Martínez, Pedro Sánchez)
- Clientes de ejemplo
- Propiedades de prueba
- Características disponibles
- Visitas de ejemplo

**Ubicación:** `/database/seed.sql`

---

## Funciones y Triggers

| Función | Descripción |
|---------|-------------|
| `update_updated_at_column()` | Actualiza automáticamente updated_at |
| `search_properties()` | Búsqueda avanzada de propiedades |
| `get_property_stats_by_city()` | Estadísticas por ciudad |
| `validate_visit_date()` | Valida fechas de visitas |
| `audit_trigger_function()` | Registro automático de auditoría |
| `log_price_change()` | Historial de cambios de precio |
| `get_property_with_images()` | Obtiene propiedad con todas sus imágenes |
| `set_main_image()` | Establece imagen principal |
| `count_property_images()` | Cuenta imágenes por propiedad |

---

## Vistas

| Vista | Descripción |
|-------|-------------|
| `properties_with_main_image` | Propiedades con su imagen principal |
| `featured_properties_with_images` | Propiedades destacadas con imagen |

---

## Consultas Útiles

```sql
-- Propiedades por ciudad
SELECT city, COUNT(*) as total 
FROM properties 
WHERE status = 'available'
GROUP BY city 
ORDER BY total DESC;

-- Precio promedio por tipo
SELECT type, 
       ROUND(AVG(price)::numeric, 2) as precio_promedio,
       MIN(price) as precio_minimo,
       MAX(price) as precio_maximo
FROM properties 
WHERE status = 'available'
GROUP BY type;

-- Visitas por mes
SELECT TO_CHAR(DATE_TRUNC('month', visit_date), 'YYYY-MM') as mes,
       COUNT(*) as visitas_mes,
       COUNT(CASE WHEN status = 'completed' THEN 1 END) as completadas,
       COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as canceladas
FROM visits 
GROUP BY DATE_TRUNC('month', visit_date)
ORDER BY mes DESC;

-- Clientes por tipo
SELECT type, 
       COUNT(*) as cantidad,
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as porcentaje
FROM clients 
GROUP BY type;
```

---

## Backup y Restauración

```bash
# Backup completo
pg_dump -U postgres -d inmobiliaria_db -f backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U postgres -d inmobiliaria_db -f backup_20260212.sql
```

---

## Notas Importantes

1. **La tabla `properties` usa `serial` como PRIMARY KEY, no `id`**
2. **Las imágenes están en tabla separada `property_images` (soporta múltiples imágenes)**
3. **Sistema de auditoría automático en tablas principales**
4. **Triggers para validación de visitas y registro de cambios de precio**
5. **Funciones de búsqueda optimizadas con índices**

---

© 2026 Apturist Inmobiliaria - v2.0.0