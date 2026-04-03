/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Shop } from './components/Shop';
import { Brands } from './components/Brands';
import { About } from './components/About';
import { ProductDetail } from './components/ProductDetail';
import { Checkout } from './components/Checkout';
import { CartSidebar } from './components/CartSidebar';
import { WishlistSidebar } from './components/WishlistSidebar';
import { SearchOverlay } from './components/SearchOverlay';
import { Footer } from './components/Footer';
import { SakuraPetals } from './components/SakuraPetals';
import { SkinQuiz } from './components/SkinQuiz';
import { InfoPage } from './components/InfoPage';
import { Product, CartItem } from './types';
import { PRODUCTS } from './data';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [lastShopPage, setLastShopPage] = useState('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('seoul_aura_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quizResult, setQuizResult] = useState<string | null>(() => {
    const saved = localStorage.getItem('skin_quiz_result');
    if (saved) {
      const parsed = JSON.parse(saved);
      return `${parsed.skinType}${parsed.concerns?.length > 0 ? ` + ${parsed.concerns.join(', ')}` : ''}`;
    }
    return null;
  });
  const [recommendedRoutine, setRecommendedRoutine] = useState<Product[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    const saved = localStorage.getItem('seoul_aura_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('seoul_aura_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('seoul_aura_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    if (quizResult) {
      const categories = ['Cleansers', 'Toners & Essences', 'Serums & Ampoules', 'Moisturizers'];
      const routine: Product[] = [];

      categories.forEach(cat => {
        const matches = PRODUCTS.filter(p =>
          p.category === cat &&
          (p.skinType.includes(quizResult) || p.skinType.includes('All'))
        );
        const bestMatch = matches.sort((a, b) => b.rating - a.rating)[0];
        if (bestMatch) routine.push(bestMatch);
      });
      setRecommendedRoutine(routine);
    }
  }, [quizResult]);

  // Shop State Persistence
  const [shopCategory, setShopCategory] = useState('All');
  const [shopSkinType, setShopSkinType] = useState('All');
  const [shopPage, setShopPage] = useState(1);
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});

  // Scroll management
  useEffect(() => {
    const savedPos = scrollPositions[currentPage] || 0;
    window.scrollTo(0, savedPos);
  }, [currentPage, selectedProduct]);

  // Reset to top on initial load/refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    setScrollPositions({});
  }, []);

  const handlePageChange = (page: string, isBack: boolean = false) => {
    const currentScroll = window.scrollY;

    // Save current scroll position before changing
    setScrollPositions(prev => {
      const newPositions = { ...prev, [currentPage]: currentScroll };
      if (!isBack) {
        // Reset scroll for the target page if it's a direct navigation
        newPositions[page] = 0;
      }
      return newPositions;
    });

    setCurrentPage(page);
    setSelectedProduct(null);

    // Reset shop state when navigating via Navbar/Footer (not back)
    if (!isBack && (page === 'shop' || page === 'best-sellers' || page === 'new')) {
      setShopCategory('All');
      setShopSkinType('All');
      setShopPage(1);
    }
  };

  // Prevent background scrolling when quiz is open
  useEffect(() => {
    if (currentPage === 'quiz') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [currentPage]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  };

  const handleProductClick = (product: Product) => {
    setScrollPositions(prev => ({
      ...prev,
      [currentPage]: window.scrollY,
      product: 0 // Reset product page scroll to top
    }));
    setLastShopPage(currentPage);
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen selection:bg-rose-gold/30">
      <SakuraPetals />

      <div className={`transition-opacity duration-500 ${currentPage === 'quiz' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Navbar
          onCartClick={() => setIsCartOpen(true)}
          onWishlistClick={() => setIsWishlistOpen(true)}
          onSearchClick={() => setIsSearchOpen(true)}
          onQuizClick={() => setCurrentPage('quiz')}
          onPageChange={handlePageChange}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />
      </div>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Home
                onAddToCart={(p) => handleAddToCart(p)}
                onProductClick={handleProductClick}
                onShopNow={() => setCurrentPage('shop')}
                onStartQuiz={() => setCurrentPage('quiz')}
                quizResult={quizResult}
                recommendedRoutine={recommendedRoutine}
              />
            </motion.div>
          )}

          {currentPage === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Shop
                onAddToCart={(p) => handleAddToCart(p)}
                onProductClick={handleProductClick}
                onQuizClick={() => setCurrentPage('quiz')}
                onToggleWishlist={handleToggleWishlist}
                wishlistItems={wishlistItems}
                selectedCategory={shopCategory}
                setSelectedCategory={setShopCategory}
                selectedSkinType={shopSkinType}
                setSelectedSkinType={setShopSkinType}
                currentPage={shopPage}
                setCurrentPage={setShopPage}
              />
            </motion.div>
          )}

          {currentPage === 'brands' && (
            <motion.div
              key="brands"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Brands />
            </motion.div>
          )}

          {currentPage === 'best-sellers' && (
            <motion.div
              key="best-sellers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Shop
                onAddToCart={(p) => handleAddToCart(p)}
                onProductClick={handleProductClick}
                onQuizClick={() => setCurrentPage('quiz')}
                onToggleWishlist={handleToggleWishlist}
                wishlistItems={wishlistItems}
                title="Best Sellers"
                subtitle="Our most loved products, chosen by you"
                filterType="best-seller"
                selectedCategory={shopCategory}
                setSelectedCategory={setShopCategory}
                selectedSkinType={shopSkinType}
                setSelectedSkinType={setShopSkinType}
                currentPage={shopPage}
                setCurrentPage={setShopPage}
              />
            </motion.div>
          )}

          {currentPage === 'new' && (
            <motion.div
              key="new"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Shop
                onAddToCart={(p) => handleAddToCart(p)}
                onProductClick={handleProductClick}
                onQuizClick={() => setCurrentPage('quiz')}
                onToggleWishlist={handleToggleWishlist}
                wishlistItems={wishlistItems}
                title="New Arrivals"
                subtitle="The latest innovations from Seoul"
                filterType="new"
                selectedCategory={shopCategory}
                setSelectedCategory={setShopCategory}
                selectedSkinType={shopSkinType}
                setSelectedSkinType={setShopSkinType}
                currentPage={shopPage}
                setCurrentPage={setShopPage}
              />
            </motion.div>
          )}

          {currentPage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <About />
            </motion.div>
          )}

          {currentPage === 'product' && selectedProduct && (
            <motion.div
              key="product"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductDetail
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onBack={() => handlePageChange(lastShopPage, true)}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistItems.some(item => item.id === selectedProduct.id)}
              />
            </motion.div>
          )}

          {currentPage === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Checkout
                total={cartTotal}
                onBack={() => handlePageChange(lastShopPage, true)}
                onComplete={() => {
                  alert('Thank you for your purchase! Your Seoul Aura is on its way.');
                  setCartItems([]);
                  handlePageChange('home');
                }}
              />
            </motion.div>
          )}

          {['shipping', 'returns', 'faqs', 'contact', 'privacy', 'terms'].includes(currentPage) && (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InfoPage
                type={currentPage}
                onBack={() => handlePageChange('home', true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {currentPage === 'quiz' && (
          <motion.div
            key="quiz-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-cream-white overflow-hidden"
          >
            <SkinQuiz
              isOpen={true}
              onClose={() => handlePageChange('home', true)}
              onAddToCart={(p) => handleAddToCart(p)}
              onProductClick={handleProductClick}
              onToggleWishlist={handleToggleWishlist}
              wishlistItems={wishlistItems}
              onComplete={(result) => setQuizResult(result)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`transition-opacity duration-500 ${currentPage === 'quiz' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Footer onPageChange={handlePageChange} />
      </div>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
        onQuizClick={() => setCurrentPage('quiz')}
        onPageChange={setCurrentPage}
      />

      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistItems}
        onRemove={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onProductClick={handleProductClick}
      />
    </div>
  );
}
