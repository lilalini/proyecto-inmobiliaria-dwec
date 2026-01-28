# Guía de Instalación Completa

## Requisitos Previos

### Software necesario:
- Node.js 18.0 o superior
- PostgreSQL 15.0 o superior  
- npm 9.0 o superior
- Git

### Verificar instalaciones:
node --version
npm --version
psql --version
git --version

```

## Instalación Paso a Paso

### 1. Clonar el repositorio
git clone https://github.com/lilalini/proyecto-inmobiliaria-dwec.git
cd proyecto-inmobiliaria-dwec

```

### 2. Configurar Base de Datos PostgreSQL

Acceder a PostgreSQL:
sudo -u postgres psql

```

Crear base de datos y usuario:
CREATE DATABASE inmobiliaria_db;
CREATE USER inmobiliaria_user WITH PASSWORD 'password_seguro';
GRANT ALL PRIVILEGES ON DATABASE inmobiliaria_db TO inmobiliaria_user;
\q

```

### 3. Ejecutar Scripts SQL
cd database
psql -U inmobiliaria_user -d inmobiliaria_db -f schema.sql
psql -U inmobiliaria_user -d inmobiliaria_db -f seed.sql

```

### 4. Configurar Variables de Entorno
cd backend
cp .env.example .env

```

Editar el archivo .env con estos valores:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inmobiliaria_db
DB_USER=inmobiliaria_user
DB_PASSWORD=tu_password
JWT_SECRET=tu_clave_secreta_jwt
PORT=5000

```

### 5. Instalar Dependencias

Backend:
cd backend
npm install

```

Frontend:
cd ../inmobiliaria-frontend
npm install

```

### 6. Ejecutar la Aplicación

Terminal 1 - Backend:
cd backend
npm run dev

```

Terminal 2 - Frontend:
cd inmobiliaria-frontend
npm run dev

```

## Acceso a la Aplicación

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api

```

## Solución de Problemas Comunes

### Error de conexión a PostgreSQL

Linux:
sudo service postgresql status

```

macOS:
brew services list | grep postgres

```

Windows: Abrir Services (services.msc) y buscar PostgreSQL

```

### Error de puertos en uso
netstat -ano | findstr :5173
netstat -ano | findstr :5000

```

### Dependencias faltantes
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

```

## Verificación de Instalación

Para confirmar que todo funciona correctamente:

Backend: Visita http://localhost:5000/api/properties
Frontend: Visita http://localhost:5173
Base de datos: Conéctate con psql -U inmobiliaria_user -d inmobiliaria_db

Si ves propiedades en la API y la página web carga sin errores, la instalación es correcta.