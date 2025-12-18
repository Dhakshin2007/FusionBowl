import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Info, Send, EyeOff, SlidersHorizontal, ListChecks, Star, ChevronRight, ChevronLeft, LayoutGrid, Sparkles, ArrowDown, Clock } from 'lucide-react';
import { PLAN_FEATURES, PLAN_CATEGORIES_MAP, SIZE_DETAILS, PRICING_MATRIX, SUB_MENU_ITEMS, PlanType, PlanDuration, PlanSize } from '../constants';
import Button from './Button';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimeSlot = string;

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState<PlanDuration>('15 Days');
  const [planType, setPlanType] = useState<PlanType>('Standard');
  const [size, setSize] = useState<PlanSize>('Compact');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('7:00 AM');
  const [showScrollHint, setShowScrollHint] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [exclusions, setExclusions] = useState<Record<string, string[]>>({});

  // Generate time slots (every 30 minutes)
  const generateTimeSlots = (startHour: number, endHour: number): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`);
      slots.push(`${hour}:30 ${hour >= 12 ? 'PM' : 'AM'}`);
    }
    return slots;
  };
  const morningSlots = generateTimeSlots(7, 12);
  const eveningSlots = generateTimeSlots(16, 19);

  const getServingDays = (): number => {
    if (duration === '15 Days') return 13;
    return 26;
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [step]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop > 50) {
      setShowScrollHint(false);
    } else {
      setShowScrollHint(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      setStep(1);
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  if (!isOpen) return null;

  const currentPrice = PRICING_MATRIX[duration][planType][size];
  const currentCategories = PLAN_CATEGORIES_MAP[planType];
  const currentWeight = SIZE_DETAILS[size];
  const servingDays = getServingDays();

  const handleSubscribe = () => {
    let message = `Hi Fusion Bowl! I would like to subscribe to the following plan:%0A%0A`;
    message += `*Plan Type:* ${planType}%0A`;
    message += `*Duration:* ${duration}%0A`;
    message += `*Size:* ${size} (${currentWeight})%0A`;
    message += `*Delivery Time Slot:* ${timeSlot}%0A`;
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

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0
    })
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative bg-white dark:bg-neutral-950 md:rounded-[3rem] shadow-2xl w-full max-w-4xl h-full md:h-auto md:max-h-[95vh] overflow-hidden flex flex-col"
        >
          {/* Top Progress Header */}
          <div className="flex flex-col border-b border-gray-100 dark:border-neutral-800 shrink-0">
            <div className="flex justify-between items-center p-6 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.postimg.cc/SxPbst4r/Fusion-Bowl-PNG-(Bg-removed).png"
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="font-serif font-bold text-xl dark:text-brand-cream">
                  Fusion<span className="text-brand-orange">Bowl</span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="px-6 pb-4 flex items-center justify-center gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-brand-orange' : 'w-4 bg-gray-100 dark:bg-neutral-800'}`} />
                  {i < 4 && <div className="w-2 h-0.5 bg-gray-200 dark:bg-neutral-800" />}
                </div>
              ))}
            </div>
          </div>

          {/* Stepper Content */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-10 relative"
          >
            <AnimatePresence mode="wait" custom={step}>
              <motion.div
                key={step}
                custom={step}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="max-w-2xl mx-auto h-full"
              >
                {step === 1 && (
                  <div className="space-y-8 pb-12">
                    <div className="text-center md:text-left">
                      <div className="inline-flex items-center gap-2 text-brand-orange mb-2">
                        <ListChecks className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Step 01</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark dark:text-brand-cream mb-4">Choose Your Plan</h3>
                      <p className="text-gray-500 dark:text-gray-400">Our plans are crafted to provide specific daily nutritional profiles.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {(Object.keys(PLAN_FEATURES) as PlanType[]).map((type) => {
                        const isActive = planType === type;
                        return (
                          <motion.div
                            key={type}
                            onClick={() => {
                              setPlanType(type);
                              setExclusions({});
                            }}
                            whileHover={{ scale: 1.01, borderColor: '#FF8C42' }}
                            whileTap={{ scale: 0.98 }}
                            className={`group relative p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 ${isActive
                              ? 'bg-white dark:bg-neutral-900 border-brand-orange shadow-2xl shadow-orange-500/10'
                              : 'bg-gray-50/50 dark:bg-neutral-900/30 border-transparent hover:bg-white dark:hover:bg-neutral-900'
                              }`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className={`text-xl font-bold ${isActive ? 'text-brand-orange' : 'text-gray-800 dark:text-gray-200'}`}>
                                  {type} Plan
                                </h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Weekly Rotation</p>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? 'border-brand-orange bg-brand-orange text-white scale-110 shadow-lg shadow-orange-500/20' : 'border-gray-200 dark:border-neutral-800'}`}>
                                {isActive && <Check className="w-3.5 h-3.5" />}
                              </div>
                            </div>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                              {PLAN_FEATURES[type].map((feat, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                                  {feat}
                                </li>
                              ))}
                            </ul>

                            {isActive && (
                              <motion.div layoutId="active-plan-pill" className="absolute -right-2 -top-2 bg-brand-orange text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                                SELECTED
                              </motion.div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>

                    <AnimatePresence>
                      {showScrollHint && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="flex flex-col items-center gap-2 pt-8 text-gray-400 dark:text-gray-600"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest">Scroll to see details</span>
                          <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <ArrowDown size={16} />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-10 pb-12">
                    <div className="text-center md:text-left">
                      <div className="inline-flex items-center gap-2 text-brand-orange mb-2">
                        <LayoutGrid className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Step 02</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark dark:text-brand-cream mb-4">Set Configuration</h3>
                      <p className="text-gray-500 dark:text-gray-400">Select your preferred duration and meal portion size.</p>
                    </div>

                    <div className="space-y-10">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-brand-orange mb-4 tracking-[0.2em] px-1">Subscription Period</label>
                        <div className="grid grid-cols-2 gap-4">
                          {(['15 Days', '1 Month'] as PlanDuration[]).map((d) => {
                            const days = d === '15 Days' ? 13 : 26;
                            return (
                              <button
                                key={d}
                                onClick={() => setDuration(d)}
                                className={`group p-6 rounded-3xl font-bold transition-all border-2 text-center relative overflow-hidden ${duration === d
                                  ? 'bg-brand-orange border-brand-orange text-white shadow-xl shadow-orange-500/20 scale-[1.02]'
                                  : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 text-gray-500 hover:border-brand-orange/30'
                                  }`}
                              >
                                <span className="relative z-10 block text-lg">{d}</span>
                                <span className={`text-[12px] font-medium mt-1 ${duration === d ? 'text-black/90' : 'text-gray-600'}`}>
                                  {days} serving days
                                </span>
                                {duration === d && <Sparkles size={16} className="absolute top-2 right-2 opacity-50" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-brand-orange mb-4 tracking-[0.2em] px-1">Meal Portion Size</label>
                        <div className="grid grid-cols-1 gap-4">
                          {(['Mini', 'Compact', 'Grand'] as PlanSize[]).map((s) => (
                            <button
                              key={s}
                              onClick={() => setSize(s)}
                              className={`p-6 rounded-[2rem] font-bold transition-all border-2 text-left flex justify-between items-center group ${size === s
                                ? 'bg-brand-green border-brand-green text-white shadow-xl shadow-green-500/10'
                                : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 text-gray-500 hover:border-brand-green/30'
                                }`}
                            >
                              <div className="flex flex-col">
                                <span className="text-xl">{s}</span>
                                <span className={`text-[11px] font-medium opacity-100 ${size === s ? 'text-black' : 'text-gray-400'}`}>
                                  {SIZE_DETAILS[s]}
                                </span>
                              </div>
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${size === s ? 'bg-white text-brand-green border-white scale-110 shadow-lg' : 'border-gray-100 dark:border-neutral-800'}`}>
                                {size === s && <Check className="w-5 h-5" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-brand-cream dark:bg-neutral-900 rounded-[2rem] border border-gray-100 dark:border-neutral-800 flex gap-4">
                      <div className="p-2 bg-brand-orange/10 rounded-xl h-fit">
                        <Info className="w-5 h-5 text-brand-orange" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        <span className="font-bold text-brand-dark dark:text-brand-cream block mb-1">About Your Plan</span>
                        Sundays are non-delivery days. Your {duration === '15 Days' ? '15-day' : '30-day'} plan includes <strong>{servingDays} serving days</strong>, ensuring you receive every meal you pay for.
                      </p>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-10 pb-12">
                    <div className="text-center md:text-left">
                      <div className="inline-flex items-center gap-2 text-brand-orange mb-2">
                        <Clock className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Step 03</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark dark:text-brand-cream mb-4">Choose Delivery Time</h3>
                      <p className="text-gray-500 dark:text-gray-400">Select your preferred delivery time slot.</p>
                    </div>

                    <div className="space-y-8">
                      {/* Morning Slots */}
                      <div>
                        <label className="block text-[10px] font-black uppercase text-brand-orange mb-4 tracking-[0.2em] px-1">Morning Delivery</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {morningSlots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setTimeSlot(slot)}
                              className={`p-3 rounded-2xl font-bold text-sm transition-all border-2 ${timeSlot === slot
                                ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-orange-500/20'
                                : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 text-gray-600 dark:text-gray-300 hover:border-brand-orange/30'
                                }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Evening Slots */}
                      <div>
                        <label className="block text-[10px] font-black uppercase text-brand-orange mb-4 tracking-[0.2em] px-1">Evening Delivery</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {eveningSlots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setTimeSlot(slot)}
                              className={`p-3 rounded-2xl font-bold text-sm transition-all border-2 ${timeSlot === slot
                                ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-orange-500/20'
                                : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 text-gray-600 dark:text-gray-300 hover:border-brand-orange/30'
                                }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-8 flex flex-col h-full pb-12">
                    <div className="text-center md:text-left">
                      <div className="inline-flex items-center gap-2 text-brand-orange mb-2">
                        <SlidersHorizontal className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Step 04</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark dark:text-brand-cream mb-4">Rotation Preferences</h3>
                      <p className="text-gray-500 dark:text-gray-400">Items are allotted randomly. Tap any item to <strong>exclude</strong> it from your rotation.</p>
                    </div>

                    <div className="space-y-10 pb-4">
                      {currentCategories.map(catName => {
                        const items = SUB_MENU_ITEMS[catName] || [];
                        const catExclusions = exclusions[catName] || [];

                        return (
                          <div key={catName}>
                            <div className="flex items-center gap-3 mb-4">
                              <h4 className="text-[10px] font-black uppercase text-brand-orange tracking-[0.25em]">{catName}</h4>
                              <div className="h-[1px] flex-grow bg-gray-100 dark:border-neutral-800" />
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                              {items.map(item => {
                                const isExcluded = catExclusions.includes(item.name);
                                return (
                                  <motion.button
                                    key={item.name}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleExclusion(catName, item.name)}
                                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all duration-300 ${isExcluded
                                      ? 'bg-gray-50 dark:bg-neutral-900 text-gray-400 border-dashed border-gray-200 dark:border-neutral-800'
                                      : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-neutral-800 hover:border-brand-orange shadow-sm'
                                      }`}
                                  >
                                    <span className={`text-lg ${isExcluded ? 'grayscale opacity-30' : ''}`}>{item.emoji}</span>
                                    <span className={isExcluded ? 'line-through opacity-50' : ''}>{item.name}</span>
                                    {isExcluded && <EyeOff size={12} className="text-red-400 ml-1" />}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stepper Navigation Footer */}
          <div className="p-6 md:p-8 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] shrink-0">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-end mb-8">
                <div>
                  {step !== 1 && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Total Investment
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-serif font-bold text-brand-dark dark:text-brand-cream">
                          ₹{currentPrice}
                        </span>
                        <span className="text-sm text-gray-500">/{duration}</span>
                      </div>
                    </div>
                  )}

                </div>

                {step !== 1 && (
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-2 bg-brand-orange/10 px-4 py-1.5 rounded-full border border-brand-orange/20 mb-1">
                      <Star size={14} className="text-brand-orange fill-current" />
                      <span className="font-black text-brand-orange uppercase text-[10px]">
                        {planType} - {size}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {currentWeight}
                    </span>
                  </div>
                )}
                </div>


                <div className="flex gap-3">
                  {step > 1 && (
                    <button
                      onClick={handleBack}
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full border-2 border-gray-100 dark:border-neutral-800 font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-all"
                    >
                      <ChevronLeft size={18} /> Back
                    </button>
                  )}

                  {step < 4 ? (
                    <Button onClick={handleNext} className="flex-[2] gap-2 py-4 shadow-xl">
                      Continue <ChevronRight size={18} />
                    </Button>
                  ) : (
                    <Button onClick={handleSubscribe} className="flex-[2] gap-3 py-4 text-lg shadow-2xl">
                      <Send className="w-5 h-5" /> Confirm Membership
                    </Button>
                  )}
                </div>
              </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;