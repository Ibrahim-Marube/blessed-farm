'use client';

import { useCartStore } from '@/store/cart-store';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center py-32">
            <ShoppingBag className="h-24 w-24 text-neutral-300 mx-auto mb-6" />
            <h1 className="text-3xl font-semibold text-neutral-900 mb-4">Your cart is empty</h1>
            <p className="text-neutral-600 mb-8 font-light">Add some farm-fresh products to get started</p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-neutral-900">Shopping Cart</h1>
            <p className="text-neutral-600 mt-2 font-light">{items.length} items in your cart</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                  <div className="flex gap-6">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-2xl font-bold text-primary-700 mb-4">
                        ${item.price.toFixed(2)}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                          >
                            <Minus className="h-4 w-4 text-neutral-700" />
                          </button>
                          <span className="w-12 text-center font-semibold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, Math.min(item.stockQuantity, item.quantity + 1))}
                            disabled={item.quantity >= item.stockQuantity}
                            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4 text-neutral-700" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="inline-flex items-center text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-neutral-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="text-neutral-900 font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Delivery</span>
                    <span className="text-primary-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-3 flex justify-between">
                    <span className="text-lg font-semibold text-neutral-900">Total</span>
                    <span className="text-2xl font-bold text-primary-700">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full px-8 py-4 bg-primary-600 text-white font-medium text-center text-lg rounded-xl hover:bg-primary-700 transition-colors shadow-lg mb-4"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  href="/"
                  className="block w-full px-8 py-3 bg-neutral-100 text-neutral-700 font-medium text-center rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
