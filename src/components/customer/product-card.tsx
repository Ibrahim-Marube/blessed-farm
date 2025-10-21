'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';

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

  const handleAddToCart = () => {
    if (product.stockQuantity === 0) {
      toast.error('Product out of stock');
      return;
    }

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
    });

    toast.success('Added to cart');
  };

  return (
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
  );
}
