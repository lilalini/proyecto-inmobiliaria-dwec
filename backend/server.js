import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importa las rutas de propiedades
import propertyRoutes from './src/routes/propertyRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ruta de health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Ruta test (puedes eliminarla luego)
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// RUTAS PRINCIPALES DE LA API
app.use('/api/properties', propertyRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Properties: http://localhost:${PORT}/api/properties`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});