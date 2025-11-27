import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getFeaturedProducts } from '../controllers/producto.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getProducts);
// NUEVA RUTA: Debe ir antes de /:id para que no haya conflictos
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;