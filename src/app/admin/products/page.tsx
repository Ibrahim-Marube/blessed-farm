'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, Package } from 'lucide-react';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  description: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fresh Eggs',
    price: 0,
    imageUrl: '',
    stockQuantity: 0,
    description: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, imageUrl: data.url });
      } else {
        alert('Failed to upload image: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        fetchProducts();
        resetForm();
      } else {
        alert('Failed to save product: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
      description: product.description,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Fresh Eggs',
      price: 0,
      imageUrl: '',
      stockQuantity: 0,
      description: '',
    });
    setEditingId(null);
    setShowForm(false);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold text-neutral-900">Products</h1>
          <p className="text-neutral-600 mt-2 font-light">Manage your farm products</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                  required
                >
                  <option>Fresh Eggs</option>
                  <option>Live Poultry</option>
                  <option>Goats</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity || ''}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Product Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
              />
              {uploading && (
                <p className="text-sm text-primary-600 mt-2 flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Uploading to Cloudinary...
                </p>
              )}
              {formData.imageUrl && (
                <div className="mt-4">
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-xl border border-neutral-200"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading || !formData.imageUrl}
                className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-2xl border border-neutral-200">
          <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg font-light">No products yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-56 bg-neutral-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-neutral-500">
                    Stock: {product.stockQuantity}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
