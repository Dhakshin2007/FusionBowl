import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RefreshCw, Wand2, CheckCircle, Send, Sparkles, MapPin } from 'lucide-react';
import { INGREDIENTS } from '../constants';
import { Ingredient, SectionId } from '../types';
import Button from './Button';
import { analyzeBowlNutrition } from '../services/geminiService';

const BowlBuilder: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<{item: Ingredient, qty: number}[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [address, setAddress] = useState<string>('');

  const categories = Array.from(new Set(INGREDIENTS.map(i => i.category)));

  const totalPrice = useMemo(() => {
    return selectedIngredients.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);
  }, [selectedIngredients]);

  const totalCalories = useMemo(() => {
    return selectedIngredients.reduce((acc, curr) => acc + (curr.item.calories * curr.qty), 0);
  }, [selectedIngredients]);

  const handleAdd = (ingredient: Ingredient) => {
    setSelectedIngredients(prev => {
      const existing = prev.find(p => p.item.id === ingredient.id);
      if (existing) {
        return prev.map(p => p.item.id === ingredient.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { item: ingredient, qty: 1 }];
    });
    // Reset analysis when bowl changes
    setAiAnalysis('');
  };

  const handleRemove = (id: string) => {
    setSelectedIngredients(prev => {
      const existing = prev.find(p => p.item.id === id);
      if (existing && existing.qty > 1) {
        return prev.map(p => p.item.id === id ? { ...p, qty: p.qty - 1 } : p);
      }
      return prev.filter(p => p.item.id !== id);
    });
    setAiAnalysis('');
  };

  const handleAIAnalysis = async () => {
    if (selectedIngredients.length === 0) return;
    setIsAnalyzing(true);
    const ingredients = selectedIngredients.map(s => s.item);
    const result = await analyzeBowlNutrition(ingredients);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleWhatsAppOrder = () => {
    const itemsList = selectedIngredients.map(s => `${s.item.name} x${s.qty}`).join('\n');
    let message = `Hi Fusion Bowl! I'd like to order a custom bowl:\n\n${itemsList}\n\nTotal: ₹${totalPrice}`;
    
    if (address.trim()) {
      message += `\n\n*Delivery Address:*\n${address.trim()}`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/917207003062?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id={SectionId.BUILDER} className="py-20 relative bg-white dark:bg-brand-dark overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50/50 dark:bg-orange-900/10 -skew-x-12 translate-x-1/4" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="text-brand-orange font-semibold tracking-wider uppercase text-sm">Design Your Meal</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark dark:text-brand-cream mt-2 mb-4">
            Customise Your <span className="text-brand-green">Bowl</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select your base, mix in fresh fruits, sprinkle toppings, and drizzle your favorite dressing. Watch your bowl come to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Ingredient Selector */}
          <div className="lg:col-span-7 space-y-8">
            {categories.map((cat) => (
              <div key={cat} className="space-y-4">
                <h3 className="text-xl font-serif font-bold capitalize text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-100 dark:border-neutral-800 flex items-center gap-2">
                  {cat}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {INGREDIENTS.filter(i => i.category === cat).map((ingredient) => {
                     const selected = selectedIngredients.find(s => s.item.id === ingredient.id);
                     return (
                      <button
                        key={ingredient.id}
                        onClick={() => handleAdd(ingredient)}
                        className={`group p-4 rounded-xl text-left transition-all duration-200 border relative overflow-hidden ${
                          selected 
                            ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20 shadow-md ring-1 ring-brand-orange' 
                            : 'border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-brand-orange/50 dark:hover:border-brand-orange/50 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className={`w-8 h-8 rounded-full ${ingredient.color} opacity-80`} />
                          {selected && (
                            <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              x{selected.qty}
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 leading-tight">{ingredient.name}</h4>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            ₹{ingredient.price}<span className="text-brand-orange text-xs">/Kg</span>
                          </span>
                          <span className="text-gray-400 dark:text-gray-500 text-xs">{ingredient.calories} cal</span>
                        </div>
                      </button>
                     );
                  })}
                </div>
              </div>
            ))}

            {/* Coming Soon Static Card */}
            <div className="p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-neutral-700 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-neutral-800/50 mt-6">
              <Sparkles className="w-8 h-8 text-brand-orange mb-2 opacity-50" />
              <h4 className="font-serif font-bold text-gray-500 dark:text-gray-400">And More Coming Soon...</h4>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">We are constantly expanding our menu with fresh seasonal arrivals.</p>
            </div>
          </div>

          {/* Live Bowl Preview (Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-neutral-700 p-8 overflow-hidden transition-colors duration-300">
              
              {/* The Bowl Graphic */}
              <div className="relative w-64 h-64 mx-auto mb-8 bg-stone-100 dark:bg-neutral-900 rounded-full border-4 border-white dark:border-neutral-700 shadow-inner flex items-center justify-center overflow-hidden ring-1 ring-gray-200 dark:ring-neutral-700">
                {selectedIngredients.length === 0 ? (
                  <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Your bowl is empty</p>
                ) : (
                  <div className="absolute inset-0 flex flex-wrap content-center justify-center p-8 gap-2">
                    <AnimatePresence>
                      {selectedIngredients.map((s, idx) => (
                        <motion.div
                          key={`${s.item.id}-${idx}`}
                          initial={{ scale: 0, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`${s.item.color} w-8 h-8 rounded-full shadow-sm border border-white/20`}
                          style={{
                            width: `${Math.max(20, Math.min(50, 100 / Math.sqrt(selectedIngredients.length)))}%`,
                            height: `${Math.max(20, Math.min(50, 100 / Math.sqrt(selectedIngredients.length)))}%`,
                            borderRadius: '50%'
                          }}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-200 dark:border-neutral-700">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Total Calories</span>
                  <span className="text-gray-900 dark:text-white font-bold">{totalCalories} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white font-serif text-xl font-bold">Total Price</span>
                  <span className="text-brand-orange font-serif text-3xl font-bold">₹{totalPrice}</span>
                </div>
              </div>

              {/* Items List (Collapsible/Scrollable) */}
              {selectedIngredients.length > 0 && (
                <div className="max-h-32 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                  {selectedIngredients.map((s) => (
                    <div key={s.item.id} className="flex justify-between items-center py-2 text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{s.item.name}</span>
                      <div className="flex items-center gap-3">
                         <button onClick={() => handleRemove(s.item.id)} className="text-gray-400 hover:text-red-500 p-1"><Minus size={14} /></button>
                         <span className="font-semibold w-4 text-center dark:text-gray-200">{s.qty}</span>
                         <button onClick={() => handleAdd(s.item)} className="text-gray-400 hover:text-green-500 p-1"><Plus size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Address Input Section - Show only if ingredients are selected */}
              {selectedIngredients.length > 0 && (
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                     <MapPin className="w-4 h-4" /> Delivery Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, Landmark, City..."
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none resize-none h-24 placeholder:text-gray-400"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  onClick={handleWhatsAppOrder} 
                  className="w-full gap-2" 
                  disabled={selectedIngredients.length === 0}
                >
                  <Send className="w-4 h-4" /> Order via WhatsApp
                </Button>

                {/* AI Feature */}
                <div className="pt-4 border-t border-gray-100 dark:border-neutral-700">
                  {!aiAnalysis ? (
                    <button 
                      onClick={handleAIAnalysis}
                      disabled={selectedIngredients.length === 0 || isAnalyzing}
                      className="w-full flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 py-3 rounded-xl transition-colors font-medium text-sm disabled:opacity-50"
                    >
                      {isAnalyzing ? <RefreshCw className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                      {isAnalyzing ? "AI is Analyzing..." : "Analyze Nutrition with AI"}
                    </button>
                  ) : (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30"
                     >
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                          <div>
                            <h5 className="font-bold text-purple-900 dark:text-purple-100 text-sm mb-1">AI Nutrition Insight</h5>
                            <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">{aiAnalysis}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setAiAnalysis('')} 
                          className="text-xs text-purple-500 dark:text-purple-400 mt-2 underline"
                        >
                          Clear Analysis
                        </button>
                     </motion.div>
                  )}
                </div>

                <div className="text-center pt-2">
                   <button 
                    onClick={() => { setSelectedIngredients([]); setAiAnalysis(''); setAddress(''); }}
                    className="text-gray-400 dark:text-gray-500 text-xs hover:text-red-500 transition-colors"
                  >
                    Reset Bowl
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BowlBuilder;