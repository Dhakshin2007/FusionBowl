import React from 'react';
import { motion } from 'framer-motion';
import { SIGNATURE_BOWLS } from '../constants';
import { Star, Flame } from 'lucide-react';
import { SectionId } from '../types';

const MenuSection: React.FC = () => {
  return (
    <section id={SectionId.MENU} className="py-24 bg-white dark:bg-brand-dark transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-orange font-semibold tracking-wider uppercase text-sm">Chef's Selection</span>
          <h2 className="text-4xl font-serif font-bold text-brand-dark dark:text-brand-cream mt-2">Signature Bowls</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-xl mx-auto">
            Not sure what to build? Try one of our perfectly balanced, nutritionist-approved combinations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {SIGNATURE_BOWLS.map((bowl, idx) => (
            <motion.div
              key={bowl.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-brand-cream dark:bg-neutral-800 rounded-3xl p-8 border border-transparent hover:border-brand-orange/20 transition-all hover:shadow-xl"
            >
              {bowl.tag && (
                <span className="absolute top-6 right-6 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Flame size={12} /> {bowl.tag}
                </span>
              )}
              
              <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-700 shadow-sm flex items-center justify-center text-3xl mb-6">
                🥗
              </div>

              <h3 className="text-2xl font-serif font-bold text-brand-dark dark:text-brand-cream mb-2">{bowl.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                {bowl.ingredients}
              </p>

              <div className="flex justify-between items-center border-t border-gray-200 dark:border-neutral-700 pt-4">
                <div>
                   <span className="text-xs text-gray-500 dark:text-gray-500 block uppercase tracking-wider">Price</span>
                   <span className="text-xl font-bold text-brand-dark dark:text-brand-cream">₹{bowl.price}</span>
                </div>
                <div>
                   <span className="text-xs text-gray-500 dark:text-gray-500 block uppercase tracking-wider text-right">Energy</span>
                   <span className="text-sm font-medium text-brand-green">{bowl.calories} kcal</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;