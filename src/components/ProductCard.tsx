import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { Star, ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  key?: React.Key;
}

export const ProductCard = ({ product, onAddToCart, onClick, onToggleWishlist, isWishlisted }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer relative"
      onClick={() => onClick(product)}
    >
      <div className="bg-white p-8 aspect-square flex items-center justify-center overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-gold text-rose-gold' : 'text-charcoal'}`} />
          </button>
        )}
      </div>

      <div className="bg-[#F1F4F0] p-8 text-center space-y-4 min-h-[160px] flex flex-col justify-center">
        <h3 className="text-sm md:text-base font-medium text-charcoal leading-relaxed border-b border-charcoal/40 pb-1 inline-block mx-auto">
          {product.name}
        </h3>
        <p className="text-sm md:text-base text-charcoal/80 font-medium">
          ${product.price.toFixed(2)} USD
        </p>
      </div>
    </motion.div>
  );
};
