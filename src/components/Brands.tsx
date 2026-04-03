import React from 'react';
import { motion } from 'motion/react';
import { BRANDS } from '../data';

export const Brands = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div className="space-y-4 mb-16 text-center">
        <h1 className="text-6xl font-heading">Our Brands</h1>
        <p className="text-charcoal/60 max-w-2xl mx-auto">Discover the most innovative and effective K-beauty brands, curated for your skin's unique needs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BRANDS.map((brand, index) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative h-[300px] overflow-hidden rounded-2xl cursor-pointer"
          >
            <img
              src={brand.image}
              alt={brand.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex flex-col justify-center items-center p-6 text-center">
              <h3 className="text-2xl text-white font-heading mb-2">{brand.name}</h3>
              <p className="text-white/80 text-xs mb-4 line-clamp-2">{brand.description}</p>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
