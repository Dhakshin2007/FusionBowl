import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

const FloatingWhatsApp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = () => {
    window.open('https://wa.me/917207003062?text=Hi%20Fusion%20Bowl!%20I%20would%20like%20to%20place%20an%20order.', '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 2, duration: 0.5 } }}
          exit={{ y: 50, opacity: 0, transition: { duration: 0.3 } }}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-gray-200 dark:border-neutral-700 text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="flex items-center gap-3 bg-[#25D366] text-white p-4 md:px-6 md:py-4 rounded-full shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all group"
          >
            <MessageCircle className="w-7 h-7 md:w-6 md:h-6 fill-white" />
            <span className="hidden md:block font-bold text-lg">Order / Enquire</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingWhatsApp;