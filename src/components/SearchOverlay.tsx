import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export const SearchOverlay = ({ isOpen, onClose, onProductClick }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.ingredients.some(i => i.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-cream-white/95 backdrop-blur-xl flex flex-col"
        >
          <div className="max-w-5xl mx-auto w-full px-6 pt-12 flex flex-col h-full">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-gold/10 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-rose-gold" />
                </div>
                <h2 className="text-xl font-heading">Search Seoul Aura</h2>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-charcoal/5 rounded-full transition-colors group"
              >
                <X className="w-8 h-8 text-charcoal/40 group-hover:text-charcoal transition-colors" />
              </button>
            </div>

            <div className="relative mb-16">
              <input
                autoFocus
                type="text"
                placeholder="Search by product, brand, or ingredient..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-b-2 border-charcoal/10 py-6 text-3xl md:text-5xl font-heading focus:outline-none focus:border-rose-gold transition-all placeholder:text-charcoal/10"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-charcoal/20 hover:text-charcoal"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pb-12">
              {query.trim().length > 0 ? (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.length > 0 ? (
                      results.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => {
                            onProductClick(product);
                            onClose();
                          }}
                          className="group cursor-pointer flex gap-4 p-4 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-rose-gold/10 hover:shadow-xl hover:shadow-rose-gold/5"
                        >
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-white shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex flex-col justify-center">
                            <span className="text-[10px] uppercase tracking-widest text-rose-gold font-bold mb-1">{product.brand}</span>
                            <h3 className="font-medium text-sm leading-tight mb-2 group-hover:text-rose-gold transition-colors">{product.name}</h3>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm">${product.price.toFixed(2)}</span>
                              <ArrowRight className="w-4 h-4 text-rose-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center space-y-4">
                        <p className="text-2xl font-heading text-charcoal/40">No results found for "{query}"</p>
                        <p className="text-charcoal/20">Try searching for "Cleanser", "Snail", or "COSRX"</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-bold">Popular Searches</h3>
                    <div className="flex flex-wrap gap-3">
                      {['Snail Mucin', 'Cleanser', 'Sunscreen', 'Retinol', 'COSRX', 'Anua', 'Glass Skin'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-6 py-3 bg-white border border-charcoal/5 rounded-full text-xs font-medium hover:border-rose-gold hover:text-rose-gold transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
