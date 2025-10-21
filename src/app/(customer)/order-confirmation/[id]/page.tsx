'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, Package, Mail, Phone } from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-4">Order not found</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 md:p-12 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-4xl font-semibold text-neutral-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-neutral-600 mb-2 font-light">
              Thank you for your order, <span className="font-medium text-neutral-900">{order.customerName}</span>
            </p>
            <p className="text-neutral-500 mb-8">
              Order ID: <span className="font-mono text-sm">{order._id}</span>
            </p>

            <div className="bg-primary-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Package className="h-6 w-6 text-primary-700" />
                <h2 className="text-xl font-semibold text-primary-900">Order Details</h2>
              </div>
              
              <div className="space-y-3 text-left">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between py-2 border-b border-primary-100 last:border-0">
                    <span className="text-neutral-700">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold text-neutral-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 text-lg">
                  <span className="font-semibold text-neutral-900">Total</span>
                  <span className="font-bold text-primary-700 text-2xl">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-neutral-900 mb-4">Delivery Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-neutral-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-700">Email</p>
                    <p className="text-neutral-600">{order.customerEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-neutral-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-700">Phone</p>
                    <p className="text-neutral-600">{order.customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-neutral-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-700">Delivery Address</p>
                    <p className="text-neutral-600">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-neutral-600 mb-8 font-light">
              We'll contact you shortly to confirm delivery details.
            </p>

            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium text-lg rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
