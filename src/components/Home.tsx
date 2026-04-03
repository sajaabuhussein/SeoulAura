import React from 'react';
import { motion } from 'motion/react';
import { PRODUCTS, CATEGORIES, REVIEWS, BRANDS } from '../data';
import { ProductCard } from './ProductCard';
import { Product, RecommendedProduct } from '../types';
import { ArrowRight, Star, Quote, RefreshCw } from 'lucide-react';

interface HomeProps {
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onShopNow: () => void;
  onExploreBrands: () => void;
  onStartQuiz: () => void;
  quizResult: string | null;
  recommendedRoutine: { AM: RecommendedProduct[]; PM: RecommendedProduct[] } | null;
}

export const Home = ({ onAddToCart, onProductClick, onShopNow, onExploreBrands, onStartQuiz, quizResult, recommendedRoutine }: HomeProps) => {
  const [activeTab, setActiveTab] = React.useState<'AM' | 'PM'>('AM');
  const currentRoutine = recommendedRoutine ? recommendedRoutine[activeTab] : [];
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.squarespace-cdn.com/content/v1/63a5c9f9b3795a61ee469725/ed83d837-8a2c-4dff-961c-29591e67528f/AdobeStock_475061218+K+Beauty.jpeg"
            alt="Hero"
            className="w-full h-full object-cover object-[center_1%] opacity-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream-white/10 to-cream-white" />
        </div>

        <div className="relative z-10 text-center space-y-8 px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-heading text-charcoal leading-tight">
              Glow the <br /> <span className="text-rose-gold italic">Seoul</span> Way
            </h1>
            <div className="space-y-2">
              <p className="text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto font-light tracking-wide">
                Discover the Essence of Korean Beauty
              </p>
              <p className="text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto font-light tracking-wide">
                Minimal, effective skincare designed to reveal your natural radiance.
              </p>
            </div>
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
            <button
              onClick={onExploreBrands}
              className="px-10 py-4 glass rounded-full font-medium uppercase tracking-widest hover:bg-rose-gold transition-all hover:scale-105 shadow-xl shadow-charcoal/10"
            >
              Explore Brands
            </button>
          </motion.div>
        </div>

      </section>

      {/* Routine Section */}
      <section className="max-w-7xl mx-auto px-6">
        {quizResult && recommendedRoutine ? (
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-charcoal/5 border border-charcoal/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-rose-gold" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-rose-gold font-bold">Your Personalized Routine</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-heading leading-tight">Recommended for Your {quizResult} Skin</h2>
              </div>

              <div className="flex gap-4 p-1 bg-charcoal/5 rounded-full">
                {['AM', 'PM'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveTab(mode as 'AM' | 'PM')}
                    className={`px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                      activeTab === mode ? 'bg-white text-charcoal shadow-md' : 'text-charcoal/40 hover:text-charcoal/60'
                    }`}
                  >
                    {mode} Routine
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentRoutine.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                  onClick={() => onProductClick(product)}
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Step {i + 1}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-rose-gold font-bold">{product.brand}</p>
                        <h4 className="font-heading text-lg group-hover:text-rose-gold transition-colors">{product.name}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-charcoal/60 line-clamp-2">{product.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 pt-12 border-t border-charcoal/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={onStartQuiz}
                  className="flex items-center gap-2 text-charcoal/40 hover:text-rose-gold font-bold uppercase tracking-widest text-[10px] transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Retake Analysis
                </button>
                <p className="text-charcoal/40 text-sm italic">Recommended products based on your AI skin analysis.</p>
              </div>
              <button
                onClick={onShopNow}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal hover:text-rose-gold transition-colors group"
              >
                Shop Full Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          <div className="">



          </div>
        )}
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
                onClick={onExploreBrands}
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

      {/* Instagram Gallery */}

    </div>
  );
};
