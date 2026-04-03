import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { Star, Minus, Plus, ShoppingBag, Heart, Share2, ShieldCheck, Truck, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBack: () => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductDetail = ({ product, onAddToCart, onBack, onToggleWishlist, isWishlisted }: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <button
        onClick={onBack}
        className="mb-8 text-charcoal/60 hover:text-charcoal flex items-center gap-2 transition-colors"
      >
        ← Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-2xl shadow-charcoal/5"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white cursor-pointer hover:ring-2 ring-rose-gold transition-all">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-60 hover:opacity-100" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-gold">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-rose-gold' : 'text-charcoal/10'}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-charcoal/60">({product.rating} / 5.0)</span>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-rose-gold font-bold">{product.brand}</p>
            <h1 className="text-5xl font-heading text-charcoal">{product.name}</h1>
            <p className="text-2xl font-semibold text-charcoal">${product.price.toFixed(2)}</p>

            {/* Actives & Benefits */}
            <div className="flex flex-wrap gap-4 py-4">
              {product.actives && product.actives.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-rose-gold/10 rounded-xl border border-rose-gold/20">
                  <Sparkles className="w-4 h-4 text-rose-gold" />
                  <span className="text-xs font-bold uppercase tracking-widest text-rose-gold">
                    {product.actives.join(' • ')}
                  </span>
                </div>
              )}
              {product.benefits && product.benefits.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-xl border border-charcoal/10">
                  <CheckCircle2 className="w-4 h-4 text-charcoal/40" />
                  <span className="text-xs font-bold uppercase tracking-widest text-charcoal/60">
                    {product.benefits.join(' • ')}
                  </span>
                </div>
              )}
            </div>

            <p className="text-charcoal/70 leading-relaxed text-lg">{product.description}</p>

            <div className="flex items-start gap-3 p-4 bg-charcoal/5 rounded-2xl border border-charcoal/10 mt-4">
              <ShieldCheck className="w-5 h-5 text-rose-gold shrink-0 mt-0.5" />
              <p className="text-[10px] text-charcoal/60 leading-relaxed italic">
                Note: Skincare results vary by individual. While our AI analysis provides recommendations, we strongly advise consulting a dermatologist or skincare professional for medical concerns or persistent skin issues.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center border border-charcoal/10 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:bg-charcoal/5 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 hover:bg-charcoal/5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => onAddToCart(product, quantity)}
                className="flex-1 py-4 bg-charcoal text-white font-medium uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 hover:bg-rose-gold transition-all shadow-xl shadow-charcoal/10"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onToggleWishlist(product)}
                className={`flex-1 py-3 border border-charcoal/10 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  isWishlisted ? 'bg-rose-gold/10 border-rose-gold/20 text-rose-gold' : 'hover:bg-charcoal/5'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-gold' : ''}`} />
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button className="flex-1 py-3 border border-charcoal/10 rounded-xl flex items-center justify-center gap-2 hover:bg-charcoal/5 transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-charcoal/5">
            <div className="flex items-center gap-3 text-sm text-charcoal/60">
              <Truck className="w-5 h-5 text-rose-gold" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-charcoal/60">
              <ShieldCheck className="w-5 h-5 text-rose-gold" />
              <span>100% Authentic</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-charcoal/60">
              <RotateCcw className="w-5 h-5 text-rose-gold" />
              <span>30-Day Returns</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="pt-8">
            <div className="flex border-b border-charcoal/5 mb-6">
              {['description', 'ingredients', 'how to use'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-charcoal' : 'text-charcoal/40 hover:text-charcoal/60'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-gold" />
                  )}
                </button>
              ))}
            </div>
            <div className="text-charcoal/70 leading-relaxed">
              {activeTab === 'description' && <p>{product.description}</p>}
              {activeTab === 'ingredients' && (
                <ul className="list-disc list-inside space-y-2">
                  {(product.ingredients || []).map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>
              )}
              {activeTab === 'how to use' && (
                <p>Apply a small amount to clean skin. Gently pat until fully absorbed. Use morning and night for best results.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Routine Builder Feature */}
      <section className="mt-24 bg-soft-lavender/20 rounded-[3rem] p-12 md:p-20 text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl">Build Your Perfect Routine</h2>
          <p className="text-charcoal/60 max-w-xl mx-auto">Layer your products correctly for maximum effectiveness and that signature Seoul glow.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { step: 1, name: 'Cleanser', icon: '🧴' },
            { step: 2, name: 'Toner', icon: '💧' },
            { step: 3, name: 'Serum', icon: '✨' },
            { step: 4, name: 'Moisturizer', icon: '☁️' },
          ].map((s) => (
            <div key={s.step} className="group cursor-pointer">
              <div className="w-24 h-24 rounded-full glass flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                {s.icon}
              </div>
              <p className="text-xs font-medium uppercase tracking-widest text-charcoal/40 mb-1">Step {s.step}</p>
              <p className="font-medium text-charcoal">{s.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
