import { Request, Response } from 'express';
import { Usuario } from '../models/usuario.model';
import mongoose from 'mongoose';

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.body;
        const userId = req.userId;
        if (!nombre) return res.status(400).json({ message: 'El nombre es requerido.' });
        const updatedUser = await Usuario.findByIdAndUpdate(userId, { nombre }, { new: true }).select('-password');
        if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado.' });
        res.json({ message: 'Nombre actualizado exitosamente.', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el perfil.' });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;
        if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        const user = await Usuario.findById(userId).select('+password');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar la contraseña.' });
    }
};

export const getWishlist = async (req: Request, res: Response) => {
    try {
        const user = await Usuario.findById(req.userId).populate({
            path: 'wishlist',
            populate: { path: 'categoria', select: 'nombre' }
        });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de deseos.' });
    }
};

export const toggleWishlist = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'El ID del producto no es válido.' });
        }
        const user = await Usuario.findById(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
        
        const productObjectId = new mongoose.Types.ObjectId(productId);
        const isProductInWishlist = user.wishlist.some(id => id.equals(productObjectId));

        let updateUserQuery;
        if (isProductInWishlist) {
            updateUserQuery = { $pull: { wishlist: productObjectId } };
        } else {
            updateUserQuery = { $addToSet: { wishlist: productObjectId } };
        }

        const updatedUser = await Usuario.findByIdAndUpdate(userId, updateUserQuery, { new: true });
        if (!updatedUser) throw new Error('No se pudo actualizar la lista de deseos del usuario.');
        
        res.json({ wishlist: updatedUser.wishlist });
    } catch (error: any) {
        console.error("ERROR DETALLADO en toggleWishlist:", error);
        res.status(500).json({ message: `Error del servidor: ${error.message}` });
    }
};