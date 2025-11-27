import { Router } from 'express';
import { getResenasPorProducto, createResena } from '../controllers/resena.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Ruta pública para ver las reseñas de un producto
router.get('/:productId', getResenasPorProducto);

// Ruta protegida para crear una reseña
router.post('/:productId', verifyToken, createResena);

export default router;