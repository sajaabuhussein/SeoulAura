import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Apple, ShieldCheck, Instagram, MessageCircle } from 'lucide-react';

interface CheckoutProps {
  onBack: () => void;
  onComplete: () => void;
  total: number;
}

export const Checkout = ({ onBack, onComplete, total }: CheckoutProps) => {
  return (
    <div className="relative max-w-4xl mx-auto px-6 pt-32 pb-24 min-h-[80vh]">
      {/* Blur Overlay Message */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-2xl p-10 md:p-16 rounded-[2.5rem] border border-rose-gold/30 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] text-center max-w-lg relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-gold via-indigo-400 to-rose-gold" />

          <div className="w-20 h-20 bg-rose-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Instagram className="w-10 h-10 text-rose-gold" />
          </div>

          <h2 className="text-3xl font-heading mb-6 text-charcoal">Order via Instagram</h2>

          <div className="space-y-4 text-charcoal/70 leading-relaxed mb-10">
            <p className="font-medium text-charcoal">
              We are currently only accepting <span className="text-rose-gold font-bold">Cash on Delivery (COD)</span>.
            </p>
            <p>
              To complete your purchase, please send a screenshot of your cart or your order details to our Instagram DM.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="https://instagram.com/seoulauraofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-charcoal text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-rose-gold transition-all shadow-lg shadow-charcoal/10"
            >
              <Instagram className="w-5 h-5" />
              Go to Instagram
            </a>
            <button
              onClick={onBack}
              className="text-sm font-bold uppercase tracking-widest text-charcoal/40 hover:text-charcoal transition-colors pt-2"
            >
              Back to Shopping
            </button>
          </div>
        </motion.div>
      </div>

      {/* Blurred Content */}
      <div className="blur-[6px] pointer-events-none select-none opacity-50">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-heading">Checkout</h1>
          <button className="text-charcoal/60">Back to Cart</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-heading">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full p-4 bg-white border border-charcoal/10 rounded-xl" />
                <input type="text" placeholder="Last Name" className="w-full p-4 bg-white border border-charcoal/10 rounded-xl" />
              </div>
              <input type="email" placeholder="Email Address" className="w-full p-4 bg-white border border-charcoal/10 rounded-xl" />
              <input type="text" placeholder="Shipping Address" className="w-full p-4 bg-white border border-charcoal/10 rounded-xl" />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-heading">Payment Method</h2>
              <div className="grid grid-cols-2 gap-4 opacity-50">
                <button className="p-4 border border-charcoal/10 rounded-xl flex items-center justify-center gap-2 font-medium">
                  <CreditCard className="w-5 h-5" /> Card
                </button>
                <button className="p-4 border border-charcoal/10 rounded-xl flex items-center justify-center gap-2 font-medium">
                  <Apple className="w-5 h-5" /> Pay
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl space-y-6">
              <h2 className="text-xl font-heading">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-charcoal/60">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-charcoal/60">
                  <span>Shipping</span>
                  <span className="text-emerald-600">Free</span>
                </div>
                <div className="pt-4 border-t border-charcoal/5 flex justify-between items-center text-xl font-heading">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full py-4 bg-charcoal/20 text-white font-medium uppercase tracking-widest rounded-xl cursor-not-allowed">
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
