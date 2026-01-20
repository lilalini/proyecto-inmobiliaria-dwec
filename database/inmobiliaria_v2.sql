-- ============================================
-- BLOQUE 1: CREAR NUEVA BASE DE DATOS
-- ============================================
-- Ejecutar primero en postgres DB o desde terminal

CREATE DATABASE inmobiliaria_v2;

-- Conectarse manualmente a 'inmobiliaria_v2' en pgAdmin
-- Luego ejecutar todo lo siguiente desde esa conexión

-- Extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BLOQUE 2: TABLAS PRINCIPALES (CON MEJORAS)
-- ============================================

-- 2.1. Tabla de características (SIN CAMBIOS)
CREATE TABLE features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    category VARCHAR(50)
);

-- 2.2. Tabla de usuarios/agentes (SIN CAMBIOS)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'agent' CHECK (role IN ('admin', 'agent', 'manager')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.3. Tabla de clientes (SIN CAMBIOS)
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    type VARCHAR(20) DEFAULT 'buyer' CHECK (type IN ('buyer', 'seller', 'tenant', 'landlord')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.4. Tabla de propiedades (CAMBIADO: id POR serial)
CREATE TABLE properties (
    serial SERIAL PRIMARY KEY,  -- CAMBIO AQUÍ
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('apartment', 'house', 'commercial', 'office', 'land', 'chalet', 'penthouse')),
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('sale', 'rent', 'sale_rent')),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    price DECIMAL(12,2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    area DECIMAL(8,2),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'rented', 'inactive')),
    featured BOOLEAN DEFAULT false,
    agent_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.5. NUEVA TABLA: Imágenes para propiedades (MÚLTIPLES IMÁGENES)
CREATE TABLE property_images (
    id SERIAL PRIMARY KEY,
    property_serial INTEGER REFERENCES properties(serial) ON DELETE CASCADE,  -- RELACIÓN CON serial
    image_url VARCHAR(500) NOT NULL,
    image_order INTEGER DEFAULT 0,
    is_main BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(200)
);

-- 2.6. Tabla de relación propiedad-características (AJUSTADA)
CREATE TABLE property_features (
    property_serial INTEGER REFERENCES properties(serial) ON DELETE CASCADE,  -- CAMBIO AQUÍ
    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,
    PRIMARY KEY (property_serial, feature_id)
);

-- 2.7. Tabla de visitas/calendario (AJUSTADA)
CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    property_serial INTEGER REFERENCES properties(serial) ON DELETE CASCADE,  -- CAMBIO AQUÍ
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    visit_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- BLOQUE 3: TABLAS DE SOPORTE (AJUSTADAS)
-- ============================================

-- 3.1. Tabla de auditoría (AJUSTADA)
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.2. Tabla de historial de precios (AJUSTADA)
CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    property_serial INTEGER REFERENCES properties(serial) ON DELETE CASCADE,  -- CAMBIO AQUÍ
    old_price DECIMAL(12,2),
    new_price DECIMAL(12,2),
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by INTEGER REFERENCES users(id),
    reason VARCHAR(200)
);

-- ============================================
-- BLOQUE 4: FUNCIONES BÁSICAS (AJUSTADAS)
-- ============================================

-- 4.1. Función para actualizar updated_at automáticamente (SIN CAMBIOS)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 4.2. Función de búsqueda de propiedades (AJUSTADA para serial)

CREATE OR REPLACE FUNCTION search_properties(
    p_city VARCHAR DEFAULT NULL,
    p_type VARCHAR DEFAULT NULL,
    p_operation VARCHAR DEFAULT NULL,
    p_min_price DECIMAL DEFAULT 0,
    p_max_price DECIMAL DEFAULT 999999999,
    p_min_bedrooms INTEGER DEFAULT 0
)
RETURNS TABLE(
    serial INTEGER,
    title VARCHAR,
    type VARCHAR,
    operation VARCHAR,
    city VARCHAR,
    price DECIMAL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area DECIMAL,
    status VARCHAR,
    main_image_url VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.serial,
        p.title,
        p.type,
        p.operation,
        p.city,
        p.price,
        p.bedrooms,
        p.bathrooms,
        p.area,
        p.status,
        (SELECT image_url FROM property_images 
         WHERE property_serial = p.serial AND is_main = true 
         LIMIT 1) as main_image_url
    FROM properties p
    WHERE p.status = 'available'
        AND (p_city IS NULL OR p_city = '' OR p.city ILIKE '%' || p_city || '%')
        AND (p_type IS NULL OR p.type = p_type)
        AND (p_operation IS NULL OR p.operation = p_operation)
        AND p.price BETWEEN p_min_price AND p_max_price
        AND p.bedrooms >= p_min_bedrooms
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Verifico que la función se creó
SELECT '✅ Función search_properties recreada correctamente' AS mensaje;


-- 4.3. Función de estadísticas por ciudad (AJUSTADA)
CREATE OR REPLACE FUNCTION get_property_stats_by_city()
RETURNS TABLE(
    city VARCHAR,
    total_properties INTEGER,
    avg_price DECIMAL,
    min_price DECIMAL,
    max_price DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.city,
        COUNT(*)::INTEGER as total_properties,
        ROUND(AVG(p.price)::numeric, 2) as avg_price,
        MIN(p.price) as min_price,
        MAX(p.price) as max_price
    FROM properties p
    WHERE p.status = 'available'
    GROUP BY p.city
    ORDER BY total_properties DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- BLOQUE 5: FUNCIONES DE VALIDACIÓN Y AUDITORÍA (SIN CAMBIOS)
-- ============================================

-- 5.1. Función de validación de visitas (SIN CAMBIOS)
CREATE OR REPLACE FUNCTION validate_visit_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.visit_date < CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'La fecha de visita no puede ser en el pasado';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM visits 
        WHERE property_serial = NEW.property_serial  -- CAMBIO AQUÍ
        AND id != COALESCE(NEW.id, -1)
        AND status != 'cancelled'
        AND visit_date <= NEW.visit_date + INTERVAL '1 hour'
        AND visit_date + INTERVAL '1 hour' >= NEW.visit_date
    ) THEN
        RAISE EXCEPTION 'Ya existe una visita programada para esta propiedad en ese horario';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5.2. Función de auditoría genérica 
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    record_id_value INTEGER;
BEGIN
    -- Determinar el ID según la tabla
    IF TG_TABLE_NAME = 'properties' THEN
        record_id_value := NEW.serial;
    ELSE
        record_id_value := NEW.id;
    END IF;
    
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_log (table_name, record_id, action, new_values)
        VALUES (TG_TABLE_NAME, record_id_value, 'INSERT', to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values)
        VALUES (TG_TABLE_NAME, record_id_value, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        -- Para DELETE, necesitamos usar OLD
        IF TG_TABLE_NAME = 'properties' THEN
            record_id_value := OLD.serial;
        ELSE
            record_id_value := OLD.id;
        END IF;
        
        INSERT INTO audit_log (table_name, record_id, action, old_values)
        VALUES (TG_TABLE_NAME, record_id_value, 'DELETE', to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 5.3. Función para registrar cambios de precio (AJUSTADA)
CREATE OR REPLACE FUNCTION log_price_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.price IS DISTINCT FROM NEW.price AND NEW.price IS NOT NULL THEN
        INSERT INTO price_history (property_serial, old_price, new_price, reason)
        VALUES (NEW.serial, OLD.price, NEW.price, 'Actualización de precio');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- BLOQUE 6: TRIGGERS (AJUSTADOS)
-- ============================================

-- 6.1. Trigger para actualizar timestamp de propiedades (SIN CAMBIOS)
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6.2. Trigger para validar visitas (SIN CAMBIOS)
CREATE TRIGGER validate_visit_date_trigger
    BEFORE INSERT OR UPDATE ON visits
    FOR EACH ROW
    EXECUTE FUNCTION validate_visit_date();

	-- Vuelvo a crear los triggers
CREATE TRIGGER audit_properties_trigger
    AFTER INSERT OR UPDATE OR DELETE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_clients_trigger
    AFTER INSERT OR UPDATE OR DELETE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();


-- 6.5. Trigger para registrar cambios de precio (SIN CAMBIOS)
CREATE TRIGGER log_price_change_trigger
    AFTER UPDATE OF price ON properties
    FOR EACH ROW
    EXECUTE FUNCTION log_price_change();

-- ============================================
-- BLOQUE 7: NUEVAS FUNCIONES PARA IMÁGENES
-- ============================================

-- 7.1. Función para obtener propiedades con imágenes
CREATE OR REPLACE FUNCTION get_property_with_images(p_serial INTEGER)
RETURNS TABLE(
    serial INTEGER,
    title VARCHAR,
    type VARCHAR,
    operation VARCHAR,
    city VARCHAR,
    price DECIMAL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    status VARCHAR,
    main_image VARCHAR,
    all_images TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.serial,
        p.title,
        p.type,
        p.operation,
        p.city,
        p.price,
        p.bedrooms,
        p.bathrooms,
        p.status,
        (SELECT image_url FROM property_images 
         WHERE property_serial = p.serial AND is_main = true 
         LIMIT 1) as main_image,
        ARRAY_AGG(pi.image_url ORDER BY pi.image_order) as all_images
    FROM properties p
    LEFT JOIN property_images pi ON p.serial = pi.property_serial
    WHERE p.serial = p_serial
    GROUP BY p.serial, p.title, p.type, p.operation, p.city, 
             p.price, p.bedrooms, p.bathrooms, p.status;
END;
$$ LANGUAGE plpgsql;

-- 7.2. Función para establecer imagen principal
CREATE OR REPLACE FUNCTION set_main_image(
    p_property_serial INTEGER,
    p_image_id INTEGER
)
RETURNS VOID AS $$
BEGIN
    -- Primero quitar todas las imágenes principales
    UPDATE property_images 
    SET is_main = false 
    WHERE property_serial = p_property_serial;
    
    -- Establecer la nueva imagen principal
    UPDATE property_images 
    SET is_main = true 
    WHERE id = p_image_id AND property_serial = p_property_serial;
END;
$$ LANGUAGE plpgsql;

-- 7.3. Función para contar imágenes por propiedad
CREATE OR REPLACE FUNCTION count_property_images(p_property_serial INTEGER)
RETURNS INTEGER AS $$
DECLARE
    image_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO image_count
    FROM property_images 
    WHERE property_serial = p_property_serial;
    
    RETURN COALESCE(image_count, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- BLOQUE 8: VISTAS ÚTILES
-- ============================================

-- 8.1. Vista para propiedades con imagen principal
CREATE VIEW properties_with_main_image AS
SELECT 
    p.*,
    (SELECT image_url FROM property_images 
     WHERE property_serial = p.serial AND is_main = true 
     LIMIT 1) as main_image_url,
    (SELECT COUNT(*) FROM property_images 
     WHERE property_serial = p.serial) as total_images
FROM properties p;

-- 8.2. Vista para propiedades destacadas con imagen
CREATE VIEW featured_properties_with_images AS
SELECT 
    p.serial,
    p.title,
    p.city,
    p.price,
    p.type,
    p.operation,
    p.bedrooms,
    p.bathrooms,
    pi.image_url as main_image
FROM properties p
LEFT JOIN property_images pi ON p.serial = pi.property_serial AND pi.is_main = true
WHERE p.featured = true AND p.status = 'available'
ORDER BY p.created_at DESC;

-- ============================================
-- BLOQUE 9: DATOS DE PRUEBA (AJUSTADOS)
-- ============================================

-- 9.1. Insertar características
INSERT INTO features (name, icon, category) VALUES
('Piscina', 'pool', 'exterior'),
('Garaje', 'garage', 'parking'),
('Jardín', 'garden', 'exterior'),
('Terraza', 'terrace', 'exterior'),
('Ascensor', 'elevator', 'comodidad'),
('Calefacción', 'heating', 'climatización'),
('Aire acondicionado', 'ac', 'climatización'),
('Amueblado', 'furnished', 'equipamiento');

-- 9.2. Insertar usuarios/agentes
INSERT INTO users (name, email, password, role) VALUES
('Admin Principal', 'admin@inmobiliaria.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeAJsK8V4.1H8W7xLc5U7Jp2lWEbH4zO6', 'admin'),
('Laura Agente', 'laura@inmobiliaria.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeAJsK8V4.1H8W7xLc5U7Jp2lWEbH4zO6', 'agent'),
('Pedro Manager', 'pedro@inmobiliaria.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeAJsK8V4.1H8W7xLc5U7Jp2lWEbH4zO6', 'manager');

-- 9.3. Insertar clientes
INSERT INTO clients (name, email, phone, type) VALUES
('María González', 'maria.gonzalez@email.com', '+34 612 345 678', 'buyer'),
('Carlos Ruiz', 'carlos.ruiz@email.com', '+34 623 456 789', 'seller'),
('Ana Martínez', 'ana.martinez@email.com', '+34 634 567 890', 'tenant'),
('David López', 'david.lopez@email.com', '+34 645 678 901', 'landlord');

-- 9.4. Insertar propiedades (ahora con serial automático)
INSERT INTO properties (title, description, type, operation, address, city, price, bedrooms, bathrooms, area, featured, agent_id) VALUES
('Ático de lujo con piscina', 'Increíble ático con vistas panorámicas y piscina privada en azotea.', 'penthouse', 'sale', 'Paseo de la Castellana 100', 'Madrid', 850000, 4, 3, 180, true, 2),
('Piso reformado en centro histórico', 'Piso completamente reformado en el casco antiguo, listo para entrar a vivir.', 'apartment', 'sale', 'Calle Mayor 45', 'Sevilla', 195000, 3, 2, 95, false, 2),
('Chalet con jardín en urbanización', 'Chalet independiente con jardín privado y garaje para 2 coches.', 'house', 'sale', 'Calle de los Pinos 23', 'Valencia', 320000, 4, 3, 150, true, 3);

/*-- 9.5. Insertar imágenes para propiedades
INSERT INTO property_images (property_serial, image_url, image_order, is_main, description) VALUES
(1, 'https://ejemplo.com/atico-fachada.jpg', 1, true, 'Fachada del ático'),
(1, 'https://ejemplo.com/atico-salon.jpg', 2, false, 'Salón principal'),
(1, 'https://ejemplo.com/atico-piscina.jpg', 3, false, 'Piscina en azotea'),
(2, 'https://ejemplo.com/piso-cocina.jpg', 1, true, 'Cocina reformada'),
(2, 'https://ejemplo.com/piso-dormitorio.jpg', 2, false, 'Dormitorio principal'),
(3, 'https://ejemplo.com/chalet-jardin.jpg', 1, true, 'Jardín privado'),
(3, 'https://ejemplo.com/chalet-garaje.jpg', 2, false, 'Garaje doble');*/

-- 9.6. Asociar características a propiedades
INSERT INTO property_features (property_serial, feature_id) VALUES
(1, 1), (1, 2), (1, 4),
(2, 5), (2, 6), (2, 7),
(3, 2), (3, 3), (3, 8);

--PARA VER LOS ID
SELECT id, name FROM clients;

-- 9.7. Insertar visitas con los IDs CORRECTOS (5 y 6)
INSERT INTO visits (property_serial, client_id, visit_date, status, notes) VALUES
(1, 5, CURRENT_TIMESTAMP + INTERVAL '2 days', 'scheduled', 'Interesado en la piscina'),
(2, 6, CURRENT_TIMESTAMP + INTERVAL '3 days', 'scheduled', 'Necesita financiación');

SELECT '✅ Visitas insertadas con IDs correctos (5 y 6)' AS mensaje;

-- ============================================
-- BLOQUE 10: ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_agent ON properties(agent_id);
CREATE INDEX idx_property_images_property ON property_images(property_serial);
CREATE INDEX idx_property_images_main ON property_images(property_serial, is_main);
CREATE INDEX idx_visits_property ON visits(property_serial);
CREATE INDEX idx_visits_date ON visits(visit_date);
CREATE INDEX idx_property_features_property ON property_features(property_serial);

SELECT '✅ Índices creados correctamente' AS mensaje;


-- ============================================
-- BLOQUE 11: VERIFICACIÓN FINAL
-- ============================================

SELECT 'BASE DE DATOS inmobiliaria_v2 CREADA EXITOSAMENTE' AS mensaje;
SELECT 'Tablas creadas:' AS resumen;
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = t.table_name) AS columnas
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- Probar que todo funciona
SELECT 'Funciones de imágenes funcionando:' AS prueba;
-- Verificar datos
SELECT '✅ Resumen de datos:' AS resumen;
SELECT 
    (SELECT COUNT(*) FROM properties) AS propiedades,
    (SELECT COUNT(*) FROM clients) AS clientes,
    (SELECT COUNT(*) FROM visits) AS visitas,
    (SELECT COUNT(*) FROM property_features) AS caracteristicas_asignadas;

	-- Probar funciones básicas
SELECT 'Búsqueda funcionando:' AS prueba;
SELECT serial, title, city, price FROM search_properties('Madrid');

SELECT 'Estadísticas funcionando:' AS prueba;
SELECT * FROM get_property_stats_by_city();
SELECT count_property_images(1) AS total_imagenes_propiedad_1;
SELECT 'BASE DE DATOS COMPLETA Y FUNCIONAL' AS mensaje_final;

--SELECT * FROM get_property_with_images(1);