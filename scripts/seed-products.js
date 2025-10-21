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

const sampleProducts = [
  {
    name: 'Farm Fresh Eggs (Dozen)',
    category: 'Fresh Eggs',
    price: 6.99,
    description: 'Organic free-range eggs from our happy hens. Rich in nutrients and flavor.',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800',
    stockQuantity: 50,
  },
  {
    name: 'Organic Brown Eggs (18 Pack)',
    category: 'Fresh Eggs',
    price: 9.99,
    description: 'Premium organic brown eggs. Perfect for baking and cooking.',
    imageUrl: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800',
    stockQuantity: 30,
  },
  {
    name: 'Young Rooster',
    category: 'Live Poultry',
    price: 25.00,
    description: 'Healthy young rooster, perfect for your backyard flock.',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800',
    stockQuantity: 8,
  },
  {
    name: 'Laying Hen',
    category: 'Live Poultry',
    price: 20.00,
    description: 'Productive laying hen, excellent egg producer.',
    imageUrl: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=800',
    stockQuantity: 15,
  },
  {
    name: 'Angus Calf',
    category: 'Livestock',
    price: 1200.00,
    description: 'Purebred Angus calf, grass-fed and healthy.',
    imageUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    stockQuantity: 3,
  },
  {
    name: 'Dairy Goat',
    category: 'Livestock',
    price: 350.00,
    description: 'Friendly dairy goat, great milk producer.',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800',
    stockQuantity: 5,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${sampleProducts.length} products`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
