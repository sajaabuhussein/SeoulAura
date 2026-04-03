import React from 'react';
import { motion } from 'motion/react';
import { PRODUCTS, CATEGORIES, REVIEWS, BRANDS } from '../data';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { ArrowRight, Star, Quote } from 'lucide-react';

interface HomeProps {
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onShopNow: () => void;
}

export const Home = ({ onAddToCart, onProductClick, onShopNow }: HomeProps) => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
         <img
           src="https://images.squarespace-cdn.com/content/v1/63a5c9f9b3795a61ee469725/ed83d837-8a2c-4dff-961c-29591e67528f/AdobeStock_475061218+K+Beauty.jpeg"
           alt="Hero"
           className="w-full h-full object-cover object-[center_1%] opacity-100"
           referrerPolicy="no-referrer"
         />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream-white/10 to-cream-white" />
        </div>

        <div className="relative z-10 text-center space-y-8 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-8xl font-heading text-charcoal leading-tight">
              Glow the <br /> <span className="text-rose-gold italic">Seoul</span> Way
            </h1>
            <p className="text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto font-light tracking-wide">
                          Discover the Essence of Korean Beauty

                        </p>
                        <p className="text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto font-light tracking-wide">
                   Minimal, effective skincare designed to reveal your natural radiance.
                        </p>

          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={onShopNow}
              className="px-10 py-4 bg-charcoal text-white rounded-full font-medium uppercase tracking-widest hover:bg-rose-gold transition-all hover:scale-105 shadow-xl shadow-charcoal/10"
            >
              Shop Now
            </button>
            <button className="px-10 py-4 glass rounded-full font-medium uppercase tracking-widest hover:bg-white transition-all">
              Explore Collections
            </button>
          </motion.div>
        </div>

      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl">Featured Products</h2>
            <p className="text-charcoal/60">Our most loved K-beauty essentials</p>
          </div>
          <button 
            onClick={onShopNow}
            className="flex items-center gap-2 text-charcoal font-medium hover:text-rose-gold transition-colors group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onClick={onProductClick}
            />
          ))}
        </div>
      </section>

      {/* Trending Brands */}
      <section className="bg-soft-lavender/30 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl mb-12 text-center">Trending Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRANDS.map((brand) => (
              <motion.div 
                key={brand.id}
                whileHover={{ y: -10 }}
                className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer"
              >
                <img src={brand.image} alt={brand.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-heading">{brand.name}</h3>
                  <p className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">Explore Brand</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl">What Our Aura Community Says</h2>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-rose-gold text-rose-gold" />)}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div key={review.id} className="glass p-8 rounded-3xl space-y-6 relative">
              <Quote className="absolute top-6 right-8 w-12 h-12 text-rose-gold/10" />
              <p className="text-lg italic text-charcoal/80 leading-relaxed">"{review.comment}"</p>
              <div className="flex items-center gap-4">
                <img src={review.image} alt={review.user} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-semibold">{review.user}</p>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-rose-gold text-rose-gold" />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

     
    </div>
  );
};
