import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calendar, Info, Send, Scale, EyeOff, SlidersHorizontal, ListChecks, Star, ChevronRight, ChevronLeft, LayoutGrid } from 'lucide-react';
import { PLAN_FEATURES, PLAN_CATEGORIES_MAP, SIZE_DETAILS, PRICING_MATRIX, SUB_MENU_ITEMS, PlanType, PlanDuration, PlanSize } from '../constants';
import Button from './Button';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState<PlanDuration>('15 Days');
  const [planType, setPlanType] = useState<PlanType>('Standard');
  const [size, setSize] = useState<PlanSize>('Compact');
  const [isMobile, setIsMobile] = useState(false);
  
  // State for excluded items: Record<CategoryName, ItemName[]>
  const [exclusions, setExclusions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleExclusion = (category: string, itemName: string) => {
    setExclusions(prev => {
      const currentCategoryExclusions = prev[category] || [];
      const isExcluded = currentCategoryExclusions.includes(itemName);
      
      return {
        ...prev,
        [category]: isExcluded 
          ? currentCategoryExclusions.filter(i => i !== itemName)
          : [...currentCategoryExclusions, itemName]
      };
    });
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  if (!isOpen) return null;

  const currentPrice = PRICING_MATRIX[duration][planType][size];
  const currentCategories = PLAN_CATEGORIES_MAP[planType];
  const currentWeight = SIZE_DETAILS[size];

  const handleSubscribe = () => {
    let message = `Hi Fusion Bowl! I would like to subscribe to the following plan:%0A%0A`;
    message += `*Plan Type:* ${planType}%0A`;
    message += `*Duration:* ${duration}%0A`;
    message += `*Size:* ${size} (${currentWeight})%0A`;
    message += `*Price:* ₹${currentPrice}%0A%0A`;
    message += `Please confirm my subscription.%0A%0A`;

    const hasExclusions = Object.values(exclusions).some((list: string[]) => list.length > 0);
    if (hasExclusions) {
      message += `*My Preferences (Exclusions):*%0A`;
      Object.entries(exclusions).forEach(([category, items]: [string, string[]]) => {
        if (items.length > 0) {
          message += `Excluding ${items.join(', ')} in ${category}%0A`;
        }
      });
    }

    window.open(`https://wa.me/917207003062?text=${message}`, '_blank');
  };

  const renderPlanSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <ListChecks className="text-brand-orange w-6 h-6" />
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark dark:text-brand-cream">Plan Selection</h3>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Step 1: Choose your daily nutrient profile.</p>
      
      <div className="space-y-4">
        {(Object.keys(PLAN_FEATURES) as PlanType[]).map((type) => {
          const isActive = planType === type;
          return (
            <motion.div 
              key={type} 
              onClick={() => {
                  setPlanType(type);
                  setExclusions({}); 
                  if (isMobile) handleNext();
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-5 md:p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${
                isActive 
                  ? 'bg-white dark:bg-neutral-800 border-brand-orange shadow-xl shadow-orange-500/10' 
                  : 'bg-white/40 dark:bg-neutral-900/40 border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className={`text-lg font-bold ${isActive ? 'text-brand-orange' : 'text-gray-800 dark:text-gray-200'}`}>
                  {type} Plan
                </h4>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'border-brand-orange bg-brand-orange text-white' : 'border-gray-300 dark:border-neutral-700'}`}>
                  {isActive && <Check className="w-3 h-3" />}
                </div>
              </div>

              <ul className="space-y-1.5">
                {PLAN_FEATURES[type].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>
    </div>
  );

  const renderConfigSelection = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <LayoutGrid className="text-brand-orange w-6 h-6" />
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark dark:text-brand-cream">Duration & Size</h3>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Step 2: When and how much do you need?</p>

      <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Plan Duration</label>
            <div className="grid grid-cols-2 gap-3">
              {(['15 Days', '1 Month'] as PlanDuration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                    duration === d
                      ? 'bg-brand-orange/5 border-brand-orange text-brand-orange shadow-md'
                      : 'bg-gray-50 dark:bg-neutral-800 border-transparent text-gray-500'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Portion Size</label>
            <div className="grid grid-cols-1 gap-3">
              {(['Mini', 'Compact', 'Grand'] as PlanSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`p-4 rounded-2xl font-bold transition-all border-2 text-left flex justify-between items-center ${
                    size === s
                      ? 'bg-green-50 dark:bg-green-900/10 border-brand-green text-brand-dark dark:text-brand-cream'
                      : 'bg-gray-50 dark:bg-neutral-800 border-transparent text-gray-400'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm">{s}</span>
                    <span className="text-[10px] opacity-60 font-medium">{SIZE_DETAILS[s]}</span>
                  </div>
                  {size === s && <Check className="w-5 h-5 text-brand-green" />}
                </button>
              ))}
            </div>
          </div>
      </div>

      <div className="p-4 bg-orange-100/50 dark:bg-orange-900/10 rounded-2xl text-[11px] text-orange-800 dark:text-orange-200 flex gap-3 border border-orange-200/50">
        <Info className="w-4 h-4 flex-shrink-0" />
        <p className="leading-relaxed">Sundays are holidays. Your subscription will be extended automatically for any missed Sundays.</p>
      </div>
    </div>
  );

  const renderRotationSelection = () => (
    <div className="flex flex-col h-full">
       <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-orange/10 rounded-lg">
            <SlidersHorizontal className="text-brand-orange w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-brand-dark dark:text-brand-cream">Exclusions</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Step 3: What should we skip?</p>
          </div>
       </div>
       
       <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-8 pb-4">
          {currentCategories.map(catName => {
              const items = SUB_MENU_ITEMS[catName] || [];
              const catExclusions = exclusions[catName] || [];
              
              return (
                  <div key={catName}>
                      <div className="flex items-center gap-2 mb-3">
                          <h4 className="text-[10px] font-black uppercase text-brand-orange tracking-widest">{catName}</h4>
                          <div className="h-[1px] flex-grow bg-gray-100 dark:bg-neutral-800" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                          {items.map(item => {
                              const isExcluded = catExclusions.includes(item.name);
                              return (
                                  <button
                                    key={item.name}
                                    onClick={() => toggleExclusion(catName, item.name)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all duration-300 ${
                                        isExcluded 
                                        ? 'bg-gray-50 dark:bg-neutral-900 text-gray-400 border-dashed border-gray-200 dark:border-neutral-800' 
                                        : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-200 border-white dark:border-neutral-800 hover:border-brand-orange shadow-sm'
                                    }`}
                                  >
                                      <span className={isExcluded ? 'grayscale opacity-30' : ''}>{item.emoji}</span>
                                      <span className={isExcluded ? 'line-through' : ''}>{item.name}</span>
                                      {isExcluded && <EyeOff size={10} className="text-red-400 ml-1" />}
                                  </button>
                              );
                          })}
                      </div>
                  </div>
              );
          })}
       </div>
    </div>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />
        
        <motion.div
          initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative bg-white dark:bg-neutral-950 md:rounded-[2.5rem] shadow-2xl w-full max-w-7xl h-full md:h-[95vh] overflow-hidden flex flex-col"
        >
          {/* Header Controls */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-neutral-800">
            <div className="flex items-center gap-4">
              {isMobile && step > 1 && (
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full">
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <div className="md:hidden flex items-center gap-1.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-brand-orange' : 'w-2 bg-gray-200 dark:bg-neutral-800'}`} />
                ))}
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
            {isMobile ? (
              /* Mobile Content Area (Steps) */
              <div className="flex-grow p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                  >
                    {step === 1 && renderPlanSelection()}
                    {step === 2 && renderConfigSelection()}
                    {step === 3 && renderRotationSelection()}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              /* Desktop Layout (Static Multi-Column) */
              <>
                <div className="w-[40%] bg-brand-cream/50 dark:bg-neutral-900/50 p-8 overflow-y-auto border-r border-gray-100 dark:border-neutral-800">
                   {renderPlanSelection()}
                   <div className="mt-8">
                     {renderConfigSelection()}
                   </div>
                </div>
                <div className="flex-grow p-10 flex flex-col bg-white dark:bg-neutral-950 overflow-hidden">
                   {renderRotationSelection()}
                </div>
              </>
            )}
          </div>

          {/* Persistent Action Footer */}
          <div className="p-6 md:p-8 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
               <div className="text-center sm:text-left">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Membership Total</p>
                 <div className="flex items-baseline gap-2">
                   <span className="text-4xl md:text-5xl font-serif font-bold text-brand-dark dark:text-brand-cream">₹{currentPrice}</span>
                   <span className="text-sm text-gray-500">/{duration}</span>
                 </div>
               </div>
               
               {!isMobile && (
                 <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 bg-brand-orange/10 px-4 py-2 rounded-2xl border border-brand-orange/20">
                      <Star size={16} className="text-brand-orange fill-current" />
                      <span className="font-black text-brand-orange uppercase text-[10px]">{planType} - {size}</span>
                    </div>
                 </div>
               )}
            </div>
            
            <div className="flex gap-3">
               {isMobile && step < 3 ? (
                 <Button onClick={handleNext} className="w-full gap-2 py-4">
                   Next Step <ChevronRight size={18} />
                 </Button>
               ) : (
                 <Button onClick={handleSubscribe} className="w-full gap-3 py-4 md:py-5 text-lg shadow-2xl">
                   <Send className="w-5 h-5" /> Confirm Subscription
                 </Button>
               )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;