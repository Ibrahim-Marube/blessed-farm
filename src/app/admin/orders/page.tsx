'use client';

import { useEffect, useState } from 'react';
import { Loader2, Package, Clock, CheckCircle, XCircle, Truck, Store, MapPin } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  deliveryMethod: 'delivery' | 'pickup';
  deliveryFee: number;
  paymentMethod: 'paypal' | 'cash';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        setError('Failed to load orders');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-neutral-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-neutral-900">Orders</h1>
          <p className="text-neutral-600 mt-2 font-light">Manage customer orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-2xl border border-neutral-200">
          <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg font-light">No orders yet</p>
          <p className="text-neutral-400 text-sm mt-2">Orders will appear here when customers make purchases</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(order.status)}
                    <h3 className="text-xl font-semibold text-neutral-900">{order.customerName}</h3>
                    <span className="font-mono text-sm text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                      #{order.orderNumber}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{order.customerEmail}</p>
                  <p className="text-sm text-neutral-600">{order.customerPhone}</p>
                  <p className="text-xs text-neutral-400 mt-2">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-700">${order.total.toFixed(2)}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-neutral-50 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  {order.deliveryMethod === 'delivery' ? (
                    <Truck className="h-5 w-5 text-primary-600 mt-0.5" />
                  ) : (
                    <Store className="h-5 w-5 text-primary-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900 mb-1">
                      {order.deliveryMethod === 'delivery' ? 'Home Delivery' : 'Farm Pickup'}
                      {order.deliveryFee > 0 && ` (+$${order.deliveryFee.toFixed(2)})`}
                    </h4>
                    {order.deliveryAddress ? (
                      <div className="flex items-start gap-2 mt-2">
                        <MapPin className="h-4 w-4 text-neutral-500 mt-0.5" />
                        <p className="text-sm text-neutral-600">{order.deliveryAddress}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-500 italic">Customer will pick up at farm</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500">Payment</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {order.paymentMethod === 'cash' ? 'Cash' : 'PayPal'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 mb-4">
                <h4 className="font-semibold text-neutral-900 mb-3">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-neutral-700">{item.quantity}x {item.name}</span>
                      <span className="text-neutral-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'processing')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Mark Processing
                  </button>
                )}
                {order.status === 'processing' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'completed')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                  >
                    Mark Completed
                  </button>
                )}
                {order.status !== 'cancelled' && order.status !== 'completed' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'cancelled')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
