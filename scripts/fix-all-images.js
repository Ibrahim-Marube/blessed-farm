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

async function fixImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Fix Fresh Eggs - Show actual eggs only
    await Product.updateOne(
      { name: 'Chicken Eggs (Dozen)' },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?w=800&q=80' } }
    );

    await Product.updateOne(
      { name: 'Chicken Eggs (18 Pack)' },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1498654077810-b9cf477a4f6c?w=800&q=80' } }
    );

    await Product.updateOne(
      { name: 'Duck Eggs (Half Dozen)' },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&q=80' } }
    );

    await Product.updateOne(
      { name: 'Duck Eggs (Dozen)' },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80' } }
    );

    // Fix Live Poultry - Chickens
    await Product.updateOne(
      { name: 'Live Chicken - Young Hen' },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80' } }
    );

    await Product.updateOne(
      { name: 'Live Chicken - Rooster' },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=800&q=80' } }
    );

    // Fix Ducks with proper duck images
    await Product.updateOne(
      { name: 'Live Duck - Pekin' },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1551191916-2c4f175b539b?w=800&q=80' } }
    );

    await Product.updateOne(
      { name: 'Live Duck - Khaki Campbell' },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80' } }
    );

    // Fix Goats with proper goat images (not pigs!)
    await Product.updateOne(
      { name: 'Goat - Small (Doeling)' },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=800&q=80' } }
    );

    await Product.updateOne(
      { name: 'Goat - Medium (Yearling)' },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1546450428-f1d8b6e6e8b1?w=800&q=80' } }
    );

    await Product.updateOne(
      { name: 'Goat - Breeding Doe' },
      { $set: { imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80' } }
    );

    console.log('✅ All images updated successfully!');
    console.log('- Fresh Eggs: Now showing actual eggs (chicken & duck)');
    console.log('- Live Poultry: Fixed duck images');
    console.log('- Goats: Replaced with proper goat images');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixImages();
