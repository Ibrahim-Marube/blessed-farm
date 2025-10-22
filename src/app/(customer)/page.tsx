'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/customer/product-card';
import { Loader2, Leaf, Award, Truck, Phone, Mail, MapPin, Heart, Users, Sprout, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  description: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'Fresh Eggs', name: 'Fresh Eggs' },
    { id: 'Live Poultry', name: 'Live Poultry' },
    { id: 'Goats', name: 'Goats' },
  ];

  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory]);

  const fetchProducts = async (category: string) => {
    setLoading(true);
    try {
      const url = category === 'all' 
        ? '/api/products' 
        : `/api/products?category=${encodeURIComponent(category)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-40">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Leaf className="h-12 w-12 text-primary-200" />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Farm Fresh.
              <br />
              <span className="font-semibold">Naturally Good.</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl font-light text-primary-100 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Premium quality eggs, poultry, and livestock from our Colorado farm to your table.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-medium text-lg rounded-full hover:bg-primary-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Shop Now
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white font-medium text-lg rounded-full hover:bg-primary-600 transition-all shadow-xl hover:shadow-2xl"
              >
                Contact Us
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { icon: Leaf, title: "100% Organic", desc: "Raised naturally without chemicals" },
              { icon: Award, title: "Premium Quality", desc: "Carefully selected, farm-fresh products" },
              { icon: Truck, title: "Local Delivery", desc: "Fast delivery across Colorado" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="text-center"
                variants={fadeInUp}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-700 mb-4">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-neutral-600 font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section id="products" className="bg-white border-b border-neutral-200 sticky top-16 z-40 backdrop-blur-xl bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto py-5 scrollbar-hide">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
              <p className="text-neutral-500 font-light">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <motion.div 
              className="text-center py-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-neutral-500 text-xl font-light">No products available in this category</p>
            </motion.div>
          ) : (
            <>
              <motion.div 
                className="mb-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-3">
                  {activeCategory === 'all' ? 'All Products' : categories.find(c => c.id === activeCategory)?.name}
                </h2>
                <p className="text-neutral-600 font-light">{products.length} products available</p>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                key={activeCategory}
              >
                {products.map((product, i) => (
                  <motion.div
                    key={product._id}
                    variants={fadeInUp}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-4">About Us</h2>
              <p className="text-neutral-600 font-light text-lg">Your trusted source for farm-fresh products in Colorado</p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                Welcome to <span className="font-semibold text-primary-700">Blessed Farm</span>, where we've been raising healthy, happy animals and producing premium farm-fresh products for families across Colorado. Our commitment to organic, sustainable farming practices ensures that every product leaving our farm meets the highest standards of quality and care.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                From our free-range chickens laying the freshest eggs to our carefully raised goats and poultry, we take pride in providing you with products that are not only delicious but also ethically and sustainably produced. When you choose Blessed Farm, you're choosing quality, integrity, and a connection to where your food comes from.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                { icon: Heart, title: "Family Owned", desc: "Operated with love and care for generations" },
                { icon: Sprout, title: "Sustainable", desc: "Eco-friendly practices for a healthier planet" },
                { icon: Users, title: "Community First", desc: "Supporting local families with quality products" }
              ].map((value, i) => (
                <motion.div 
                  key={i}
                  className="text-center p-6"
                  variants={fadeInUp}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-700 mb-4">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{value.title}</h3>
                  <p className="text-neutral-600 font-light">{value.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white border-t border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-4">Get In Touch</h2>
              <p className="text-neutral-600 font-light text-lg">Have questions? We'd love to hear from you.</p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                { icon: Phone, title: "Phone", content: "(720) 840-2474", href: "tel:+17208402474" },
                { icon: Mail, title: "Email", content: "hyline1984@gmail.com", href: "mailto:hyline1984@gmail.com" },
                { icon: MapPin, title: "Farm Address", content: "1234 Farm Road\nBoulder, CO 80301", href: null }
              ].map((contact, i) => (
                <motion.div 
                  key={i}
                  className="text-center p-6 bg-primary-50 rounded-2xl"
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white mb-4">
                    <contact.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{contact.title}</h3>
                  {contact.href ? (
                    <a href={contact.href} className="text-primary-700 hover:text-primary-800 font-medium">
                      {contact.content}
                    </a>
                  ) : (
                    <p className="text-primary-700 font-medium whitespace-pre-line">
                      {contact.content}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="bg-neutral-50 rounded-2xl p-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-semibold text-neutral-900 mb-6 text-center">Send Us a Message</h3>
              
              {submitSuccess && (
                <motion.div 
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  ✓ Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}
              
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-8 py-4 bg-primary-600 text-white font-medium text-lg rounded-xl hover:bg-primary-700 transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Leaf className="h-10 w-10 text-primary-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Blessed Farm</h3>
            <p className="text-neutral-400 font-light mb-6">Fresh from our farm to your table</p>
            
            <div className="flex items-center justify-center gap-2 text-neutral-300 mb-4">
              <MapPin className="h-5 w-5 text-primary-400" />
              <p className="font-light">Pickup Address: 1234 Farm Road, Boulder, CO 80301</p>
            </div>
            
            <p className="text-neutral-500 text-sm">&copy; 2025 Blessed Farm. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
