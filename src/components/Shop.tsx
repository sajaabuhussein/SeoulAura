import React from 'react';
import { motion } from 'motion/react';
import { PRODUCTS } from '../data';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface ShopProps {
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onQuizClick: () => void;
  onToggleWishlist: (product: Product) => void;
  wishlistItems: Product[];
  title?: string;
  subtitle?: string;
  filterType?: 'new' | 'best-seller' | 'all';
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedSkinType: string;
  setSelectedSkinType: React.Dispatch<React.SetStateAction<string>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Shop = ({
  onAddToCart,
  onProductClick,
  onQuizClick,
  onToggleWishlist,
  wishlistItems,
  title = "Shop All",
  subtitle = "Discover your new favorite K-beauty routine",
  filterType = 'all',
  selectedCategory,
  setSelectedCategory,
  selectedSkinType,
  setSelectedSkinType,
  currentPage,
  setCurrentPage
}: ShopProps) => {
  const itemsPerPage = 8;

  const categories = ['All', 'Cleansers', 'Toners & Essences', 'Serums & Ampoules', 'Moisturizers', 'Sun Care', 'Masks & Treatments'];
  const skinTypes = ['All', 'Oily', 'Dry', 'Combination', 'Sensitive', 'Normal', 'Acne-Prone', 'Dehydrated', 'Dull', 'Mature', 'Redness', 'Large Pores'];

  const filteredProducts = PRODUCTS.filter(p => {
    const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
    const skinTypeMatch = selectedSkinType === 'All' || p.skinType.includes(selectedSkinType) || p.skinType.includes('All');

    let typeMatch = true;
    if (filterType === 'new') typeMatch = !!p.isNew;
    if (filterType === 'best-seller') typeMatch = !!p.isBestSeller;

    return categoryMatch && skinTypeMatch && typeMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div className="space-y-16 mb-20">
        {/* Skin Quiz Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-soft-lavender/30 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/50"
        >
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-heading text-charcoal">Not sure what to pick?</h3>
            <p className="text-charcoal/60 font-light max-w-md">Take our 1-minute skin analysis quiz and get a personalized 4-step routine tailored to your skin type.</p>
          </div>
          <button
            onClick={onQuizClick}
            className="px-10 py-4 bg-charcoal text-white rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-rose-gold transition-all shadow-xl shadow-charcoal/10 whitespace-nowrap"
          >
            Start Skin Analysis
          </button>
        </motion.div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-8 bg-rose-gold" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-rose-gold font-bold">Collections</span>
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-heading leading-tight">{title}</h1>
            <p className="text-charcoal/60 text-lg font-light leading-relaxed">{subtitle}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-rose-gold font-bold">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <div className="relative w-full lg:w-72 group">
              <label className="text-[10px] uppercase tracking-[0.3em] text-charcoal/40 mb-3 block font-bold transition-colors group-focus-within:text-rose-gold">
                Filter by Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full appearance-none bg-transparent border-b border-charcoal/10 py-3 pr-10 text-xs uppercase tracking-widest font-bold focus:outline-none focus:border-rose-gold transition-all cursor-pointer hover:border-charcoal/30"
                >
                  {categories.map(c => <option key={c} value={c} className="text-charcoal uppercase tracking-widest font-bold">{c}</option>)}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-charcoal/30 group-hover:text-charcoal transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <SlidersHorizontal className="w-4 h-4 text-rose-gold" />
            <label className="text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-bold">Filter by Skin Type</label>
          </div>
          <div className="flex flex-wrap gap-3">
            {skinTypes.map(type => (
              <button
                key={type}
                onClick={() => { setSelectedSkinType(type); setCurrentPage(1); }}
                className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.15em] font-bold transition-all duration-300 border ${
                  selectedSkinType === type
                    ? 'bg-charcoal text-white border-charcoal shadow-xl shadow-charcoal/10 scale-105'
                    : 'bg-white text-charcoal/40 border-charcoal/5 hover:border-rose-gold/30 hover:text-rose-gold'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onClick={onProductClick}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={wishlistItems.some(item => item.id === product.id)}
          />
        ))}
      </div>

      {filteredProducts.length > itemsPerPage && (
        <div className="mt-16 flex justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 flex items-center justify-center text-sm transition-all ${
                  currentPage === i + 1
                    ? 'border-b-2 border-charcoal text-charcoal font-medium'
                    : 'text-charcoal/40 hover:text-charcoal'
                }`}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 3 && currentPage < totalPages - 1 && (
              <>
                <span className="text-charcoal/40">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-10 h-10 flex items-center justify-center text-sm transition-all ${
                    currentPage === totalPages
                      ? 'border-b-2 border-charcoal text-charcoal font-medium'
                      : 'text-charcoal/40 hover:text-charcoal'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center text-charcoal/40 hover:text-charcoal disabled:opacity-20"
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <p className="text-xl text-charcoal/40 font-heading">No products found for these filters</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedSkinType('All'); setCurrentPage(1); }}
            className="text-rose-gold font-medium underline underline-offset-4"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
