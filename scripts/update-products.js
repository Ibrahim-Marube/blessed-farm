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

const newProducts = [
  // Fresh Eggs - 4 products with specific egg images
  {
    name: 'Chicken Eggs (Dozen)',
    category: 'Fresh Eggs',
    price: 6.99,
    description: 'Farm-fresh chicken eggs from free-range hens. Rich, golden yolks full of flavor and nutrients.',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&q=80',
    stockQuantity: 50,
  },
  {
    name: 'Chicken Eggs (18 Pack)',
    category: 'Fresh Eggs',
    price: 9.99,
    description: 'Premium organic brown chicken eggs. Perfect for baking and cooking.',
    imageUrl: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800&q=80',
    stockQuantity: 35,
  },
  {
    name: 'Duck Eggs (Half Dozen)',
    category: 'Fresh Eggs',
    price: 8.99,
    description: 'Rich and creamy duck eggs, larger than chicken eggs. Ideal for baking and making pasta.',
    imageUrl: 'https://images.unsplash.com/photo-1606991788783-57c71f8d0fce?w=800&q=80',
    stockQuantity: 20,
  },
  {
    name: 'Duck Eggs (Dozen)',
    category: 'Fresh Eggs',
    price: 16.99,
    description: 'Premium duck eggs with thick shells and rich, creamy yolks. A baker\'s favorite!',
    imageUrl: 'https://images.unsplash.com/photo-1587486937413-0175e7c22c21?w=800&q=80',
    stockQuantity: 15,
  },

  // Live Poultry - 7 products with specific animal images
  {
    name: 'Live Chicken - Young Hen',
    category: 'Live Poultry',
    price: 20.00,
    description: 'Healthy young laying hen, excellent egg producer. Well-socialized and disease-free.',
    imageUrl: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=800&q=80',
    stockQuantity: 15,
  },
  {
    name: 'Live Chicken - Rooster',
    category: 'Live Poultry',
    price: 25.00,
    description: 'Young healthy rooster, perfect for breeding or backyard flock protection.',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80',
    stockQuantity: 8,
  },
  {
    name: 'Live Duck - Pekin',
    category: 'Live Poultry',
    price: 30.00,
    description: 'White Pekin duck, friendly and hardy. Great for eggs and pest control.',
    imageUrl: 'https://images.unsplash.com/photo-1597066009904-eb707752f12f?w=800&q=80',
    stockQuantity: 10,
  },
  {
    name: 'Live Duck - Khaki Campbell',
    category: 'Live Poultry',
    price: 35.00,
    description: 'Khaki Campbell duck, one of the best egg-laying duck breeds. Hardy and productive.',
    imageUrl: 'https://images.unsplash.com/photo-1551191916-2c4f175b539b?w=800&q=80',
    stockQuantity: 7,
  },
  {
    name: 'Goat - Small (Doeling)',
    category: 'Live Poultry',
    price: 300.00,
    description: 'Young female goat (doeling), 3-6 months old. Healthy and ready for new home.',
    imageUrl: 'https://images.unsplash.com/photo-1562440499-64c9a4d3f768?w=800&q=80',
    stockQuantity: 4,
  },
  {
    name: 'Goat - Medium (Yearling)',
    category: 'Live Poultry',
    price: 450.00,
    description: 'Yearling goat, 1-2 years old. Well-developed and socialized.',
    imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80',
    stockQuantity: 3,
  },
  {
    name: 'Goat - Breeding Doe',
    category: 'Live Poultry',
    price: 600.00,
    description: 'Mature breeding doe, proven milk producer. Excellent temperament.',
    imageUrl: 'https://images.unsplash.com/photo-1546450428-f1d8b6e6e8b1?w=800&q=80',
    stockQuantity: 2,
  },

  // Services - 3 products with service-related images
  {
    name: 'Slaughter on Request',
    category: 'Services',
    price: 15.00,
    description: 'Professional humane slaughter service for poultry. USDA-compliant processing with plucking and cleaning included.',
    imageUrl: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80',
    stockQuantity: 999,
  },
  {
    name: 'Delivery Service',
    category: 'Services',
    price: 25.00,
    description: 'Local delivery service across Colorado. Safe transport for livestock and fresh products.',
    imageUrl: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80',
    stockQuantity: 999,
  },
  {
    name: 'Farm Consultation',
    category: 'Services',
    price: 50.00,
    description: 'Expert advice on livestock care, breeding, and farm management. One-hour session with our experienced farmers.',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    stockQuantity: 999,
  },
];

async function updateProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(newProducts);
    console.log(`✅ Successfully added ${newProducts.length} products`);
    console.log('\nProducts by category:');
    console.log('- Fresh Eggs: 4 products');
    console.log('- Live Poultry: 7 products (chickens, ducks, goats)');
    console.log('- Services: 3 products');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateProducts();
