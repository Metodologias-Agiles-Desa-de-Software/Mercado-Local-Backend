// =======================================================================
// ARCHIVO 9 (NUEVO): src/routes/categoria.routes.ts
// =======================================================================
import { Router as CategoriaRouter } from 'express';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../controllers/categoria.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = CategoriaRouter();
router.get('/', getCategorias);
router.post('/', verifyToken, isAdmin, createCategoria);
router.put('/:id', verifyToken, isAdmin, updateCategoria);
router.delete('/:id', verifyToken, isAdmin, deleteCategoria);
export default router;