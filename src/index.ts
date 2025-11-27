import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/producto.routes';
import orderRoutes from './routes/order.routes';
import categoriaRoutes from './routes/categoria.routes';
import dashboardRoutes from './routes/dashboard.routes';
import userRoutes from './routes/user.routes';
import resenaRoutes from './routes/resena.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("FATAL ERROR: Missing environment variables.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a la base de datos MongoDB'))
  .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));

const allowedOrigins = [
  'https://mercadolocal-frontend.vercel.app',
  'http://localhost:5173'
];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS Error: El origen ${origin} no está permitido.`);
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/resenas', resenaRoutes);

app.get('/api', (req: Request, res: Response) => {
  res.send('¡API de MercadoLocal funcionando! 🚀');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '¡Algo salió mal en el servidor!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
