'use client';

import { useEffect, useState } from 'react';
import { Loader2, Mail, Eye, CheckCircle, Trash2 } from 'lucide-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/contacts');
      const data = await res.json();
      
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      });
      fetchContacts();
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'replied' }),
      });
      fetchContacts();
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchContacts();
      } else {
        alert('Failed to delete message');
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete message');
    } finally {
      setDeleting(null);
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
      <div>
        <h1 className="text-4xl font-semibold text-neutral-900">Contact Messages</h1>
        <p className="text-neutral-600 mt-2 font-light">Messages from the contact form</p>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-2xl border border-neutral-200">
          <Mail className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg font-light">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact._id} className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-neutral-900">{contact.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      contact.status === 'read' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{contact.email}</p>
                  <p className="text-xs text-neutral-400 mt-2">
                    {new Date(contact.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-xl p-4 mb-4">
                <p className="text-neutral-700 whitespace-pre-wrap">{contact.message}</p>
              </div>

              <div className="flex gap-2">
                {contact.status === 'new' && (
                  <button
                    onClick={() => markAsRead(contact._id)}
                    className="inline-flex items-center px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 text-sm"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Mark as Read
                  </button>
                )}
                {contact.status !== 'replied' && (
                  <>
                    <button
                      onClick={() => markAsReplied(contact._id)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 text-sm"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Replied
                    </button>
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 text-sm"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Reply via Email
                    </a>
                  </>
                )}
                <button
                  onClick={() => deleteContact(contact._id)}
                  disabled={deleting === contact._id}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 ml-auto"
                >
                  {deleting === contact._id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
