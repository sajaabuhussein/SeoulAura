import React from 'react';
import { ShoppingBag, User, Heart, Search, Menu } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  onSearchClick: () => void;
  onPageChange: (page: string) => void;
  onQuizClick: () => void;
  cartCount: number;
}

export const Navbar = ({ onCartClick, onWishlistClick, onSearchClick, onPageChange, onQuizClick, cartCount }: NavbarProps) => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-charcoal text-white py-2 text-[10px] uppercase tracking-[0.3em] text-center font-medium">
        Special Offers are <span className="text-rose-gold font-bold">Coming Soon</span>
      </div>
      <nav className="fixed top-8 left-0 right-0 z-40 glass h-20 flex items-center px-6 md:px-12 justify-between">
      <div className="flex items-center gap-8">
        <button className="lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <button
          onClick={() => onPageChange('home')}
          className="text-2xl font-heading tracking-widest text-charcoal whitespace-nowrap"
        >
          SEOUL AURA
        </button>
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-medium uppercase tracking-[0.2em]">
          <button onClick={() => onPageChange('home')} className="hover:text-rose-gold transition-colors">Home</button>
          <button onClick={() => onPageChange('shop')} className="hover:text-rose-gold transition-colors">Shop</button>
          <button onClick={() => onQuizClick()} className="hover:text-rose-gold transition-colors">
            Skin Quiz
          </button>
          <button onClick={() => onPageChange('brands')} className="hover:text-rose-gold transition-colors">Brands</button>
          <button onClick={() => onPageChange('best-sellers')} className="hover:text-rose-gold transition-colors">Best Sellers</button>
          <button onClick={() => onPageChange('new')} className="hover:text-rose-gold transition-colors">New</button>
          <button onClick={() => onPageChange('about')} className="hover:text-rose-gold transition-colors">About</button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={onSearchClick}
          className="hover:text-rose-gold transition-colors"
        >
          <Search className="w-5 h-5 stroke-[1.5]" />
        </button>
        <button
          onClick={onWishlistClick}
          className="hover:text-rose-gold transition-colors hidden sm:block"
        >
          <Heart className="w-5 h-5 stroke-[1.5]" />
        </button>
        <button
          onClick={onCartClick}
          className="relative hover:text-rose-gold transition-colors"
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
              {cartCount}
            </span>
          )}
        </button>
        <button className="hover:text-rose-gold transition-colors">
          <User className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>
    </nav>
    </>
  );
};
