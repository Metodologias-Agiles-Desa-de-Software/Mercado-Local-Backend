import { Router } from 'express';
import { 
    updateUserProfile, 
    changePassword,
    getWishlist,
    toggleWishlist
} from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas para el perfil del usuario
router.put('/profile', verifyToken, updateUserProfile);
router.put('/change-password', verifyToken, changePassword);

// Rutas para la lista de deseos
router.get('/wishlist', verifyToken, getWishlist);
router.post('/wishlist/toggle', verifyToken, toggleWishlist);

export default router;