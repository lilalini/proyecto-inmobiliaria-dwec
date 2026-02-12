# Guía de Instalación Completa - Inmobiliaria Apturist

## Requisitos Previos

**Software necesario:**
- Node.js 18.0 o superior
- PostgreSQL 15.0 o superior
- npm 9.0 o superior
- Git

**Verificar instalaciones:**
```bash
node --version
npm --version
psql --version
git --version
```

---

## Instalación Paso a Paso

### 1. Clonar el repositorio
```bash
git clone https://github.com/lilalini/proyecto-inmobiliaria-dwec.git
cd proyecto-inmobiliaria-dwec
```

### 2. Configurar Base de Datos PostgreSQL

**Acceder a PostgreSQL:**
```bash
psql -U postgres
```

**Crear base de datos y usuario:**
```sql
CREATE DATABASE inmobiliaria_db;
CREATE USER inmobiliaria_user WITH PASSWORD 'password_seguro';
GRANT ALL PRIVILEGES ON DATABASE inmobiliaria_db TO inmobiliaria_user;
\q
```

### 3. Ejecutar Scripts SQL
```bash
cd database
psql -U inmobiliaria_user -d inmobiliaria_db -f schema.sql
psql -U inmobiliaria_user -d inmobiliaria_db -f seed.sql
```

### 4. Configurar Variables de Entorno
```bash
cd backend
cp .env.example .env
```

**Editar el archivo `.env`:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inmobiliaria_db
DB_USER=inmobiliaria_user
DB_PASSWORD=tu_password
JWT_SECRET=tu_clave_secreta_jwt
PORT=5000
```

### 5. Instalar Dependencias

**Backend:**
```bash
cd backend
npm install

# Si hay error con bcrypt:
npm uninstall bcrypt
npm install bcryptjs
```

**Frontend:**
```bash
cd ../inmobiliaria-frontend
npm install

# Dependencias específicas del proyecto:
npm install recharts react-datepicker date-fns axios react-router-dom

# Tailwind CSS:
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 6. Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd inmobiliaria-frontend
npm run dev
```

---

## Acceso a la Aplicación

## Acceso a la Aplicación

- **Frontend:** http://localhost:5173
- **Panel de Administración:** http://localhost:5173/admin
- **Verificar Backend:** http://localhost:5000/api/properties
- **Verificar Visitas:** http://localhost:5000/api/visits

> **Nota:** La ruta raíz http://localhost:5000 no tiene contenido. Usa `/api/properties` para verificar la conexión.

### Credenciales de acceso

**Usuario administrador:**
```
Email: carlos.rodriguez@apturist.com
Contraseña: admin123
```

**Para crear nuevos usuarios:**
1. Accede al panel de administración
2. Ve a Gestión de Usuarios
3. Crea nuevo usuario con rol deseado

---

## Solución de Problemas Comunes

### Error de conexión a PostgreSQL

**Linux:**
```bash
sudo service postgresql status
```

**macOS:**
```bash
brew services list | grep postgres
```

**Windows:**
```
Abrir Services (services.msc) → Buscar PostgreSQL → Iniciar servicio
```

### Error de puertos en uso
```bash
# Windows
netstat -ano | findstr :5173
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5173
lsof -i :5000
```

### Dependencias faltantes
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## Verificación de Instalación

**1. Backend:** Visita http://localhost:5000/api/properties  
**2. Frontend:** Visita http://localhost:5173  
**3. Base de datos:** 
```bash
psql -U inmobiliaria_user -d inmobiliaria_db -c "SELECT COUNT(*) FROM properties;"
```

**Todo correcto si ves:**  
- Propiedades en la API
- Página web sin errores
- Número de propiedades > 0 en BD

---

© 2026 Apturist Inmobiliaria - v1.0.0