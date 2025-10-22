'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import Image from 'next/image';
import { Loader2, ShoppingBag, ArrowLeft, Truck, Store, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'cash'>('cash');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    notes: '',
  });

  const total = getTotal();
  const deliveryFee = deliveryMethod === 'delivery' ? 10 : 0;
  const finalTotal = total + deliveryFee;

  // Calculate slaughter fees separately for display
  const slaughterTotal = items.reduce((sum, item) => {
    return sum + (item.slaughterService && item.slaughterFee ? item.slaughterFee * item.quantity : 0);
  }, 0);

  const createOrder = async (paymentId?: string) => {
    const orderData = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      deliveryAddress: formData.deliveryAddress || '',
      notes: formData.notes || '',
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        slaughterService: item.slaughterService || false,
        slaughterFee: item.slaughterFee || 0,
      })),
      total: finalTotal,
      deliveryMethod,
      deliveryFee,
      paymentMethod,
      paymentId: paymentId || 'pending',
      status: 'pending',
    };

    console.log('Sending order data:', orderData);

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    console.log('Order response:', data);
    
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted');
    console.log('Payment method:', paymentMethod);
    console.log('Form data:', formData);
    
    if (paymentMethod === 'cash') {
      setLoading(true);

      try {
        const data = await createOrder();
        console.log('Create order result:', data);

        if (data.success) {
          console.log('Order successful, clearing cart and redirecting');
          clearCart();
          router.push(`/order-confirmation/${data.data._id}`);
        } else {
          console.error('Order failed:', data.error);
          alert(data.error || 'Failed to place order. Please try again.');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to place order. Please check console for details.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center py-32">
            <ShoppingBag className="h-24 w-24 text-neutral-300 mx-auto mb-6" />
            <h1 className="text-3xl font-semibold text-neutral-900 mb-4">Your cart is empty</h1>
            <p className="text-neutral-600 mb-8 font-light">Add some products to get started</p>
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
    <PayPalScriptProvider options={{ 
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
      currency: 'USD'
    }}>
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <Link
                href="/cart"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Link>
              <h1 className="text-4xl font-semibold text-neutral-900">Checkout</h1>
              <p className="text-neutral-600 mt-2 font-light">Complete your order</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Delivery Method */}
                  <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Delivery Method</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('delivery')}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          deliveryMethod === 'delivery'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <Truck className={`h-8 w-8 mb-3 mx-auto ${
                          deliveryMethod === 'delivery' ? 'text-primary-600' : 'text-neutral-400'
                        }`} />
                        <h3 className="font-semibold text-neutral-900 mb-1">Delivery</h3>
                        <p className="text-sm text-neutral-600 mb-2">We deliver to your door</p>
                        <p className="text-lg font-bold text-primary-700">$10.00</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('pickup')}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          deliveryMethod === 'pickup'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <Store className={`h-8 w-8 mb-3 mx-auto ${
                          deliveryMethod === 'pickup' ? 'text-primary-600' : 'text-neutral-400'
                        }`} />
                        <h3 className="font-semibold text-neutral-900 mb-1">Pickup</h3>
                        <p className="text-sm text-neutral-600 mb-2">Pick up at our farm</p>
                        <p className="text-lg font-bold text-primary-700">Free</p>
                      </button>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Your Information</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.customerName}
                          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                          placeholder="john@example.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                          placeholder="(123) 456-7890"
                          required
                        />
                      </div>

                      {deliveryMethod === 'delivery' && (
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Delivery Address *
                          </label>
                          <textarea
                            value={formData.deliveryAddress}
                            onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                            placeholder="123 Main St, Colorado, USA"
                            required={deliveryMethod === 'delivery'}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Order Notes (Optional)
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                          placeholder="Any special instructions..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Payment Method</h2>
                    
                    <div className="space-y-4 mb-6">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          paymentMethod === 'cash'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Store className={`h-6 w-6 ${
                            paymentMethod === 'cash' ? 'text-primary-600' : 'text-neutral-400'
                          }`} />
                          <div>
                            <h3 className="font-semibold text-neutral-900">Cash on {deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}</h3>
                            <p className="text-sm text-neutral-600">Pay when you receive your order</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          paymentMethod === 'paypal'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className={`h-6 w-6 ${
                            paymentMethod === 'paypal' ? 'text-primary-600' : 'text-neutral-400'
                          }`} />
                          <div>
                            <h3 className="font-semibold text-neutral-900">PayPal</h3>
                            <p className="text-sm text-neutral-600">Pay securely with PayPal</p>
                          </div>
                        </div>
                      </button>
                    </div>

                    {paymentMethod === 'cash' ? (
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-8 py-4 bg-primary-600 text-white font-medium text-lg rounded-xl hover:bg-primary-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="inline-block mr-2 h-5 w-5 animate-spin" />
                            Processing Order...
                          </>
                        ) : (
                          `Place Order - $${finalTotal.toFixed(2)}`
                        )}
                      </button>
                    ) : (
                      <PayPalButtons
                        style={{ layout: 'vertical', shape: 'rect' }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: 'CAPTURE',
                            purchase_units: [{
                              amount: {
                                currency_code: 'USD',
                                value: finalTotal.toFixed(2),
                              },
                            }],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          if (actions.order) {
                            const details = await actions.order.capture();
                            const orderData = await createOrder(details.id);
                            
                            if (orderData.success) {
                              clearCart();
                              router.push(`/order-confirmation/${orderData.data._id}`);
                            }
                          }
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm sticky top-24">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6">Order Summary</h2>
                    
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={item.id} className="space-y-2">
                          <div className="flex gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-neutral-900 truncate">
                                {item.name}
                              </h3>
                              <p className="text-sm text-neutral-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-neutral-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          {item.slaughterService && item.slaughterFee && (
                            <div className="ml-20 flex justify-between text-xs">
                              <span className="text-green-700 font-medium">
                                + Slaughter Service
                              </span>
                              <span className="text-green-700 font-semibold">
                                +${(item.slaughterFee * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-neutral-200 pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Subtotal</span>
                        <span className="text-neutral-900 font-medium">${(total - slaughterTotal).toFixed(2)}</span>
                      </div>
                      {slaughterTotal > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Slaughter Services</span>
                          <span className="text-green-700 font-medium">+${slaughterTotal.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">
                          {deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}
                        </span>
                        <span className={`font-medium ${deliveryFee > 0 ? 'text-neutral-900' : 'text-primary-600'}`}>
                          {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}
                        </span>
                      </div>
                      <div className="border-t border-neutral-200 pt-3 flex justify-between">
                        <span className="text-lg font-semibold text-neutral-900">Total</span>
                        <span className="text-2xl font-bold text-primary-700">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
