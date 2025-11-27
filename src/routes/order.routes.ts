import { Router } from 'express';
import { 
    createOrder, 
    getMyOrders, 
    getOrderById, 
    processPayment,
    getAllOrders,       // <-- NUEVA IMPORTACIÓN
    updateOrderStatus   // <-- NUEVA IMPORTACIÓN
} from '../controllers/order.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Rutas para clientes
router.post('/create', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getMyOrders);
router.get('/:id', verifyToken, getOrderById);
router.post('/:id/pay', verifyToken, processPayment);

// Rutas para administradores
router.get('/admin/all', verifyToken, isAdmin, getAllOrders);
router.put('/admin/:id/status', verifyToken, isAdmin, updateOrderStatus);

export default router;