'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle, Loader2, Package, Truck, Home } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  deliveryMethod: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        
        if (data.success) {
          setOrder(data.data);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8">
            Thank you for your order, {order.customerName}!
          </p>

          <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6 mb-8">
            <p className="text-sm text-primary-600 font-medium mb-2">Order Number</p>
            <p className="text-3xl font-bold text-primary-900 font-mono">
              {order.orderNumber}
            </p>
          </div>

          <div className="text-left mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Order Details</h2>
            
            <div className="space-y-3 mb-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-neutral-200">
                  <div>
                    <p className="font-medium text-neutral-900">{item.name}</p>
                    <p className="text-sm text-neutral-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-neutral-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t-2 border-neutral-300">
              <p className="text-xl font-semibold text-neutral-900">Total</p>
              <p className="text-3xl font-bold text-primary-600">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              {order.deliveryMethod === 'delivery' ? (
                <Truck className="h-6 w-6 text-primary-600" />
              ) : (
                <Home className="h-6 w-6 text-primary-600" />
              )}
              <h3 className="text-lg font-semibold text-neutral-900">
                {order.deliveryMethod === 'delivery' ? 'Home Delivery' : 'Farm Pickup'}
              </h3>
            </div>
            <p className="text-neutral-600">
              {order.deliveryMethod === 'delivery' 
                ? "We'll deliver your order soon. Check your email for updates."
                : "Please visit our farm to collect your order. We'll email you when it's ready!"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-primary-600 text-white font-medium text-lg rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => router.push(`/order-confirmation/${order._id}`)}
              className="px-8 py-4 bg-neutral-200 text-neutral-900 font-medium text-lg rounded-xl hover:bg-neutral-300 transition-colors"
            >
              <Package className="inline-block mr-2 h-5 w-5" />
              View Order Details
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-neutral-500">
            A confirmation email has been sent to <strong>{order.customerEmail}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
