'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import { ShoppingCart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    stockQuantity: number;
    description: string;
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [showSlaughterModal, setShowSlaughterModal] = useState(false);
  const [slaughterService, setSlaughterService] = useState(false);

  const needsSlaughterOption = product.category === 'Live Poultry' || product.category === 'Goats';
  const slaughterFee = product.category === 'Live Poultry' ? 5 : product.category === 'Goats' ? 20 : 0;

  const handleAddToCart = () => {
    if (product.stockQuantity === 0) {
      toast.error('Product out of stock');
      return;
    }

    if (needsSlaughterOption) {
      setShowSlaughterModal(true);
    } else {
      addToCart(false);
    }
  };

  const addToCart = (includeSlaughter: boolean) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
      category: product.category,
      slaughterService: includeSlaughter,
      slaughterFee: includeSlaughter ? slaughterFee : 0,
    });

    toast.success(`Added to cart${includeSlaughter ? ' with slaughter service' : ''}`);
    setShowSlaughterModal(false);
    setSlaughterService(false);
  };

  return (
    <>
      <div className="group bg-white rounded-3xl border border-neutral-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Badge */}
          {product.stockQuantity > 0 && product.stockQuantity < 10 && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center rounded-full bg-accent-500/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                Only {product.stockQuantity} left
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs font-medium text-primary-600 mb-2 uppercase tracking-wide">{product.category}</p>
          <h3 className="font-semibold text-lg text-neutral-900 mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm font-light text-neutral-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold text-primary-700">
              ${product.price.toFixed(2)}
            </span>
            <Button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              size="sm"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full px-5 shadow-lg hover:shadow-xl transition-all"
            >
              <ShoppingCart className="mr-1.5 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Slaughter Service Modal */}
      <AnimatePresence>
        {showSlaughterModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSlaughterModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-md w-full p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-neutral-900">Slaughter Service</h3>
                <button
                  onClick={() => setShowSlaughterModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-neutral-500" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-neutral-600 mb-4">
                  Would you like to add professional slaughter service for this {product.category === 'Live Poultry' ? 'chicken' : 'goat'}?
                </p>
                
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-900">Slaughter Service</span>
                    <span className="text-2xl font-bold text-primary-600">
                      +${slaughterFee.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Professional {product.category === 'Live Poultry' ? 'chicken' : 'goat'} slaughter and preparation
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => addToCart(true)}
                  className="w-full px-6 py-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Yes, Add Slaughter Service (+${slaughterFee})
                </button>
                <button
                  onClick={() => addToCart(false)}
                  className="w-full px-6 py-4 bg-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-300 transition-colors"
                >
                  No, Just the {product.category === 'Live Poultry' ? 'Chicken' : 'Goat'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
