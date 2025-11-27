import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuario.model'; // Importamos el modelo de usuario

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRol?: 'cliente' | 'admin';
      user?: { nombre: string }; // <-- NUEVO CAMPO
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ message: 'Acceso denegado, token requerido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, rol: 'cliente' | 'admin' };
    
    // Buscamos al usuario para obtener su nombre
    const user = await Usuario.findById(decoded.id).select('nombre');
    if (!user) {
        return res.status(404).json({ message: 'Usuario del token no encontrado.' });
    }

    req.userId = decoded.id;
    req.userRol = decoded.rol;
    req.user = { nombre: user.nombre }; // Guardamos el nombre del usuario
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.userRol === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Requiere permisos de administrador.' });
    }
};