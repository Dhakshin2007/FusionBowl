import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';

const FloatingWhatsApp: React.FC = () => {
  const handleClick = () => {
    window.open('https://wa.me/917207003062?text=Hi%20Fusion%20Bowl!%20I%20would%20like%20to%20place%20an%20order.', '_blank');
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-full shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all group"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="font-bold text-lg">Order / Enquire</span>
      </motion.button>
    </motion.div>
  );
};

export default FloatingWhatsApp;