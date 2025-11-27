// =======================================================================
// ARCHIVO: controllers/producto.controller.ts
// DESCRIPCIÓN: Versión final y estable que procesa correctamente todos
//              los filtros y opciones de ordenamiento desde la API.
// =======================================================================
import { Request, Response } from 'express';
import { Producto } from '../models/producto.model';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const { searchTerm, category, priceMin, priceMax, minRating, sortBy } = req.query;

        const query: any = {};
        
        if (searchTerm) {
            query.nombre = { $regex: searchTerm, $options: 'i' };
        }
        if (category) {
            query.categoria = category;
        }
        if (priceMin || priceMax) {
            query.precio = {};
            if (priceMin) query.precio.$gte = Number(priceMin);
            if (priceMax) query.precio.$lte = Number(priceMax);
        }
        if (minRating) {
            query.calificacionPromedio = { $gte: Number(minRating) };
        }

        let sortOptions: any = { createdAt: -1 };

        if (sortBy === 'price-asc') {
            sortOptions = { precio: 1 };
        } else if (sortBy === 'price-desc') {
            sortOptions = { precio: -1 };
        } else if (sortBy === 'rating-desc') {
            sortOptions = { calificacionPromedio: -1 };
        }

        const [totalProducts, products] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate('categoria', 'nombre')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
        ]);
        
        res.json({
            products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
        });

    } catch (error) {
        console.error("Error en getProducts:", error);
        res.status(500).json({ message: 'Error al obtener los productos.' });
    }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
    try {
        const featuredProducts = await Producto.find({ isFeatured: true }).populate('categoria', 'nombre');
        res.json(featuredProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos destacados.' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Producto.findById(req.params.id).populate('categoria', 'nombre');
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto.' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, precio, categoria, imagen, stock } = req.body;
        const newProduct = new Producto({ nombre, descripcion, precio, categoria, imagen, stock });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto.' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const updatedProduct = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado.' });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto.' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const deletedProduct = await Producto.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Producto no encontrado.' });
        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto.' });
    }
};
