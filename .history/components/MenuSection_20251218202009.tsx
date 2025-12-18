import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SIGNATURE_BOWLS } from '../constants';
import { Star, Flame, MousePointerClick } from 'lucide-react';
import { SectionId, SignatureBowl } from '../types';
import SignatureOrderModal from './SignatureOrderModal';

const MenuSection: React.FC = () => {
  const [selectedBowl, setSelectedBowl] = useState<SignatureBowl | null>(null);

  return (
    <section id={SectionId.MENU} className="py-24 bg-white dark:bg-brand-dark transition-colors duration-300">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-orange font-semibold tracking-wider uppercase text-sm">Chef's Selection</span>
          <h2 className="text-4xl font-serif font-bold text-brand-dark dark:text-brand-cream mt-2">Signature Salad Bowls</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-xl mx-auto">
            Not sure what to build? Click on any bowl to order our nutritionist approved combinations instantly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {SIGNATURE_BOWLS.map((bowl, idx) => (
            <motion.div
              key={bowl.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              onClick={() => setSelectedBowl(bowl)}
              className="group relative bg-brand-cream dark:bg-neutral-800 rounded-3xl p-8 border border-transparent hover:border-brand-orange transition-all hover:shadow-2xl cursor-pointer active:scale-95"
            >
              {bowl.tag && (
                <span className="absolute top-6 right-6 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
                  <Flame size={12} /> {bowl.tag}
                </span>
              )}
              
              <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-700 shadow-sm flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                🥗
              </div>

              <h3 className="text-2xl font-serif font-bold text-brand-dark dark:text-brand-cream mb-2 group-hover:text-brand-orange transition-colors">{bowl.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                {bowl.ingredients}
              </p>

              <div className="flex justify-between items-center border-t border-gray-200 dark:border-neutral-700 pt-4">
                <div>
                   <span className="text-xs text-gray-500 dark:text-gray-500 block uppercase tracking-wider">Price</span>
                   <span className="text-xl font-bold text-brand-dark dark:text-brand-cream">₹{bowl.price}</span>
                </div>
                <div>
                   <span className="text-xs text-gray-500 dark:text-gray-500 block uppercase tracking-wider text-right">Serving</span>
                   <span className="text-sm font-medium text-brand-green">{bowl.calories} g</span>
                </div>
              </div>

              {/* Tap hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 dark:bg-black/10 backdrop-blur-[1px] rounded-3xl pointer-events-none">
                  <span className="bg-white dark:bg-neutral-900 text-brand-dark dark:text-brand-cream px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <MousePointerClick size={16} /> Order Now
                  </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <SignatureOrderModal 
        bowl={selectedBowl} 
        onClose={() => setSelectedBowl(null)} 
      />
    </section>
  );
};

export default MenuSection;