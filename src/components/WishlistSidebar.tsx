import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistSidebar = ({ isOpen, onClose, items, onRemove, onAddToCart }: WishlistSidebarProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-cream-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-charcoal/5">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-gold fill-rose-gold" />
                <h2 className="text-xl font-heading">Your Wishlist</h2>
                <span className="text-sm text-charcoal/40">({items.length})</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-charcoal/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-charcoal/40 space-y-4 text-center">
                  <Heart className="w-12 h-12" />
                  <p>Your wishlist is empty.<br/>Save your favorites here!</p>
                  <button 
                    onClick={onClose}
                    className="text-charcoal font-medium underline underline-offset-4"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-32 rounded-xl overflow-hidden bg-white shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <button onClick={() => onRemove(item)} className="text-charcoal/40 hover:text-rose-gold">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-charcoal/60">{item.category}</p>
                        <p className="font-semibold mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => {
                          onAddToCart(item);
                          onRemove(item);
                        }}
                        className="w-full py-2 bg-charcoal text-white text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-rose-gold transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Move to Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
