import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Plus, Minus, RefreshCw, Wand2, Send, Sparkles, MapPin, Trash2, ShoppingBag } from 'lucide-react';
import { INGREDIENTS } from '../constants';
import { Ingredient, SectionId } from '../types';
import Button from './Button';
import { analyzeBowlNutrition } from '../services/geminiService';

const BowlBuilder: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<{item: Ingredient, qty: number, id: string}[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [address, setAddress] = useState<string>('');
  const bowlRef = useRef<HTMLDivElement>(null);

  const categories = Array.from(new Set(INGREDIENTS.map(i => i.category)));

  // Derived state for summary
  const summary = useMemo(() => {
    // Group by ingredient ID
    const grouped: Record<string, {item: Ingredient, qty: number}> = {};
    selectedIngredients.forEach(entry => {
      if (grouped[entry.item.id]) {
        grouped[entry.item.id].qty += 1;
      } else {
        grouped[entry.item.id] = { item: entry.item, qty: 1 };
      }
    });
    return Object.values(grouped);
  }, [selectedIngredients]);

  const totalPrice = useMemo(() => {
    return summary.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);
  }, [summary]);

  const totalCalories = useMemo(() => {
    return summary.reduce((acc, curr) => acc + (curr.item.calories * curr.qty), 0);
  }, [summary]);

  const handleAdd = (ingredient: Ingredient) => {
    // Add a new distinct item instance for visual scattering
    const newItem = { item: ingredient, qty: 1, id: Math.random().toString(36).substr(2, 9) };
    setSelectedIngredients(prev => [...prev, newItem]);
    setAiAnalysis('');
  };

  const handleRemoveOne = (ingredientId: string) => {
    // Remove the last added instance of this ingredient
    setSelectedIngredients(prev => {
        const indices = prev.map((e, i) => e.item.id === ingredientId ? i : -1).filter(i => i !== -1);
        if (indices.length === 0) return prev;
        const lastIndex = indices[indices.length - 1];
        const newArr = [...prev];
        newArr.splice(lastIndex, 1);
        return newArr;
    });
    setAiAnalysis('');
  };

  const handleClearBowl = () => {
    setSelectedIngredients([]);
    setAiAnalysis('');
    setAddress('');
  };

  const handleAIAnalysis = async () => {
    if (summary.length === 0) return;
    setIsAnalyzing(true);
    const ingredients = summary.map(s => s.item);
    const result = await analyzeBowlNutrition(ingredients);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleWhatsAppOrder = () => {
    const itemsList = summary.map(s => `${s.item.name} x${s.qty}`).join('\n');
    let message = `Hi Fusion Bowl! I'd like to order a custom bowl:\n\n${itemsList}\n\n*Total:* ₹${totalPrice}`;
    
    if (address.trim()) {
      message += `\n\n*Delivery Address:*\n${address.trim()}`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/917207003062?text=${encodedMessage}`, '_blank');
  };

  // Drag Drop Logic for Desktop
  const handleDragEnd = (event: any, info: any, ingredient: Ingredient) => {
    if (!bowlRef.current) return;
    const bowlRect = bowlRef.current.getBoundingClientRect();
    const dropPoint = { x: info.point.x, y: info.point.y };

    // Simple collision check
    if (
        dropPoint.x >= bowlRect.left && 
        dropPoint.x <= bowlRect.right && 
        dropPoint.y >= bowlRect.top && 
        dropPoint.y <= bowlRect.bottom
    ) {
        handleAdd(ingredient);
    }
  };

  return (
    <section id={SectionId.BUILDER} className="py-12 md:py-24 relative bg-white dark:bg-brand-dark overflow-hidden transition-colors duration-300 min-h-screen">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50/50 dark:bg-orange-900/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-brand-orange font-semibold tracking-wider uppercase text-sm">Interactive Builder</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark dark:text-brand-cream mt-2 mb-4">
            Build Your <span className="text-brand-green">Masterpiece</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Drag fruits into the bowl or click to add. Customize portions and order instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Ingredient Palette */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-3xl p-6 border border-gray-100 dark:border-neutral-800">
                <h3 className="font-serif font-bold text-xl mb-4 dark:text-brand-cream">Ingredients</h3>
                <div className="space-y-6">
                    {categories.map((cat) => (
                    <div key={cat}>
                        <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">{cat}</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                        {INGREDIENTS.filter(i => i.category === cat).map((ingredient) => (
                            <motion.div
                                key={ingredient.id}
                                drag
                                dragSnapToOrigin
                                whileDrag={{ scale: 1.2, zIndex: 50, opacity: 0.8 }}
                                onDragEnd={(e, info) => handleDragEnd(e, info, ingredient)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAdd(ingredient)}
                                className="bg-white dark:bg-neutral-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-700 cursor-grab active:cursor-grabbing flex flex-col items-center gap-2 group hover:border-brand-orange/50 transition-colors"
                            >
                                <div className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">{ingredient.emoji}</div>
                                <div className="text-center">
                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight">{ingredient.name}</p>
                                    <p className="text-[10px] text-gray-400">₹{ingredient.price}</p>
                                </div>
                            </motion.div>
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
          </motion.div>

          {/* RIGHT: The Bowl Area (Sticky) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 order-1 lg:order-2 sticky top-20"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-gray-100 dark:border-neutral-800 p-6 md:p-10 relative overflow-hidden">
                
                {/* Visual Bowl Container */}
                <div className="flex justify-center mb-8 relative z-20">
                    <div 
                        ref={bowlRef}
                        className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-8 border-white dark:border-neutral-800 shadow-[inset_0_10px_40px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden transition-all bg-brand-cream dark:bg-neutral-800 ring-1 ring-gray-200 dark:ring-neutral-700"
                    >
                        {/* Bowl Inner Shadow/Texture */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-black/20 rounded-full pointer-events-none z-20" />
                        
                        {/* BRAND LOGO WATERMARK */}
                        <img 
                            src="https://i.postimg.cc/PfYmDp54/Fusion-Bowl-Logo.png" 
                            alt="Brand Watermark" 
                            className="absolute w-40 h-40 object-contain opacity-[0.08] dark:opacity-[0.1] pointer-events-none grayscale z-0 select-none"
                        />

                        {/* Empty State */}
                        {selectedIngredients.length === 0 && (
                            <div className="text-center opacity-40 pointer-events-none relative z-30">
                                <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm font-medium">Drag or Click ingredients<br/>to fill the bowl</p>
                            </div>
                        )}

                        {/* Visual Ingredients in Bowl */}
                        <AnimatePresence>
                            {selectedIngredients.map((item, index) => {
                                // Randomize position slightly for "pile" effect
                                const randomX = Math.random() * 60 - 30; // -30 to 30
                                const randomY = Math.random() * 60 - 30;
                                const randomRotate = Math.random() * 360;

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ scale: 0, y: -100, opacity: 0 }}
                                        animate={{ scale: 1, y: randomY, x: randomX, opacity: 1, rotate: randomRotate }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        drag
                                        dragConstraints={bowlRef}
                                        whileDrag={{ scale: 1.2, cursor: 'grabbing' }}
                                        className="absolute text-4xl md:text-5xl cursor-grab select-none drop-shadow-md hover:scale-110 transition-transform z-30"
                                    >
                                        {item.item.emoji}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Controls & Summary */}
                <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800">
                    {/* Header Summary */}
                    <div className="flex justify-between items-end mb-6 pb-4 border-b border-dashed border-gray-200 dark:border-neutral-700">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Price</p>
                            <p className="text-3xl font-serif font-bold text-brand-dark dark:text-brand-cream">₹{totalPrice}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-sm text-gray-500 dark:text-gray-400">Energy</p>
                             <p className="text-xl font-bold text-brand-green">{totalCalories} kcal</p>
                        </div>
                    </div>

                    {/* Quantity Sliders / Controls */}
                    {summary.length > 0 ? (
                        <div className="space-y-3 mb-6 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {summary.map((line) => (
                                <div key={line.item.id} className="flex items-center justify-between bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{line.item.emoji}</span>
                                        <div>
                                            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{line.item.name}</p>
                                            <p className="text-[10px] text-gray-400">₹{line.item.price} x {line.qty}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
                                        <button 
                                            onClick={() => handleRemoveOne(line.item.id)}
                                            className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-neutral-600 shadow-sm hover:text-red-500 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-bold w-4 text-center">{line.qty}</span>
                                        <button 
                                            onClick={() => handleAdd(line.item)}
                                            className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-neutral-600 shadow-sm hover:text-green-500 transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-400 text-sm italic">
                            No ingredients selected yet.
                        </div>
                    )}

                    {/* Address Input */}
                    {summary.length > 0 && (
                        <div className="mb-4">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                                <MapPin className="w-3 h-3" /> Delivery Location
                            </label>
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Street, Landmark, City..."
                                className="w-full p-3 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button 
                            variant="primary" 
                            onClick={handleWhatsAppOrder} 
                            disabled={summary.length === 0}
                            className="w-full gap-2 shadow-orange-200 dark:shadow-none"
                        >
                            <Send size={16} /> Order Bowl
                        </Button>
                        <button
                            onClick={handleClearBowl}
                            disabled={summary.length === 0}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-gray-200 dark:border-neutral-700 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                            <Trash2 size={16} /> Clear
                        </button>
                    </div>

                    {/* AI Analysis */}
                    <div className="mt-4">
                         {!aiAnalysis ? (
                            <button 
                            onClick={handleAIAnalysis}
                            disabled={summary.length === 0 || isAnalyzing}
                            className="w-full flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 py-2 rounded-xl transition-colors text-xs font-bold uppercase tracking-wide disabled:opacity-50"
                            >
                            {isAnalyzing ? <RefreshCw className="animate-spin w-3 h-3" /> : <Wand2 className="w-3 h-3" />}
                            {isAnalyzing ? "Analyzing..." : "Analyze Nutrition (AI)"}
                            </button>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30 mt-3"
                            >
                                <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h5 className="font-bold text-purple-900 dark:text-purple-100 text-sm mb-1">Chef's AI Note</h5>
                                    <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">{aiAnalysis}</p>
                                </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BowlBuilder;