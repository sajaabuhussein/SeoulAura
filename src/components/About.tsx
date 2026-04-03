import React from 'react';
import { motion } from 'motion/react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <h1 className="text-6xl font-heading leading-tight">The Essence of <br /> <span className="text-rose-gold italic">Seoul Aura</span></h1>
          <p className="text-lg text-charcoal/70 leading-relaxed">
            Born in the heart of Seoul, Seoul Aura brings the sophisticated, effective, and innovative world of K-beauty to your doorstep. We believe that beauty is an aura—a reflection of your inner health and confidence.
          </p>
          <p className="text-lg text-charcoal/70 leading-relaxed">
            Our mission is to curate only the highest quality products that combine traditional Korean herbal wisdom with cutting-edge dermatological science. Every product in our collection is hand-picked and tested by our experts.
          </p>
          
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="space-y-2">
              <h4 className="text-3xl font-heading">100%</h4>
              <p className="text-xs uppercase tracking-widest text-charcoal/50">Authentic Products</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-heading">50+</h4>
              <p className="text-xs uppercase tracking-widest text-charcoal/50">Happy Customers</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
            <img 
              src="https://i.pinimg.com/736x/a3/00/82/a30082fb1dcb524f0162c411aeba0b9a.jpg"
              alt="Seoul Cityscape"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-rose-gold/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-soft-lavender/20 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </div>
  );
};
