import mongoose, { Schema, model, models } from 'mongoose';

export interface IProduct {
  _id: string;
  name: string;
  category: 'Fresh Eggs' | 'Live Poultry' | 'Livestock' | 'Services';
  price: number;
  description: string;
  imageUrl: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Fresh Eggs', 'Live Poultry', 'Livestock', 'Services'],
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = models.Product || model<IProduct>('Product', ProductSchema);

export default Product;
