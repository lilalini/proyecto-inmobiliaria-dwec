# Inmobiliaria Apturist - Sistema de Gestión Inmobiliaria

Sistema web para gestión inmobiliaria con panel de administración, reportes estadísticos y valoración de propiedades.

---

## Características Principales

### Sitio Público
- Página principal con propiedades destacadas
- Búsqueda y filtrado de propiedades
- Valoración gratuita de propiedades
- Soporte multiidioma (ES/EN/FR)

### Panel de Administración
- Dashboard con métricas en tiempo real
- Gestión CRUD de propiedades, clientes y visitas
- Calendario de visitas interactivo
- Reportes con gráficos (Recharts)
- Exportación de datos a CSV
- Autenticación JWT

---

## Tecnologías Utilizadas

| Capa | Tecnologías |
|------|-------------|
| Frontend | React, TypeScript, Tailwind CSS, Recharts, Axios |
| Backend | Node.js, Express, PostgreSQL, JWT, Bcryptjs |
| Base de Datos | PostgreSQL |
| Herramientas | Git, npm |

---

## Estructura del Proyecto

```
inmobiliaria_v2/
├── backend/                 # API REST
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── models/
│   └── server.js
│
└── inmobiliaria-frontend/  # React App
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.tsx
    │   │   ├── AdminPage.tsx
    │   │   ├── ReportsPage.tsx
    │   │   ├── ValuationPage.tsx
    │   │   └── LoginPage.tsx
    │   └── services/
    └── package.json
```

---

## Instalación Rápida

```bash
# 1. Clonar repositorio
git clone https://github.com/lilalini/proyecto-inmobiliaria-dwec.git
cd proyecto-inmobiliaria-dwec

# 2. Base de datos
psql -U postgres -c "CREATE DATABASE inmobiliaria_db;"
cd database
psql -U postgres -d inmobiliaria_db -f schema.sql
psql -U postgres -d inmobiliaria_db -f seed.sql

# 3. Backend
cd ../backend
cp .env.example .env
npm install
npm run dev

# 4. Frontend (nueva terminal)
cd ../inmobiliaria-frontend
npm install
npm install recharts react-datepicker date-fns axios react-router-dom
npm run dev
```

**Credenciales:**
- Admin: carlos.rodriguez@apturist.com / admin123

---

## Acceso a la Aplicación

| Recurso | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Panel Admin | http://localhost:5173/admin |
| Valoración | http://localhost:5173/valoracion |
| API Propiedades | http://localhost:5000/api/properties |

---

## API Endpoints Principales

```
POST   /api/auth/login
GET    /api/properties
POST   /api/properties
GET    /api/visits
POST   /api/visits
GET    /api/reports/dashboard
GET    /api/reports/visits
GET    /api/reports/clients
GET    /api/reports/properties
```

---

## Documentación

La documentación se encuentra en la carpeta `/docs`:
- `instalacion.md` - Guía de instalación
- `api-reference.md` - Endpoints detallados
- `database.md` - Esquema y scripts SQL
- `despliegue.md` - Guía de despliegue (en desarrollo)

**Nota:** El manual de usuario está integrado en la interfaz de la aplicación.

---

## Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ para el sector inmobiliario**  
© 2026 Apturist Inmobiliaria - v2.0.0

[⬆ Volver arriba](#inmobiliaria-apturist---sistema-de-gestión-inmobiliaria)