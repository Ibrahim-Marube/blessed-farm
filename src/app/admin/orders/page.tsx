'use client';

import { useEffect, useState } from 'react';
import { Loader2, Package, CheckCircle, Clock, XCircle, Truck, Home, Eye, Archive, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: 'delivery' | 'pickup';
  deliveryAddress?: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  archived: boolean;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [showArchived]);

  const fetchOrders = async () => {
    try {
      const url = showArchived ? '/api/admin/orders?archived=true' : '/api/admin/orders';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
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
        setSelectedOrder(null);
        alert('Order status updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order status');
    }
  };

  const archiveOrder = async (orderId: string) => {
    if (!confirm('Archive this order? You can restore it later from the Archived section.')) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
      });

      if (res.ok) {
        fetchOrders();
        setSelectedOrder(null);
        alert('Order archived successfully!');
      }
    } catch (error) {
      console.error('Failed to archive order:', error);
      alert('Failed to archive order');
    }
  };

  const restoreOrder = async (orderId: string) => {
    if (!confirm('Restore this order?')) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: false }),
      });

      if (res.ok) {
        fetchOrders();
        setSelectedOrder(null);
        alert('Order restored successfully!');
      }
    } catch (error) {
      console.error('Failed to restore order:', error);
      alert('Failed to restore order');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('⚠️ PERMANENTLY DELETE this order? This action CANNOT be undone!\n\nType "DELETE" to confirm.')) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchOrders();
        setSelectedOrder(null);
        alert('Order deleted permanently!');
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('Failed to delete order');
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-neutral-900">Orders</h1>
          <p className="text-neutral-600 mt-2 font-light">
            {showArchived ? 'Archived orders' : 'Manage customer orders'}
          </p>
        </div>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="px-6 py-3 bg-neutral-800 text-white font-medium rounded-xl hover:bg-neutral-900 transition-colors flex items-center gap-2"
        >
          <Archive className="h-5 w-5" />
          {showArchived ? 'Show Active' : 'Show Archived'}
        </button>
      </div>

      {/* Filter Tabs */}
      {!showArchived && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {orders.filter(o => o.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-2xl border border-neutral-200">
          <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg font-light">
            {showArchived ? 'No archived orders' : 'No orders found'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-neutral-900">
                        #{order.orderNumber}
                      </h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {order.deliveryMethod === 'delivery' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <Truck className="h-3 w-3" />
                          Delivery
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          <Home className="h-3 w-3" />
                          Farm Pickup
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-neutral-600">
                      <div>
                        <span className="font-medium">Customer:</span> {order.customerName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {order.customerEmail}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {order.customerPhone}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {order.deliveryAddress && (
                      <div className="mt-2 text-sm text-neutral-600">
                        <span className="font-medium">Address:</span> {order.deliveryAddress}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.items.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-neutral-100 rounded-lg text-sm text-neutral-700">
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-neutral-500">Total</p>
                      <p className="text-3xl font-bold text-primary-600">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className={`text-xs font-medium mt-1 ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentStatus === 'paid' ? '✓ Paid' : 'Payment Pending'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Manage
                      </button>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedOrder(null)}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Order #{selectedOrder.orderNumber}
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Customer Information</h3>
                <div className="bg-neutral-50 rounded-xl p-4 space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedOrder.customerName}</div>
                  <div><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</div>
                  <div><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</div>
                  {selectedOrder.deliveryAddress && (
                    <div><span className="font-medium">Address:</span> {selectedOrder.deliveryAddress}</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-neutral-200">
                      <div>
                        <p className="font-medium text-neutral-900">{item.name}</p>
                        <p className="text-sm text-neutral-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-neutral-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4">
                    <p className="text-xl font-semibold text-neutral-900">Total</p>
                    <p className="text-3xl font-bold text-primary-600">
                      ${selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {!selectedOrder.archived && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Update Status</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder._id, status)}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                          selectedOrder.status === status
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {selectedOrder.archived ? (
                  <button
                    onClick={() => restoreOrder(selectedOrder._id)}
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Package className="h-5 w-5" />
                    Restore Order
                  </button>
                ) : (
                  <button
                    onClick={() => archiveOrder(selectedOrder._id)}
                    className="flex-1 px-6 py-3 bg-yellow-600 text-white font-medium rounded-xl hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Archive className="h-5 w-5" />
                    Archive Order
                  </button>
                )}
                
                <button
                  onClick={() => deleteOrder(selectedOrder._id)}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-5 w-5" />
                  Delete Permanently
                </button>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full px-6 py-3 bg-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-300 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
