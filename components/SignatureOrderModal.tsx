import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, MapPin, Send } from 'lucide-react';
import { SignatureBowl } from '../types';
import Button from './Button';

interface SignatureOrderModalProps {
  bowl: SignatureBowl | null;
  onClose: () => void;
}

const SignatureOrderModal: React.FC<SignatureOrderModalProps> = ({ bowl, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');

  if (!bowl) return null;

  const totalPrice = bowl.price * quantity;

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => Math.max(1, q - 1));

  const handleOrder = () => {
    let message = `Hi Fusion Bowl! I would like to order a Signature Bowl:\n\n*${bowl.name}* x${quantity}\n*Price:* ₹${totalPrice}`;
    
    if (address.trim()) {
      message += `\n\n*Delivery Address:*\n${address.trim()}`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/917207003062?text=${encodedMessage}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        >
            {/* Header */}
            <div className="bg-brand-cream dark:bg-neutral-800 p-6 border-b border-gray-100 dark:border-neutral-700 flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-serif font-bold text-brand-dark dark:text-brand-cream">{bowl.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">₹{bowl.price} per bowl</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 bg-white dark:bg-neutral-700 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
                
                {/* Quantity */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Number of Bowls</label>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleDecrement}
                            className="p-3 rounded-xl bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <Minus className="w-4 h-4 text-brand-dark dark:text-brand-cream" />
                        </button>
                        <span className="text-xl font-bold w-8 text-center text-brand-dark dark:text-white">{quantity}</span>
                        <button 
                            onClick={handleIncrement}
                            className="p-3 rounded-xl bg-brand-orange text-white hover:bg-orange-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 text-brand-orange" /> Delivery Address
                    </label>
                    <textarea 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House No, Street, Landmark..."
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none resize-none h-24 text-sm dark:text-gray-200 placeholder:text-gray-400"
                    />
                </div>

                {/* Total & Action */}
                <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Total Amount</span>
                        <span className="text-2xl font-serif font-bold text-brand-dark dark:text-brand-cream">₹{totalPrice}</span>
                    </div>
                    <Button onClick={handleOrder} className="w-full gap-2">
                        <Send className="w-4 h-4" /> Order Now
                    </Button>
                </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SignatureOrderModal;