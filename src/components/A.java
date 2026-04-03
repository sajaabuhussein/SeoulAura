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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [recommendedRoutine, setRecommendedRoutine] = useState<Product[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

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

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedProduct]);

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
      
      <Navbar 
        onCartClick={() => setIsCartOpen(true)} 
        onPageChange={(page) => {
          setCurrentPage(page);
          setSelectedProduct(null);
          // Reset shop state when navigating to a new main page from navbar
          if (page === 'shop' || page === 'best-sellers' || page === 'new') {
            setShopCategory('All');
            setShopSkinType('All');
            setShopPage(1);
          }
        }}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />

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
                onStartQuiz={() => setIsQuizOpen(true)}
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
                onBack={() => setCurrentPage(lastShopPage)}
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
                onBack={() => setCurrentPage(lastShopPage)}
                onComplete={() => {
                  alert('Thank you for your purchase! Your Seoul Aura is on its way.');
                  setCartItems([]);
                  setCurrentPage('home');
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
              <InfoPage type={currentPage} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer onPageChange={(page) => setCurrentPage(page)} />

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <SkinQuiz 
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onAddToCart={(p) => handleAddToCart(p)}
        onProductClick={handleProductClick}
        onToggleWishlist={handleToggleWishlist}
        wishlistItems={wishlistItems}
        onComplete={(result) => setQuizResult(result)}
      />
    </div>
  );
}
