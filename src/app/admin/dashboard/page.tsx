'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, AlertCircle, Loader2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lowStockProducts: 0,
    todaySales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      
      if (!res.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await res.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError('Failed to load stats');
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: TrendingUp,
      color: 'bg-primary-500',
      bgLight: 'bg-primary-50',
      textColor: 'text-primary-700',
    },
    {
      title: "Today's Sales",
      value: `$${stats.todaySales.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockProducts,
      icon: AlertCircle,
      color: 'bg-amber-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-neutral-600 font-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button 
            onClick={fetchStats}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-2 font-light">Welcome back! Here's what's happening with your farm.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bgLight} p-3 rounded-xl`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
            </div>
            <h3 className="text-neutral-600 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-semibold text-neutral-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              href="/admin/products" 
              className="flex items-center justify-between p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors group"
            >
              <div>
                <p className="font-medium text-primary-900">Manage Products</p>
                <p className="text-sm text-primary-700 font-light mt-1">Add, edit, or remove products</p>
              </div>
              <Package className="h-5 w-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/admin/orders" 
              className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
            >
              <div>
                <p className="font-medium text-blue-900">View Orders</p>
                <p className="text-sm text-blue-700 font-light mt-1">Manage customer orders</p>
              </div>
              <ShoppingCart className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Status Overview</h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <span className="text-neutral-600 font-medium">Pending Orders</span>
              <span className="text-2xl font-semibold text-amber-600">{stats.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <span className="text-neutral-600 font-medium">Completed Orders</span>
              <span className="text-2xl font-semibold text-primary-600">{stats.completedOrders}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-neutral-600 font-medium">Low Stock Items</span>
              <span className="text-2xl font-semibold text-red-600">{stats.lowStockProducts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
