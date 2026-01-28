# Despliegue Simplificado

## Opción Recomendada: Railway (el más fácil)

### 1. Backend en Railway
1. Ve a https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Selecciona tu repositorio
4. Añade base de datos: "Add" → "Database" → "PostgreSQL"
5. Railway conecta todo automáticamente

```

### 2. Frontend en Vercel (gratis)
1. Ve a https://vercel.com
2. "Import Project" desde GitHub
3. Selecciona la carpeta `inmobiliaria-frontend`
4. Configura:
   - Framework: Vite
   - Build Command: npm run build
   - Output Directory: dist
5. Despliega

```

## Variables de Entorno (las necesarias)

En Railway (backend):
DB_HOST=postgres
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=(lo da Railway automático)
JWT_SECRET=tu_clave_secreta_aqui
NODE_ENV=production
CORS_ORIGIN=https://tufrontend.vercel.app

```

En Vercel (frontend):
VITE_API_URL=https://turailwayapp.railway.app/api

```

## URLs Finales
- Frontend: https://tunombre.vercel.app
- Backend: https://tunombre.railway.app
- API: https://tunombre.railway.app/api/properties

```

## Verificar que Funciona
1. Visita tu frontend en Vercel
2. Deberías ver las propiedades
3. Los filtros deberían funcionar
4. Los detalles de propiedad deberían cargar

```

## Si algo falla:
1. Revisa logs en Railway dashboard
2. Revisa logs en Vercel dashboard
3. Verifica que las variables de entorno están correctas

```

## Backup Simple
Para hacer backup de la base de datos en Railway:
1. Ve a tu proyecto en Railway
2. Click en la base de datos PostgreSQL
3. "Data" → "Backups"
4. "Create Backup"

```