const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/blessed-farm';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  stockQuantity: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const services = [
  {
    name: 'Poultry Processing Service',
    category: 'Services',
    price: 15.00,
    description: 'Professional poultry slaughter and processing. Includes plucking and cleaning. Humane and USDA-compliant.',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800',
    stockQuantity: 999, // Services don't run out
  },
  {
    name: 'Small Livestock Processing',
    category: 'Services',
    price: 75.00,
    description: 'Processing service for goats, sheep, and small livestock. Professional butchering and packaging available.',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800',
    stockQuantity: 999,
  },
  {
    name: 'Custom Butchering',
    category: 'Services',
    price: 150.00,
    description: 'Custom butchering service for cattle. Your choice of cuts, vacuum sealed and labeled.',
    imageUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    stockQuantity: 999,
  },
  {
    name: 'Farm Consultation',
    category: 'Services',
    price: 50.00,
    description: 'Expert consultation on livestock raising, breeding, and farm management. One-hour session.',
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800',
    stockQuantity: 999,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Add services without deleting existing products
    await Product.insertMany(services);
    console.log(`✅ Successfully added ${services.length} service products`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
