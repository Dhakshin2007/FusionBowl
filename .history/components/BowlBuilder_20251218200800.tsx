import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Send, ShoppingBag, GlassWater, Trash2, X, ChevronRight, ChevronLeft, Sparkles, Wand2, RefreshCw, Check, Utensils, Info, AlertCircle } from 'lucide-react';
import { INGREDIENTS, PACKS, PLATTER_CATEGORIES, JuiceIngredient } from '../constants';
import { Ingredient, SectionId } from '../types';
import Button from './Button';
import { analyzeBowlNutrition } from '../services/geminiService';

const BowlBuilder: React.FC = () => {
  const [selectedPack, setSelectedPack] = useState<'classic' | 'prime' | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [selectedJuices, setSelectedJuices] = useState<Record<string, number>>({});
  const [activeJuiceSize, setActiveJuiceSize] = useState<'Shot' | 'Standard'>('Standard');
  const [isJuiceModalOpen, setIsJuiceModalOpen] = useState(false);
  const [showJuiceUpsell, setShowJuiceUpsell] = useState(false);
  const [address, setAddress] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activePackData = selectedPack ? PACKS[selectedPack] : null;
  const currentCategory = activePackData ? PLATTER_CATEGORIES[activePackData.categories[currentCategoryIndex]] : null;
  const currentCategoryWeight = activePackData && currentCategory ? (activePackData.weights as any)[currentCategory.id] : '';
  
  const isPlatterComplete = useMemo(() => {
    if (!activePackData) return false;
    return activePackData.categories.every(catId => selections[catId]);
  }, [activePackData, selections]);

  const handleSelectPack = (packId: 'classic' | 'prime') => {
    setSelectedPack(packId);
    setSelections({});
    setCurrentCategoryIndex(0);
    setAiAnalysis('');
    setShowJuiceUpsell(false);
    setErrorMsg(null);
  };

  const handleSelectItem = (category: string, item: string) => {
    setSelections(prev => ({ ...prev, [category]: item }));
    setErrorMsg(null);
    if (activePackData && currentCategoryIndex < activePackData.categories.length - 1) {
      setTimeout(() => setCurrentCategoryIndex(prev => prev + 1), 350);
    } else if (activePackData && currentCategoryIndex === activePackData.categories.length - 1) {
      setTimeout(() => {
        if (Object.keys(selectedJuices).length === 0) {
          setShowJuiceUpsell(true);
        }
      }, 500);
    }
    setAiAnalysis('');
  };

  const handleToggleJuice = (juiceId: string, size: 'Shot' | 'Standard', delta: number) => {
    const key = `${juiceId}:${size}`;
    setSelectedJuices(prev => {
      const current = prev[key] || 0;
      const next = Math.max(0, current + delta);
      const newState = { ...prev };
      if (next === 0) delete newState[key];
      else newState[key] = next;
      return newState;
    });
  };

  const juicePriceMap = (juice: JuiceIngredient | undefined, size: string) => {
    if (!juice) return 0;
    return size === 'Shot' ? juice.shotPrice : juice.regularPrice;
  };

  const totalPrice = useMemo(() => {
    let bowlPrice = activePackData ? activePackData.price : 0;
    let juicePriceTotal = Object.entries(selectedJuices).reduce((acc, [key, qty]) => {
      const [id, size] = key.split(':');
      const juice = INGREDIENTS.find(i => i.id === id) as JuiceIngredient;
      const price = juicePriceMap(juice, size);
      return acc + (price * (qty as number));
    }, 0);
    return bowlPrice + juicePriceTotal;
  }, [activePackData, selectedJuices]);

  const handleWhatsAppOrder = () => {
    if (!address.trim()) {
      setErrorMsg('Delivery address is required to proceed.');
      document.getElementById('address-input')?.focus();
      return;
    }

    let message = `Hi Fusion Bowl! I'd like to place an order:\n`;
    if (selectedPack) {
      message += `\n*A) Fruit Platter (${activePackData?.name})* (₹${activePackData?.price}):\n`;
      activePackData?.categories.forEach(catId => {
        const cat = PLATTER_CATEGORIES[catId];
        const weight = (activePackData.weights as any)[catId];
        message += `- ${cat.name} (${weight}): ${selections[catId]}\n`;
      });
    }

    if (Object.keys(selectedJuices).length > 0) {
      message += `\n*B) Cold Pressed Juices*:\n`;
      Object.entries(selectedJuices).forEach(([key, qty]) => {
        const [id, size] = key.split(':');
        const juice = INGREDIENTS.find(i => i.id === id) as JuiceIngredient;
        const price = juicePriceMap(juice, size);
        message += `- ${juice?.name} (${size}) x${qty} (₹${price * (qty as number)})\n`;
      });
    }

    message += `\n*Total Amount:* ₹${totalPrice}`;
    message += `\n\n*Address:* ${address.trim()}`;

    window.open(`https://wa.me/917207003062?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAIAnalysis = async () => {
    if (!selectedPack) return;
    setIsAnalyzing(true);
    const mockIngredients: Ingredient[] = Object.values(selections).map(name => ({
      id: name, name, category: 'fruit' as any, price: 0, calories: 50, color: 'bg-white', emoji: ''
    }));
    const result = await analyzeBowlNutrition(mockIngredients);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const renderPlatterSlots = () => {
    if (!activePackData) return null;
    const slots = activePackData.sections;
    const angle = 360 / slots;

    return (
      <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-10">
        <div className="absolute inset-0 rounded-full border-4 border-brand-orange/10 dark:border-white/5" />
        {activePackData.categories.map((catId, i) => {
          const isSelected = selections[catId];
          const isCurrent = currentCategoryIndex === i;
          return (
            <motion.div
              key={catId}
              onClick={() => setCurrentCategoryIndex(i)}
              className="absolute top-0 left-1/2 -ml-0.5 h-1/2 w-1 origin-bottom transition-all cursor-pointer z-10"
              style={{ rotate: `${i * angle}deg` }}
            >
              <div
                className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 md:w-14 md:h-14
                  rounded-full flex items-center justify-center border-2 shadow-sm transition-all
                  ${isSelected ? 'bg-brand-orange border-brand-orange text-white' : isCurrent ? 'bg-white dark:bg-neutral-800 border-brand-orange scale-110 shadow-lg' : 'bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-white/10 text-gray-400'}`}
                style={{ transform: `translateX(-50%) rotate(-${i * angle}deg)` }}
              >
                {isSelected ? <Check size={18} /> : <span className="text-xs font-black">{i + 1}</span>}
              </div>
            </motion.div>
          );
        })}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-4 rounded-full w-40 h-40 flex flex-col items-center justify-center border border-gray-100 dark:border-white/5">
            <h4 className="font-serif font-bold text-sm dark:text-white mb-1">{activePackData.name}</h4>
            <p className="text-brand-orange font-black text-lg">₹{activePackData.price}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id={SectionId.BUILDER} className="py-24 bg-brand-cream dark:bg-brand-dark min-h-screen">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <motion.h2 className="text-4xl md:text-5xl font-serif font-bold dark:text-brand-cream mb-4">
            Design Your <span className="text-brand-orange">Fruit Platter</span>
          </motion.h2>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-5xl mx-auto">
            {(['classic', 'prime'] as const).map((pack) => (
              <button
                key={pack}
                onClick={() => handleSelectPack(pack)}
                className={`flex-1 p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-2 ${
                  selectedPack === pack ? 'bg-brand-orange border-brand-orange text-white shadow-2xl scale-105' : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-white/5'
                }`}
              >
                {pack === 'classic' ? <Utensils size={32} /> : <Sparkles size={32} />}
                <h3 className="font-bold text-xl">{pack === 'classic' ? 'Classic' : 'Prime'} Platter</h3>
                <span className="text-2xl font-serif font-bold">₹{PACKS[pack].price}</span>
              </button>
            ))}
            <button
              onClick={() => { setSelectedPack(null); setIsJuiceModalOpen(true); }}
              className="flex-1 p-8 rounded-[2.5rem] border-2 bg-white dark:bg-neutral-900 border-gray-100 dark:border-white/5 transition-all flex flex-col items-center gap-2"
            >
              <GlassWater size={32} className="text-blue-500" />
              <h3 className="font-bold text-xl">Fresh Juices</h3>
              <span className="text-sm font-bold mt-2">Add Directly</span>
            </button>
          </div>
        </div>

        {(selectedPack || Object.keys(selectedJuices).length > 0) && (
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            
            {/* LEFT PANEL: Conditional for Mobile */}
            {(!isMobile || isPlatterComplete) && (
              <div className="bg-white dark:bg-neutral-900 rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-white/5">
                <div className="flex justify-between items-center mb-12">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Summary</span>
                   <button onClick={() => setIsJuiceModalOpen(true)} className="text-blue-500 font-black text-[10px] uppercase">
                     {Object.keys(selectedJuices).length > 0 ? 'Manage Juices' : 'Add Juices'}
                   </button>
                </div>

                {activePackData ? renderPlatterSlots() : <div className="py-20 text-center"><GlassWater className="mx-auto mb-4 text-blue-500" size={40}/></div>}

                <div className="space-y-6 pt-8 border-t border-gray-100 dark:border-white/5">
                  {selectedPack && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activePackData?.categories.map(catId => (
                        <div key={catId} className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-800/30 border border-transparent flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black text-brand-orange/60">{PLATTER_CATEGORIES[catId].name}</span>
                            <span className={`text-xs font-bold ${selections[catId] ? 'text-brand-orange' : 'text-gray-400 italic'}`}>
                              {selections[catId] || 'Pending...'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RIGHT PANEL: Selector logic */}
            <div className="space-y-8 flex flex-col h-full">
              {selectedPack && !isPlatterComplete ? (
                <motion.div key={currentCategory?.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-neutral-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-white/5 flex-grow">
                  <div className="mb-8">
                    <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Section {currentCategoryIndex + 1}: {currentCategory?.name}</span>
                    <h3 className="text-3xl font-serif font-bold dark:text-white mt-2">{currentCategory?.teluguName}</h3>
                    <p className="text-brand-orange text-xs font-bold mt-1">Approx: {currentCategoryWeight}</p>
                  </div>
                  <div className="grid gap-3">
                    {currentCategory?.items.map(item => (
                      <button key={item} onClick={() => handleSelectItem(currentCategory.id, item)} className="p-5 rounded-2xl text-left border-2 font-bold bg-gray-50 dark:bg-neutral-800/50 border-gray-100 dark:border-white/5 flex justify-between items-center">
                        {item} <ChevronRight size={18} />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="bg-brand-dark rounded-[3.5rem] p-10 text-white shadow-2xl space-y-8">
                  {errorMsg && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2 text-red-400 text-xs font-bold uppercase"><AlertCircle size={16}/> {errorMsg}</div>}
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Amount</span>
                    <p className="text-5xl font-serif font-bold">₹{totalPrice}</p>
                  </div>
                  <input 
                    id="address-input"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Delivery Location / Landmark *"
                    className="w-full bg-white/10 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                  <div className="grid grid-cols-1 gap-4">
                    <Button onClick={handleWhatsAppOrder} disabled={!address.trim()} className="py-5 text-sm uppercase font-black tracking-widest disabled:opacity-50">
                      <Send size={18} className="mr-2" /> Confirm via WhatsApp
                    </Button>
                    <button onClick={() => {setSelectedPack(null); setSelections({}); setAddress('')}} className="text-[10px] uppercase font-black text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                      <Trash2 size={14} /> Reset Platter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODALS (Juice/Upsell) stay same as provided in previous logic but cleaned up */}
        <AnimatePresence>
          {isJuiceModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsJuiceModalOpen(false)} className="absolute inset-0 bg-black/85 backdrop-blur-xl" />
               <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="relative bg-white dark:bg-neutral-900 rounded-[3.5rem] w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/5">
                  <div className="p-10 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-black/20">
                    <h3 className="text-3xl font-serif font-bold dark:text-white">Cold Pressed Juices</h3>
                    <button onClick={() => setIsJuiceModalOpen(false)} className="p-3 bg-white dark:bg-neutral-800 rounded-full text-gray-400"><X size={20} /></button>
                  </div>
                  <div className="px-10 py-4">
                    <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-2xl p-1">
                      {(['Shot', 'Standard'] as const).map(size => (
                        <button key={size} onClick={() => setActiveJuiceSize(size)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest ${activeJuiceSize === size ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400'}`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-grow overflow-y-auto p-10 space-y-4">
                    {INGREDIENTS.filter(i => i.category === 'shake-item').map(juice => {
                      const qty = selectedJuices[`${juice.id}:${activeJuiceSize}`] || 0;
                      return (
                        <div key={juice.id} className="p-5 rounded-[2rem] border border-gray-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-neutral-800/40">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{juice.emoji}</span>
                            <div>
                              <h4 className="font-bold dark:text-white">{juice.name}</h4>
                              <p className="text-xs text-brand-orange font-black">₹{juicePriceMap(juice as JuiceIngredient, activeJuiceSize)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 bg-gray-100 dark:bg-neutral-900 p-2 rounded-xl">
                            <button onClick={() => handleToggleJuice(juice.id, activeJuiceSize, -1)}><Minus size={16}/></button>
                            <span className="font-black dark:text-white">{qty}</span>
                            <button onClick={() => handleToggleJuice(juice.id, activeJuiceSize, 1)}><Plus size={16}/></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-10 border-t border-gray-100 dark:border-white/5">
                    <Button onClick={() => setIsJuiceModalOpen(false)} className="w-full py-5">Confirm Selection</Button>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        {/* Upsell Modal */}
        <AnimatePresence>
          {showJuiceUpsell && (
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowJuiceUpsell(false)} className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl" />
              <motion.div className="relative bg-white dark:bg-neutral-900 rounded-[4rem] p-12 max-w-md w-full text-center">
                 <GlassWater size={48} className="mx-auto text-blue-500 mb-6" />
                 <h3 className="text-3xl font-serif font-bold dark:text-white mb-4">Add a Juice?</h3>
                 <div className="flex flex-col gap-4">
                    <Button onClick={() => { setShowJuiceUpsell(false); setIsJuiceModalOpen(true); }} className="bg-blue-500">View Juice Menu</Button>
                    <button onClick={() => setShowJuiceUpsell(false)} className="text-gray-400 font-bold uppercase text-xs">No, Thank You</button>
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BowlBuilder;