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

async function fixServiceImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update slaughter service with farm equipment image
    await Product.updateOne(
      { name: 'Slaughter on Request' },
      { 
        $set: { 
          imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&q=80' // Farm barn/equipment
        } 
      }
    );

    console.log('✅ Updated Slaughter service image to farm equipment');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixServiceImages();
