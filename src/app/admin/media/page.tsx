'use client';

import { useEffect, useState } from 'react';
import { Loader2, Image as ImageIcon, Trash2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [images, setImages] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      
      if (data.success) {
        setImages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

    setDeleting(filename);
    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });

      if (res.ok) {
        fetchImages();
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image');
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
      <div>
        <h1 className="text-4xl font-semibold text-neutral-900">Media Library</h1>
        <p className="text-neutral-600 mt-2 font-light">Manage uploaded images</p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-2xl border border-neutral-200">
          <ImageIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg font-light">No images uploaded yet</p>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <strong>Warning:</strong> Deleting an image that's being used by a product will break the product display. 
                Make sure no products are using an image before deleting it.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="mb-4">
              <p className="text-sm text-neutral-600">
                Total: <span className="font-semibold">{images.length}</span> images
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <div key={image.name} className="relative group">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border-2 border-neutral-200">
                    <Image
                      src={image.url}
                      alt={image.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium text-neutral-900 truncate" title={image.name}>
                      {image.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-neutral-500">
                        {formatFileSize(image.size)}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteImage(image.name)}
                    disabled={deleting === image.name}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 shadow-lg"
                  >
                    {deleting === image.name ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
