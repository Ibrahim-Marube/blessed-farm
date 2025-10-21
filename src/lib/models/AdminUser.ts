import mongoose, { Schema, model, models } from 'mongoose';

export interface IAdminUser {
  _id: string;
  username: string;
  passwordHash: string;
  email: string;
  createdAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const AdminUser = models.AdminUser || model<IAdminUser>('AdminUser', AdminUserSchema);

export default AdminUser;
