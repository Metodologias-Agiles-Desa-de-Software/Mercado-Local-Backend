import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Protegemos la ruta para que solo los administradores puedan acceder a las estadísticas
router.get('/', verifyToken, isAdmin, getDashboardStats);

export default router;