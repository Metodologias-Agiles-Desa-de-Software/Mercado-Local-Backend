// =======================================================================
// ARCHIVO 1 (NUEVO): src/models/categoria.model.ts
// =======================================================================
import { Schema, model, Document } from 'mongoose';

export interface ICategoria extends Document {
  nombre: string;
}

const CategoriaSchema = new Schema<ICategoria>({
  nombre: { type: String, required: true, unique: true, trim: true },
}, { timestamps: true });

export const Categoria = model<ICategoria>('Categoria', CategoriaSchema);
