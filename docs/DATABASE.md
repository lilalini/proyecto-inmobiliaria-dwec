# Documentación de Base de Datos

## Esquema de la Base de Datos

### 1. Tabla: properties (Propiedades)

Campos:
- id: SERIAL PRIMARY KEY
- title: VARCHAR(255) NOT NULL
- description: ```
- city: VARCHAR(100) NOT NULL
- address: VARCHAR(255)
- type: VARCHAR(50) NOT NULL
- operation: VARCHAR(20) NOT NULL
- price: DECIMAL(12,2) NOT NULL
- bedrooms: INTEGER
- bathrooms: INTEGER
- square_meters: INTEGER
- agent_id: INTEGER REFERENCES users(id)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

```

### 2. Tabla: images (Imágenes)

Campos:
- id: SERIAL PRIMARY KEY
- property_id: INTEGER REFERENCES properties(id) ON DELETE CASCADE
- url: VARCHAR(500) NOT NULL
- alt_```: VARCHAR(255)
- is_main: BOOLEAN DEFAULT FALSE
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

```

### 3. Tabla: users (Usuarios/Agentes)

Campos:
- id: SERIAL PRIMARY KEY
- name: VARCHAR(100) NOT NULL
- email: VARCHAR(255) UNIQUE NOT NULL
- password_hash: VARCHAR(255) NOT NULL
- phone: VARCHAR(20)
- role: VARCHAR(20) DEFAULT 'client'
- profile_image: VARCHAR(500)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Roles disponibles: admin, manager, agent, client

```

### 4. Tabla: visits (Visitas)

Campos:
- id: SERIAL PRIMARY KEY
- property_id: INTEGER REFERENCES properties(id) ON DELETE CASCADE
- client_name: VARCHAR(100) NOT NULL
- client_email: VARCHAR(255)
- client_phone: VARCHAR(20)
- visit_date: TIMESTAMP NOT NULL
- status: VARCHAR(20) DEFAULT 'scheduled'
- notes: ```
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Estados: scheduled, completed, cancelled, no_show

```

### 5. Tabla: clients (Clientes)

Campos:
- id: SERIAL PRIMARY KEY
- name: VARCHAR(100) NOT NULL
- email: VARCHAR(255) UNIQUE
- phone: VARCHAR(20)
- preferences: JSONB
- notes: ```
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

```

## Relaciones entre Tablas

1. properties.agent_id → users.id (Un agente tiene muchas propiedades)
2. images.property_id → properties.id (Una propiedad tiene muchas imágenes)
3. visits.property_id → properties.id (Una propiedad tiene muchas visitas)

```

## Índices Recomendados

CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_operation ON properties(operation);
CREATE INDEX idx_visits_property_id ON visits(property_id);
CREATE INDEX idx_visits_status ON visits(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

```

## Scripts SQL

### schema.sql - Crear tablas

-- Tabla users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'client',
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla properties
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description ```,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    type VARCHAR(50) NOT NULL,
    operation VARCHAR(20) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    square_meters INTEGER,
    agent_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### seed.sql - Datos de ejemplo

-- Insertar usuarios de ejemplo
INSERT INTO users (name, email, password_hash, phone, role) VALUES
('Carlos Martínez', 'carlos@apturist.com', '$2b$10$...', '+34 612 345 678', 'agent'),
('Ana López', 'ana@apturist.com', '$2b$10$...', '+34 623 456 789', 'agent'),
('Admin Sistema', 'admin@apturist.com', '$2b$10$...', NULL, 'admin');

-- Insertar propiedades de ejemplo
INSERT INTO properties (title, description, city, address, type, operation, price, bedrooms, bathrooms, square_meters, agent_id) VALUES
('Piso luminoso en centro', 'Amplio piso reformado...', 'Madrid', 'Calle Gran Vía 123', 'apartment', 'sale', 350000, 3, 2, 120, 1),
('Chalet con jardín', 'Chalet independiente...', 'Barcelona', 'Av. Diagonal 456', 'house', 'sale', 650000, 4, 3, 220, 2);

```

## Diagrama Entidad-Relación

users
  |
  |---< properties (agent_id)
  |
  |---< visits (agent_id)

properties
  |
  |---< images (property_id)
  |
  |---< visits (property_id)

```

## Migraciones Futuras

### Migración 1: Añadir campo destacado a properties
ALTER TABLE properties ADD COLUMN featured BOOLEAN DEFAULT FALSE;

### Migración 2: Añadir campo rating a properties
ALTER TABLE properties ADD COLUMN rating DECIMAL(3,2) DEFAULT 0;

### Migración 3: Crear tabla de favoritos
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    property_id INTEGER REFERENCES properties(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

```

## Backup y Restauración

### Backup completo
pg_dump -U inmobiliaria_user -d inmobiliaria_db -f backup_$(date +%Y%m%d).sql

### Restaurar backup
psql -U inmobiliaria_user -d inmobiliaria_db -f backup_20240128.sql

```

## Estadísticas y Consultas Útiles

### Propiedades por ciudad
SELECT city, COUNT(*) as total FROM properties GROUP BY city ORDER BY total DESC;

### Precio promedio por tipo
SELECT type, AVG(price) as avg_price FROM properties GROUP BY type;

### Visitas por mes
SELECT DATE_TRUNC('month', visit_date) as mes, COUNT(*) as visitas 
FROM visits 
GROUP BY mes 
ORDER BY mes DESC;

```