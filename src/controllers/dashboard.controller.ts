import { Request, Response } from 'express';
import { Producto } from '../models/producto.model';
import { Categoria } from '../models/categoria.model';
import { Orden } from '../models/orden.model';

// Límite para productos con bajo stock
const LOW_STOCK_THRESHOLD = 5;

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // Realizamos todas las consultas a la base de datos en paralelo para mayor eficiencia
        const [
            totalProducts,
            totalCategories,
            lowStockProducts,
            recentOrders
        ] = await Promise.all([
            Producto.countDocuments(),
            Categoria.countDocuments(),
            Producto.find({ stock: { $lte: LOW_STOCK_THRESHOLD } }).sort({ stock: 'asc' }),
            Orden.find()
                .sort({ createdAt: -1 }) // -1 para orden descendente (los más nuevos primero)
                .limit(5) // Obtenemos solo los últimos 5 pedidos
                .populate('cliente', 'nombre') // Traemos el nombre del cliente
        ]);

        // Enviamos todos los datos en un solo objeto JSON
        res.json({
            totalProducts,
            totalCategories,
            lowStockProducts,
            recentOrders
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: 'Error al obtener las estadísticas del dashboard.' });
    }
};