# Despliegue

>**Nota importante:** Esta guía es teórica. 

## Opción Recomendada: Railway + Vercel

### 1. Backend en Railway

```bash
# Pasos estimados:
1. Crear cuenta en https://railway.app (GitHub)
2. New Project → Deploy from GitHub
3. Seleccionar repositorio (backend)
4. Add → Database → PostgreSQL
5. Railway genera variables automáticamente
6. Configurar variables de entorno:
   - JWT_SECRET=generar_clave_segura
   - NODE_ENV=production
```

### 2. Frontend en Vercel

```bash
# Pasos estimados:
1. Crear cuenta en https://vercel.com
2. Import Project → Desde GitHub
3. Seleccionar carpeta: inmobiliaria-frontend
4. Configurar:
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
5. Añadir variable:
   - VITE_API_URL=https://tu-backend.railway.app/api
6. Deploy
```

---

## Variables de Entorno

**Backend (.env):**
```
DB_HOST=postgres.railway.internal
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=generado_automaticamente
JWT_SECRET=clave_secreta_fuerte_aqui
NODE_ENV=production
CORS_ORIGIN=https://tu-frontend.vercel.app
PORT=8080
```

**Frontend (.env.production):**
```
VITE_API_URL=https://tu-backend.railway.app/api
```

---

## URLs Previstas

| Servicio | URL |
|----------|-----|
| Frontend | https://inmobiliaria-apturist.vercel.app |
| Backend API | https://inmobiliaria-backend.railway.app |
| API Propiedades | https://inmobiliaria-backend.railway.app/api/properties |

---

## Verificación

```bash
# Comprobar backend
curl https://tu-backend.railway.app/api/properties

# Comprobar frontend
# Abrir navegador en https://tu-frontend.vercel.app
```

---

## Posibles Problemas

1. **CORS:** Configurar backend para aceptar dominio de Vercel
2. **Variables de entorno:** Verificar nombres exactos
3. **Base de datos:** Railway asigna credenciales dinámicas
4. **Build:** Asegurar que Vite compila correctamente

---

## Nota

Esta guía es **orientativa**. Para un despliegue real se recomienda:
1. Seguir la documentación oficial de Railway y Vercel
2. Probar en entorno de desarrollo primero
3. Configurar dominio personalizado (opcional)

---

© 2026 Apturist Inmobiliaria - v2.0.0