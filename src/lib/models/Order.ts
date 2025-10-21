import mongoose, { Schema, model, models } from 'mongoose';

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  deliveryPreference: 'delivery' | 'pickup';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'completed' | 'cancelled';
  paypalTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryPreference: {
      type: String,
      required: true,
      enum: ['delivery', 'pickup'],
    },
    paymentStatus: {
      type: String,
      default: 'pending',
      enum: ['pending', 'paid', 'failed'],
    },
    orderStatus: {
      type: String,
      default: 'pending',
      enum: ['pending', 'processing', 'completed', 'cancelled'],
    },
    paypalTransactionId: { type: String },
  },
  { timestamps: true }
);

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;
