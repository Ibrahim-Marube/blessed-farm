'use client';

import Link from 'next/link';
import { ShoppingCart, Leaf } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';

export default function Header() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-neutral-900">Blessed Farm</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => window.location.href = '/'} 
              className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('products')} 
              className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
            >
              Products
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
            >
              Contact Us
            </button>
          </nav>

          <Link
            href="/cart"
            className="relative inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
