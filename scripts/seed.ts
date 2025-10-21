import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  description: String,
  imageUrl: String,
  stockQuantity: Number,
  isActive: Boolean,
}, { timestamps: true });

const AdminUserSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  email: String,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

const seedProducts = [
  {
    name: 'Chicken Eggs (6-pack)',
    category: 'Fresh Eggs',
    price: 6,
    description: 'Fresh farm chicken eggs, 6-pack',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc1f7e3c69?w=400',
    stockQuantity: 50,
    isActive: true,
  },
  {
    name: 'Duck Eggs (Dozen)',
    category: 'Fresh Eggs',
    price: 10,
    description: 'Fresh farm duck eggs, dozen',
    imageUrl: 'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=400',
    stockQuantity: 30,
    isActive: true,
  },
  {
    name: 'Free Range Chicken',
    category: 'Live Poultry',
    price: 30,
    description: 'Healthy free-range chicken',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400',
    stockQuantity: 15,
    isActive: true,
  },
  {
    name: 'Duck',
    category: 'Live Poultry',
    price: 15,
    description: 'Farm-raised duck',
    imageUrl: 'https://images.unsplash.com/photo-1544824724-f9c3c8ab2bce?w=400',
    stockQuantity: 10,
    isActive: true,
  },
  {
    name: 'Goat',
    category: 'Livestock',
    price: 375,
    description: 'Healthy goat, price varies $350-$400',
    imageUrl: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=400',
    stockQuantity: 5,
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    await AdminUser.deleteMany({});
    console.log('Cleared existing data');

    await Product.insertMany(seedProducts);
    console.log('Seeded products');

    const passwordHash = await bcrypt.hash('admin123', 10);
    await AdminUser.create({
      username: 'admin',
      passwordHash,
      email: 'admin@blessedfarm.com',
    });
    console.log('Created admin user (username: admin, password: admin123)');

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
