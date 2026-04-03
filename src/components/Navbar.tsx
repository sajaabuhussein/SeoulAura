import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  onSearchClick: () => void;
  onPageChange: (page: string) => void;
  onQuizClick: () => void;
  cartCount: number;
}

export const Navbar = ({ onCartClick, onWishlistClick, onSearchClick, onPageChange, onQuizClick, cartCount }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Brands', page: 'brands' },
    { label: 'Best Sellers', page: 'best-sellers' },
    { label: 'New', page: 'new' },
    { label: 'About', page: 'about' },
  ];

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-charcoal text-white py-2 text-[10px] uppercase tracking-[0.3em] text-center font-medium">
        Special Offers are <span className="text-rose-gold font-bold">Coming Soon</span>
      </div>
      <nav className="fixed top-8 left-0 right-0 z-40 glass h-20 flex items-center px-6 md:px-12 justify-between">
        <div className="flex items-center gap-8">
          <button
            className="lg:hidden hover:text-rose-gold transition-colors"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <button
            onClick={() => handlePageChange('home')}
            className="text-2xl font-heading tracking-widest text-charcoal whitespace-nowrap"
          >
            SEOUL AURA
          </button>
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-medium uppercase tracking-[0.2em]">
            <button onClick={() => handlePageChange('home')} className="hover:text-rose-gold transition-colors">Home</button>
            <button onClick={() => handlePageChange('shop')} className="hover:text-rose-gold transition-colors">Shop</button>
            <button onClick={() => { onQuizClick(); setIsMenuOpen(false); }} className="hover:text-rose-gold transition-colors">
              Skin Quiz
            </button>
            <button onClick={() => handlePageChange('brands')} className="hover:text-rose-gold transition-colors">Brands</button>
            <button onClick={() => handlePageChange('best-sellers')} className="hover:text-rose-gold transition-colors">Best Sellers</button>
            <button onClick={() => handlePageChange('new')} className="hover:text-rose-gold transition-colors">New</button>
            <button onClick={() => handlePageChange('about')} className="hover:text-rose-gold transition-colors">About</button>
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
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-cream-white shadow-2xl flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-charcoal/5">
                <span className="text-xl font-heading tracking-widest text-charcoal">MENU</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-charcoal/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-charcoal" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="flex flex-col gap-6">
                  {navItems.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => handlePageChange(item.page)}
                      className="text-2xl font-heading text-left text-charcoal hover:text-rose-gold transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => { onQuizClick(); setIsMenuOpen(false); }}
                    className="text-2xl font-heading text-left text-rose-gold hover:opacity-80 transition-opacity"
                  >
                    Skin Quiz
                  </button>
                </div>

                <div className="pt-8 border-t border-charcoal/5 space-y-6">
                  <button
                    onClick={() => { onWishlistClick(); setIsMenuOpen(false); }}
                    className="flex items-center gap-4 text-charcoal/60 hover:text-charcoal transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-widest">Wishlist</span>
                  </button>
                </div>
              </div>


            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};