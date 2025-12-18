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

  const activePackData = selectedPack ? PACKS[selectedPack] : null;
  const currentCategory = activePackData ? PLATTER_CATEGORIES[activePackData.categories[currentCategoryIndex]] : null;
  const currentCategoryWeight = activePackData && currentCategory ? (activePackData.weights as any)[currentCategory.id] : '';

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
    if (selectedPack) {
      const missingCategoryIndex = activePackData?.categories.findIndex(catId => !selections[catId]);
      if (missingCategoryIndex !== undefined && missingCategoryIndex !== -1) {
        setErrorMsg(`Please complete your platter by selecting items for all sections.`);
        setCurrentCategoryIndex(missingCategoryIndex);
        const el = document.getElementById('category-selector');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    if (!selectedPack && Object.keys(selectedJuices).length === 0) {
      setErrorMsg("Please select a platter or some fresh juices to proceed.");
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

    if (!address.trim()) {
  setErrorMsg('Please enter your delivery address to proceed.');
  const input = document.querySelector('input[placeholder="Delivery Location / Landmark..."]');
  input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  input?.focus();
  return;
}


    message += `\n*Total Amount:* ₹${totalPrice}`;
    if (address.trim()) message += `\n\n*Address:* ${address.trim()}`;

    window.open(`https://wa.me/917207003062?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAIAnalysis = async () => {
    if (!selectedPack) return;
    setIsAnalyzing(true);
    const mockIngredients: Ingredient[] = Object.values(selections).map(name => ({
      id: name as string, name: name as string, category: 'fruit', price: 0, calories: 50, color: 'bg-white', emoji: ''
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
        <div className="absolute inset-4 rounded-full border border-dashed border-brand-orange/10 pointer-events-none" />
        
        {activePackData.categories.map((catId, i) => {
          const cat = PLATTER_CATEGORIES[catId];
          const isSelected = selections[catId];
          const isCurrent = currentCategoryIndex === i;
          
          return (
            <motion.div
              key={catId}
              onClick={() => setCurrentCategoryIndex(i)}
              className={`absolute top-0 left-1/2 -ml-0.5 h-1/2 w-1 origin-bottom transition-all cursor-pointer z-10`}
              style={{ rotate: `${i * angle}deg` }}
            >
              <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 shadow-sm transition-all ${
                isSelected ? 'bg-brand-orange border-brand-orange text-white' : 
                isCurrent ? 'bg-white dark:bg-neutral-800 border-brand-orange scale-110 shadow-lg' : 'bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-white/10 text-gray-400'
              }`}>
                {isSelected ? <Check size={18} /> : <span className="text-xs font-black">{i + 1}</span>}
              </div>
              
              {isCurrent && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-14 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-[9px] font-black py-1 px-3 rounded-full whitespace-nowrap shadow-xl z-50 uppercase tracking-widest"
                  style={{ rotate: `-${i * angle}deg` }}
                >
                  {cat.name}
                </motion.div>
              )}
            </motion.div>
          );
        })}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-4 rounded-full w-40 h-40 flex flex-col items-center justify-center border border-gray-100 dark:border-white/5">
            <h4 className="font-serif font-bold text-sm dark:text-white leading-tight mb-1">{activePackData.name}</h4>
            <p className="text-brand-orange font-black text-lg">₹{activePackData.price}</p>
            <div className="flex gap-1 justify-center mt-2">
               {activePackData.categories.map((_, i) => (
                 <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentCategoryIndex ? 'bg-brand-orange w-4' : (selections[activePackData.categories[i]] ? 'bg-brand-green' : 'bg-gray-200 dark:bg-neutral-800')} transition-all`} />
               ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id={SectionId.BUILDER} className="py-24 bg-brand-cream dark:bg-brand-dark min-h-screen">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold dark:text-brand-cream mb-4"
          >
            Design Your <span className="text-brand-orange">Fruit Platter</span>
          </motion.h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-12 text-sm md:text-base">Experience nature's platter. Select your pack and curate each compartment with handpicked fruits.</p>
          
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-5xl mx-auto">
            <button
              onClick={() => handleSelectPack('classic')}
              className={`flex-1 p-8 md:p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-2 group ${
                selectedPack === 'classic' ? 'bg-brand-orange border-brand-orange text-white shadow-2xl scale-105' : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-white/5 hover:border-brand-orange/30'
              }`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-2 ${selectedPack === 'classic' ? 'bg-white text-brand-orange' : 'bg-brand-orange/10 text-brand-orange group-hover:scale-110 transition-transform'}`}>
                 <Utensils size={32} />
              </div>
              <h3 className="font-bold text-xl md:text-2xl">Classic Platter</h3>
              <span className="text-[10px] md:text-[11px] opacity-70 uppercase font-black tracking-widest">5 COMPARTMENTS</span>
              <span className="text-2xl md:text-3xl font-serif font-bold mt-2">₹135</span>
            </button>

            <button
              onClick={() => handleSelectPack('prime')}
              className={`flex-1 p-8 md:p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-2 group ${
                selectedPack === 'prime' ? 'bg-brand-orange border-brand-orange text-white shadow-2xl scale-105' : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-white/5 hover:border-brand-orange/30'
              }`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-2 ${selectedPack === 'prime' ? 'bg-white text-brand-orange' : 'bg-brand-orange/10 text-brand-orange group-hover:scale-110 transition-transform'}`}>
                 <Sparkles size={32} />
              </div>
              <h3 className="font-bold text-xl md:text-2xl">Prime Platter</h3>
              <span className="text-[10px] md:text-[11px] opacity-70 uppercase font-black tracking-widest">8 COMPARTMENTS</span>
              <span className="text-2xl md:text-3xl font-serif font-bold mt-2">₹249</span>
            </button>

            <button
              onClick={() => { setSelectedPack(null); setIsJuiceModalOpen(true); }}
              className={`flex-1 p-8 md:p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-2 group ${
                !selectedPack && Object.keys(selectedJuices).length > 0 ? 'bg-blue-500 border-blue-500 text-white shadow-2xl scale-105' : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-white/5 hover:border-blue-400/30'
              }`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-2 ${!selectedPack && Object.keys(selectedJuices).length > 0 ? 'bg-white text-blue-500' : 'bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform'}`}>
                 <GlassWater size={32} />
              </div>
              <h3 className="font-bold text-xl md:text-2xl">Fresh Juices</h3>
              <span className="text-[10px] md:text-[11px] opacity-70 uppercase font-black tracking-widest">COLD PRESSED</span>
              <span className="text-xs md:text-sm font-bold mt-2 text-center">Order Directly</span>
            </button>
          </div>
        </div>

        {(selectedPack || Object.keys(selectedJuices).length > 0) && (
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            
            <div className="bg-white dark:bg-neutral-900 rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
               <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-brand-orange/10 rounded-xl text-brand-orange"><ShoppingBag size={20} /></div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Visualizer</span>
                  </div>
                  <button onClick={() => setIsJuiceModalOpen(true)} className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-wider group">
                     {Object.keys(selectedJuices).length > 0 ? 'Manage Juices' : 'Add Juices'} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>

               {activePackData ? renderPlatterSlots() : (
                 <div className="py-20 text-center">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500 mb-6 animate-pulse"><GlassWater size={40}/></div>
                    <h3 className="text-2xl font-serif font-bold dark:text-white">Fresh Juice Selection</h3>
                    <p className="text-gray-500 text-sm italic">Pure, raw, and cold-pressed for maximum health.</p>
                 </div>
               )}

               <div className="space-y-6 pt-8 border-t border-gray-100 dark:border-white/5">
                  {selectedPack && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">A) Fruit Platter Components</span>
                        <span className="text-brand-orange font-black text-xs">{Object.keys(selections).length} / {activePackData?.sections}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activePackData?.categories.map(catId => {
                          const sel = selections[catId];
                          const weight = (activePackData.weights as any)[catId];
                          return (
                            <div key={catId} className={`p-4 rounded-2xl flex justify-between items-center border transition-all ${sel ? 'bg-brand-orange/5 border-brand-orange/20 shadow-sm' : 'bg-gray-50 dark:bg-neutral-800/30 border-transparent'}`}>
                              <div className="flex flex-col">
                                 <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-0.5">{PLATTER_CATEGORIES[catId].name}</span>
                                    <span className="text-[8px] font-black text-brand-orange/60">{weight}</span>
                                 </div>
                                 <span className={`text-xs font-bold truncate max-w-[120px] ${sel ? 'text-brand-orange' : 'text-gray-400 italic'}`}>{sel || 'Pending...'}</span>
                              </div>
                              {sel && (
                                <button onClick={() => setSelections(prev => {
                                  const n = { ...prev };
                                  delete n[catId];
                                  return n;
                                })} className="text-red-400 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {Object.keys(selectedJuices).length > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">B) Cold Pressed Juices</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(selectedJuices).map(([key, qty]) => {
                          const [id, size] = key.split(':');
                          const juice = INGREDIENTS.find(j => j.id === id) as JuiceIngredient;
                          return (
                            <div key={key} className="flex justify-between items-center p-3.5 bg-blue-50/50 dark:bg-blue-900/5 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
                               <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg ${juice?.color} flex items-center justify-center text-white text-xs`}>{juice?.emoji}</div>
                                  <div className="flex flex-col">
                                     <span className="text-xs font-bold dark:text-gray-300">{juice?.name}</span>
                                     <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{size}</span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-2">
                                  <button onClick={() => handleToggleJuice(id, size as 'Shot' | 'Standard', -1)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Minus size={14} /></button>
                                  <span className="text-[10px] font-black text-blue-500 px-3 py-1 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">x {qty}</span>
                                  <button onClick={() => handleToggleJuice(id, size as 'Shot' | 'Standard', 1)} className="text-gray-400 hover:text-blue-500 transition-colors p-1"><Plus size={14} /></button>
                               </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
               </div>
            </div>

            <div id="category-selector" className="space-y-8 h-full flex flex-col">
               {selectedPack && currentCategory ? (
                 <motion.div 
                   key={currentCategory.id}
                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                   className="bg-white dark:bg-neutral-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-white/5 flex-grow"
                 >
                    <div className="flex justify-between items-end mb-10">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                           <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] block">Section {currentCategoryIndex + 1}: {currentCategory.name}</span>
                           <span className="px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-[9px] font-black tracking-widest">{currentCategoryWeight}</span>
                        </div>
                        <h3 className="text-3xl font-serif font-bold dark:text-white leading-tight">{currentCategory.teluguName}</h3>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => setCurrentCategoryIndex(i => Math.max(0, i - 1))} className="p-3 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full text-gray-400 transition-colors">
                           <ChevronLeft size={20} />
                         </button>
                         <button onClick={() => setCurrentCategoryIndex(i => Math.min((activePackData?.categories.length || 1) - 1, i + 1))} className="p-3 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full text-gray-400 transition-colors">
                           <ChevronRight size={20} />
                         </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-10">
                       {currentCategory.items.map(itemName => {
                         const isSelected = selections[currentCategory.id] === itemName;
                         return (
                           <button 
                             key={itemName} 
                             onClick={() => handleSelectItem(currentCategory.id, itemName)}
                             className={`p-5 rounded-2xl text-left border-2 font-bold text-base transition-all flex justify-between items-center group ${
                               isSelected ? 'bg-brand-orange border-brand-orange text-white shadow-xl shadow-orange-500/20' : 'bg-gray-50 dark:bg-neutral-800/50 border-gray-100 dark:border-white/5 dark:text-gray-300 hover:border-brand-orange/30'
                             }`}
                           >
                             {itemName}
                             {isSelected ? <div className="bg-white text-brand-orange rounded-full p-1"><Check size={16} /></div> : <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-orange transition-colors" />}
                           </button>
                         );
                       })}
                    </div>

                    <div className="p-5 bg-brand-orange/5 rounded-2xl border border-brand-orange/10 flex gap-4 items-center">
                       <div className="p-2 bg-brand-orange/10 rounded-lg"><Info size={16} className="text-brand-orange" /></div>
                       <p className="text-xs text-brand-orange font-bold uppercase tracking-wider">Please select exactly 1 item for this compartment</p>
                    </div>
                 </motion.div>
               ) : (
                 <div className="bg-white dark:bg-neutral-900 rounded-[3rem] p-12 text-center shadow-xl border border-gray-100 dark:border-white/5 flex-grow flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mb-6"><Sparkles size={40} /></div>
                    <h3 className="text-3xl font-serif font-bold dark:text-white mb-3">{selectedPack ? 'Your Platter is Ready' : 'Juice Selection Saved'}</h3>
                    <p className="text-gray-500 text-sm max-w-xs mb-8">Review your A & B menu sections below and confirm your order via WhatsApp.</p>
                    {selectedPack && (
                      <button onClick={() => setCurrentCategoryIndex(0)} className="text-brand-orange font-black text-xs uppercase tracking-[0.25em] underline underline-offset-4 decoration-2">Review Compartments</button>
                    )}
                 </div>
               )}

               <div className="bg-brand-dark rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-2xl mb-6 border border-red-500/20">
                        <AlertCircle size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">{errorMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.25em] block mb-2">Total Bill Amount</span>
                      <p className="text-5xl font-serif font-bold">₹{totalPrice}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="relative group">
                       <input 
                        value={address} onChange={e => setAddress(e.target.value)}
                        placeholder="Delivery Location / Landmark..." 
                        className="w-full bg-white/10 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-orange transition-all placeholder:text-gray-500 group-hover:bg-white/15"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button onClick={handleWhatsAppOrder} className="gap-2 py-5 text-sm font-black uppercase tracking-widest shadow-brand-orange/20">
                        <Send size={18} /> Confirm Order
                      </Button>
                      <button 
                        onClick={() => { setSelectedPack(null); setSelections({}); setSelectedJuices({}); setAiAnalysis(''); setErrorMsg(null); }}
                        className="p-5 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} /> Clear Selection
                      </button>
                    </div>
                  </div>

                  {selectedPack && (aiAnalysis ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 p-6 rounded-3xl border border-white/10">
                      <div className="flex gap-4">
                         <Sparkles className="text-brand-orange shrink-0" size={24} />
                         <div>
                           <p className="text-[9px] font-black uppercase text-brand-orange mb-2 tracking-widest">AI Nutritional Snapshot</p>
                           <p className="text-xs leading-relaxed text-gray-300 font-medium">{aiAnalysis}</p>
                         </div>
                      </div>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={handleAIAnalysis}
                      disabled={isAnalyzing || Object.keys(selections).length === 0}
                      className="w-full py-4 rounded-2xl border border-dashed border-white/20 text-[9px] font-black uppercase tracking-[0.3em] hover:border-brand-orange hover:text-brand-orange transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                    >
                      {isAnalyzing ? <RefreshCw className="animate-spin" size={12} /> : <Wand2 size={12} />}
                      Analyze Selection (AI)
                    </button>
                  ))}
               </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {isJuiceModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsJuiceModalOpen(false)} className="absolute inset-0 bg-black/85 backdrop-blur-xl" />
               <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="relative bg-white dark:bg-neutral-900 rounded-[3.5rem] w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/5">
                  <div className="p-10 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-black/20">
                    <div>
                      <h3 className="text-3xl font-serif font-bold dark:text-white">Cold Pressed Juices</h3>
                      <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest mt-2">100% Raw • No Added Water • No Sugar</p>
                    </div>
                    <button onClick={() => setIsJuiceModalOpen(false)} className="p-3 bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full transition-colors text-gray-400 shadow-sm"><X size={20} /></button>
                  </div>

                  <div className="px-10 py-4 bg-gray-50/50 dark:bg-neutral-800/20 border-b border-gray-100 dark:border-white/5">
                    <div className="flex bg-white dark:bg-neutral-900 rounded-2xl p-1 shadow-sm border border-gray-100 dark:border-white/5">
                      {(['Shot', 'Standard'] as const).map(size => (
                        <button
                          key={size}
                          onClick={() => setActiveJuiceSize(size)}
                          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeJuiceSize === size ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          {size} {size === 'Shot' ? '(60ml)' : '(360ml)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-grow overflow-y-auto p-8 md:p-10 custom-scrollbar space-y-4">
                    {INGREDIENTS.filter(i => i.category === 'shake-item').map(juice => {
                      const qty = selectedJuices[`${juice.id}:${activeJuiceSize}`] || 0;
                      const currentPrice = juicePriceMap(juice as JuiceIngredient, activeJuiceSize);
                      return (
                        <motion.div 
                          key={juice.id} layout
                          className="bg-white dark:bg-neutral-800/40 p-5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 flex justify-between items-center group hover:border-blue-500/30 transition-all shadow-sm"
                        >
                          <div className="flex items-center gap-5">
                             <div className={`w-14 h-14 rounded-3xl ${juice.color} flex items-center justify-center text-white text-2xl shadow-xl transition-transform`}>
                                {juice.emoji}
                             </div>
                             <div>
                               <h4 className="font-bold text-lg dark:text-white leading-tight">{juice.name}</h4>
                               <p className="text-xs text-brand-orange font-black mt-1">₹{currentPrice} <span className="text-gray-400 text-[9px] uppercase tracking-widest ml-1">({activeJuiceSize})</span></p>
                             </div>
                          </div>
                          <div className="flex items-center gap-5 bg-gray-50 dark:bg-neutral-900 p-2.5 rounded-2xl border border-gray-100 dark:border-white/5">
                             <button onClick={() => handleToggleJuice(juice.id, activeJuiceSize, -1)} className="p-2 hover:text-red-500 transition-colors"><Minus size={18} /></button>
                             <span className="font-black text-xl w-6 text-center dark:text-white">{qty}</span>
                             <button onClick={() => handleToggleJuice(juice.id, activeJuiceSize, 1)} className="p-2 hover:text-blue-500 transition-colors"><Plus size={18} /></button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="p-10 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-neutral-950/50 backdrop-blur-md">
                    <Button onClick={() => setIsJuiceModalOpen(false)} className="w-full py-5 text-lg font-black uppercase tracking-widest gap-3 shadow-blue-500/10">
                       Confirm Selection <Check size={24} />
                    </Button>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showJuiceUpsell && (
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowJuiceUpsell(false)} className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-neutral-900 rounded-[4rem] p-12 max-w-md w-full text-center shadow-3xl border border-white/5">
                 <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-500 animate-pulse">
                    <GlassWater size={48} />
                 </div>
                 <h3 className="text-3xl font-serif font-bold dark:text-white mb-4">Complete your meal?</h3>
                 <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium italic">Would You like to avail some Cold Pressed Juices as a refreshing companion to your platter?</p>
                 <div className="flex flex-col gap-4">
                    <Button onClick={() => { setShowJuiceUpsell(false); setIsJuiceModalOpen(true); }} className="w-full py-5 bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 text-sm uppercase tracking-widest font-black">
                      Yes, Show Juice Menu
                    </Button>
                    <button onClick={() => setShowJuiceUpsell(false)} className="py-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold text-xs uppercase tracking-widest transition-colors">
                      No, Just the Platter
                    </button>
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
