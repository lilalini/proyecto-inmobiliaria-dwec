# Proyecto Inmobiliaria - Sistema Full-Stack

Aplicación web completa para la gestión, visualización y administración de propiedades inmobiliarias. Incluye un catálogo público con filtros avanzados y un panel de administración.

## Tecnologías

**Frontend:** React 18, TypeScript, Tailwind CSS, React Router, Axios  
**Backend:** Node.js, Express, PostgreSQL  
**Base de Datos:** PostgreSQL con esquema relacional completo

## Características Implementadas

*   Catálogo público de propiedades con filtros avanzados (ciudad, tipo, precio, búsqueda textual)
*   Páginas de detalle con galería de imágenes interactiva
*   API RESTful completa con Express y PostgreSQL
*   Base de datos con 9 tablas normalizadas (propiedades, imágenes, usuarios, visitas, clientes, etc.)
*   Diseño responsive construido con Tailwind CSS
*   Sistema de navegación completo con React Router

## Estructura del Proyecto
```
proyecto-inmobiliaria-dwec/
├── inmobiliaria-frontend/ # Aplicación React
├── backend/ # API Express
├── database/ # Scripts SQL
├── docs/ # Documentación
├── LICENSE
└── README.md
```
## Instalación Rápida

1.  Clonar repositorio: `git clone https://github.com/lilalini/proyecto-inmobiliaria-dwec.git`
2.  Configurar base de datos PostgreSQL (ver scripts en `/database`)
3.  Instalar dependencias: `npm install` en `/backend` y `/inmobiliaria-frontend`
4.  Ejecutar: `npm run dev` en ambas carpetas

Frontend disponible en `http://localhost:5173`. API disponible en `http://localhost:5000/api`.

## Estado del Proyecto

El sistema base está completamente funcional. El backend sirve una API REST, el frontend consume los datos y muestra un catálogo interactivo con filtros. La base de datos contiene datos de ejemplo realistas.

## Documentación

Para la documentación técnica detallada, incluyendo guía de instalación completa, referencia de la API y diagramas de base de datos, consulta la carpeta `/docs`.

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
