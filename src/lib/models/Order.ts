import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryMethod: { type: String, enum: ['delivery', 'pickup'], required: true },
    deliveryAddress: { type: String },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = models.Order || model('Order', OrderSchema);

export default Order;
