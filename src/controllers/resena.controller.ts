import { Request, Response } from 'express';
import { Resena } from '../models/resena.model';
import { Producto } from '../models/producto.model';
import { Orden } from '../models/orden.model';

// Obtener todas las reseñas de un producto
export const getResenasPorProducto = async (req: Request, res: Response) => {
    try {
        const resenas = await Resena.find({ producto: req.params.productId }).sort({ createdAt: -1 });
        res.json(resenas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las reseñas.' });
    }
};

// Crear una nueva reseña
export const createResena = async (req: Request, res: Response) => {
    try {
        const { calificacion, comentario } = req.body;
        const { productId } = req.params;
        const usuarioId = req.userId;
        const nombreUsuario = req.user?.nombre || 'Anónimo'; // Obtenemos el nombre del usuario del token

        // 1. Verificar si el usuario ya ha dejado una reseña para este producto
        const resenaExistente = await Resena.findOne({ producto: productId, usuario: usuarioId });
        if (resenaExistente) {
            return res.status(400).json({ message: 'Ya has dejado una reseña para este producto.' });
        }

        // 2. Verificar si el usuario ha comprado este producto
        const ordenDeCompra = await Orden.findOne({
            cliente: usuarioId,
            'items.producto': productId,
            estado: 'pagado' // O 'entregado', según tu lógica de negocio
        });
        if (!ordenDeCompra) {
            return res.status(403).json({ message: 'Debes haber comprado este producto para poder dejar una reseña.' });
        }
        
        // 3. Crear y guardar la nueva reseña
        const nuevaResena = new Resena({
            producto: productId,
            usuario: usuarioId,
            nombreUsuario,
            calificacion,
            comentario
        });
        await nuevaResena.save();

        // 4. Actualizar la calificación promedio del producto
        const resenasDelProducto = await Resena.find({ producto: productId });
        const numeroDeResenas = resenasDelProducto.length;
        const calificacionPromedio = resenasDelProducto.reduce((acc, item) => item.calificacion + acc, 0) / numeroDeResenas;

        await Producto.findByIdAndUpdate(productId, {
            numeroDeResenas,
            calificacionPromedio: calificacionPromedio.toFixed(1) // Redondear a un decimal
        });

        res.status(201).json(nuevaResena);

    } catch (error) {
        res.status(500).json({ message: 'Error al crear la reseña.' });
    }
};