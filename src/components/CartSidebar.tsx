import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onQuizClick: () => void;
  onPageChange: (page: string) => void;
}

export const CartSidebar = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout, onQuizClick, onPageChange }: CartSidebarProps) => {
  const [promoCode, setPromoCode] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  const [promoError, setPromoError] = React.useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal * (1 - discount);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'EIDAURA') {
      setDiscount(0.2);
      setPromoError('');
    } else {
      setPromoError('Invalid code');
      setDiscount(0);
    }
  };

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
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-xl font-heading">Your Cart</h2>
                <span className="text-sm text-charcoal/40">({items.length})</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-charcoal/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 rounded-full bg-soft-lavender/30 flex items-center justify-center text-rose-gold">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-heading text-charcoal">Your cart is empty</h3>
                    <p className="text-charcoal/40 font-light">Looks like you haven't found your perfect glow yet.</p>
                  </div>
                  <div className="flex flex-col gap-4 w-full pt-6">
                    <button
                      onClick={() => {
                        onClose();
                        onPageChange('shop');
                      }}
                      className="w-full py-4 bg-charcoal text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-rose-gold transition-all shadow-xl shadow-charcoal/10"
                    >
                      Start Shopping
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onQuizClick();
                      }}
                      className="w-full py-4 bg-white border border-charcoal/10 text-charcoal rounded-full font-bold uppercase tracking-widest text-[10px] hover:border-rose-gold hover:text-rose-gold transition-all"
                    >
                      Take Skin Analysis Quiz
                    </button>
                  </div>
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
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <button onClick={() => onRemove(item.id)} className="text-charcoal/40 hover:text-charcoal">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-charcoal/60">{item.category}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-charcoal/10 rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 px-2 hover:bg-charcoal/5 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 px-2 hover:bg-charcoal/5 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-charcoal/5 bg-white/50 space-y-4">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-white border border-charcoal/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-gold"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-charcoal text-white text-xs font-medium uppercase tracking-widest rounded-lg hover:bg-rose-gold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[10px] text-red-500">{promoError}</p>}
                  {discount > 0 && <p className="text-[10px] text-green-600 font-medium tracking-wider">CODE APPLIED: 20% OFF</p>}
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-sm text-charcoal/60">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                      <span>Discount (20%)</span>
                      <span>-${(subtotal * discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg pt-2 border-t border-charcoal/5">
                    <span className="font-heading">Total</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full py-4 bg-charcoal text-white font-medium uppercase tracking-widest rounded-xl hover:bg-rose-gold transition-colors shadow-lg shadow-charcoal/10"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
