import React from 'react';
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export const Footer = ({ onPageChange }: FooterProps) => {
  return (
    <footer className="bg-charcoal text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-heading tracking-widest">SEOUL AURA</h2>
          <p className="text-white/60 font-light leading-relaxed">
            Bringing the authentic glow of Seoul to your doorstep. Modern K-beauty for the aesthetic soul.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-heading">Shop</h3>
          <ul className="space-y-3 text-white/60 font-light">
            <li><button onClick={() => onPageChange('shop')} className="hover:text-rose-gold transition-colors">Skincare</button></li>
            <li><button onClick={() => onPageChange('best-sellers')} className="hover:text-rose-gold transition-colors">Best Sellers</button></li>
            <li><button onClick={() => onPageChange('new')} className="hover:text-rose-gold transition-colors">New Arrivals</button></li>
            <li><button onClick={() => onPageChange('quiz')} className="hover:text-rose-gold transition-colors">Skin Analysis Quiz</button></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-heading">Support</h3>
          <ul className="space-y-3 text-white/60 font-light">
            <li><button onClick={() => onPageChange('shipping')} className="hover:text-rose-gold transition-colors">Shipping Policy</button></li>
            <li><button onClick={() => onPageChange('returns')} className="hover:text-rose-gold transition-colors">Returns & Exchanges</button></li>
            <li><button onClick={() => onPageChange('faqs')} className="hover:text-rose-gold transition-colors">FAQs</button></li>
            <li><button onClick={() => onPageChange('contact')} className="hover:text-rose-gold transition-colors">Contact Us</button></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-heading">Contact</h3>
          <ul className="space-y-4 text-white/60 font-light">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-rose-gold shrink-0" />
              <span>NBC-LEBANON</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-rose-gold shrink-0" />
              <span>+961 78 970 271</span>
            </li>
            <li className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-rose-gold shrink-0" />
              <span>seoulauraofficial</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/40">
        <p>© 2026 Seoul Aura. All rights reserved.</p>
        <div className="flex gap-8">
          <button onClick={() => onPageChange('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
          <button onClick={() => onPageChange('terms')} className="hover:text-white transition-colors">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
};
