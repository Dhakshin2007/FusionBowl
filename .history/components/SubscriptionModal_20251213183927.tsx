import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calendar, Info, Send, Scale } from 'lucide-react';
import { PLAN_FEATURES, SIZE_DETAILS, PRICING_MATRIX, PlanType, PlanDuration, PlanSize } from '../constants';
import Button from './Button';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [duration, setDuration] = useState<PlanDuration>('15 Days');
  const [planType, setPlanType] = useState<PlanType>('Standard');
  const [size, setSize] = useState<PlanSize>('Compact');

  if (!isOpen) return null;

  const currentPrice = PRICING_MATRIX[duration][planType][size];
  const currentFeatures = PLAN_FEATURES[planType];
  const currentWeight = SIZE_DETAILS[size];

  const handleSubscribe = () => {
    const text = `Hi Fusion Bowl! I would like to subscribe to the following plan:%0A%0A*Plan Type:* ${planType}%0A*Duration:* ${duration}%0A*Size:* ${size} (${currentWeight})%0A*Price:* ₹${currentPrice}%0A%0APlease confirm my subscription.`;
    window.open(`https://wa.me/917207003062?text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/10 dark:bg-white/10 rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          </button>

          {/* Left Side: Plan Info & Features */}
          <div className="w-full lg:w-2/5 bg-brand-cream dark:bg-neutral-800 p-8 overflow-y-auto border-r border-gray-100 dark:border-neutral-700">
            <h3 className="text-3xl font-serif font-bold text-brand-dark dark:text-brand-cream mb-2">Plan Details</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Choose the composition that fits your health goals.</p>
            
            <div className="space-y-6">
              {(Object.keys(PLAN_FEATURES) as PlanType[]).map((type) => (
                <div 
                  key={type} 
                  onClick={() => setPlanType(type)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    planType === type 
                      ? 'bg-white dark:bg-neutral-700 border-brand-orange shadow-lg scale-[1.02]' 
                      : 'bg-white/50 dark:bg-neutral-700/30 border-transparent hover:border-gray-200 dark:hover:border-neutral-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className={`font-bold text-lg ${planType === type ? 'text-brand-orange' : 'text-gray-800 dark:text-gray-200'}`}>
                      {type} Plan
                    </h4>
                    {planType === type && <Check className="w-5 h-5 text-brand-orange" />}
                  </div>
                  <ul className="space-y-2">
                    {PLAN_FEATURES[type].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 bg-brand-green rounded-full mt-1.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-xs text-orange-800 dark:text-orange-200 flex gap-2 items-start">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>Every Sunday is a Holiday. Subscription days are counted excluding Sundays.</p>
            </div>
          </div>

          {/* Right Side: Calculator & Config */}
          <div className="w-full lg:w-3/5 p-8 flex flex-col bg-white dark:bg-neutral-900">
             <div className="mb-8">
                <h3 className="text-2xl font-serif font-bold text-brand-dark dark:text-brand-cream mb-6">Configure Subscription</h3>
                
                {/* Duration Selector */}
                <div className="mb-8">
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Select Duration</label>
                  <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 dark:bg-neutral-800 rounded-xl">
                    {(['15 Days', '1 Month'] as PlanDuration[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`py-3 rounded-lg font-bold text-sm transition-all shadow-sm ${
                          duration === d
                            ? 'bg-white dark:bg-neutral-700 text-brand-dark dark:text-brand-cream shadow-md'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-transparent shadow-none'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Select Portion Size</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Mini', 'Compact', 'Grand'] as PlanSize[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`py-3 px-2 rounded-xl border-2 font-medium text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                          size === s
                            ? 'border-brand-green bg-green-50 dark:bg-green-900/20 text-brand-dark dark:text-brand-cream'
                            : 'border-gray-100 dark:border-neutral-800 text-gray-500 hover:border-gray-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        <span className="font-bold">{s}</span>
                        {/* Short weight display */}
                        <span className="text-[10px] opacity-70">
                           {s === 'Mini' ? '40-45g' : s === 'Compact' ? '50-60g' : '80-90g'}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 justify-center">
                    <Scale className="w-3 h-3" />
                    <span>Weight per item: {SIZE_DETAILS[size]}</span>
                  </div>
                </div>
             </div>

             {/* Summary & Price */}
             <div className="mt-auto bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800">
               <div className="flex justify-between items-end mb-6">
                 <div>
                   <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Subscription Cost</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-serif font-bold text-brand-dark dark:text-brand-cream">₹{currentPrice}</span>
                     <span className="text-sm text-gray-400">for {duration}</span>
                   </div>
                 </div>
                 <div className="text-right hidden sm:block">
                    <div className="text-xs text-brand-orange font-bold uppercase bg-brand-orange/10 px-2 py-1 rounded">
                      {planType} Plan
                    </div>
                 </div>
               </div>
               
               <Button onClick={handleSubscribe} className="w-full gap-2 text-lg py-4 shadow-xl shadow-brand-orange/20">
                 <Send className="w-5 h-5" /> Subscribe Now via WhatsApp
               </Button>
               <p className="text-[10px] text-center text-gray-400 mt-3">
                 Includes free delivery in NRT. Payments are handled securely via WhatsApp/UPI.
               </p>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;