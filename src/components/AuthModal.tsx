import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string }) => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    onLogin({
      name: formData.name || 'Aura Lover',
      email: formData.email
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-cream-white z-[101] rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="relative p-12">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-charcoal/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-4 mb-10">
                <h2 className="text-4xl font-heading">
                  {isLogin ? 'Welcome Back' : 'Join the Aura'}
                </h2>
                <p className="text-charcoal/60 text-sm">
                  {isLogin 
                    ? 'Sign in to access your wishlist and orders.' 
                    : 'Create an account for personalized skincare recommendations.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 ml-4">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                      <input 
                        required
                        type="text"
                        placeholder="Min-ji Kim"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white border border-charcoal/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-2 ring-rose-gold/20 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 ml-4">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                    <input 
                      required
                      type="email"
                      placeholder="aura@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white border border-charcoal/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-2 ring-rose-gold/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 ml-4">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                    <input 
                      required
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-white border border-charcoal/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-2 ring-rose-gold/20 transition-all"
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="text-right">
                    <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-rose-gold hover:text-rose-gold/80">
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-5 bg-charcoal text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-rose-gold transition-all flex items-center justify-center gap-2 group"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-sm text-charcoal/60">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-rose-gold font-bold hover:underline underline-offset-4"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
