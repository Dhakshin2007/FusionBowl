import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RefreshCw, Wand2, Send, Sparkles, MapPin, Trash2, ShoppingBag, Utensils, GlassWater, Circle, X } from 'lucide-react';
import { INGREDIENTS } from '../constants';
import { Ingredient, SectionId } from '../types';
import Button from './Button';
import { analyzeBowlNutrition } from '../services/geminiService';

type ContainerType = 'bowl' | 'shake' | 'plate';

const CONTAINER_CONFIG: Record<ContainerType, { label: string; icon: React.ReactNode; color: string; sizeOptions: string[] }> = {
  bowl: { 
    label: 'Fruit Bowl', 
    icon: <Utensils className="w-4 h-4" />, 
    color: 'bg-brand-orange',
    sizeOptions: ['Mini', 'Compact', 'Grand']
  },
  shake: { 
    label: 'Shake', 
    icon: <GlassWater className="w-4 h-4" />, 
    color: 'bg-blue-500',
    sizeOptions: ['Shot', 'Mega']
  },
  plate: { 
    label: 'Salad Plate', 
    icon: <Circle className="w-4 h-4" />, 
    color: 'bg-green-500',
    sizeOptions: ['Lite', 'Crunch', 'Platter']
  },
};

const BowlBuilder: React.FC = () => {
  // State for multi-container support
  const [activeContainers, setActiveContainers] = useState<ContainerType[]>(['bowl']);
  const [currentView, setCurrentView] = useState<ContainerType>('bowl');
  
  // Data for each container
  const [orders, setOrders] = useState<Record<ContainerType, {item: Ingredient, qty: number, id: string}[]>>({
    bowl: [],
    shake: [],
    plate: []
  });
  
  const [sizes, setSizes] = useState<Record<ContainerType, string | null>>({
    bowl: null,
    shake: null,
    plate: null
  });

  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [address, setAddress] = useState<string>('');
  
  const bowlRef = useRef<HTMLDivElement>(null);

  // Load from Local Storage on Mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('fusionBowl_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.activeContainers) setActiveContainers(parsed.activeContainers);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.sizes) setSizes(parsed.sizes);
        // Default to first active
        if (parsed.activeContainers && parsed.activeContainers.length > 0) {
            setCurrentView(parsed.activeContainers[0]);
        }
      } catch (e) {
        console.error("Failed to load saved bowl config", e);
      }
    }
  }, []);

  // Save to Local Storage on Change
  useEffect(() => {
    const config = { activeContainers, orders, sizes };
    localStorage.setItem('fusionBowl_config', JSON.stringify(config));
  }, [activeContainers, orders, sizes]);

  const categories = Array.from(new Set(INGREDIENTS.map(i => i.category)));

  // Helpers for current view
  const currentIngredients = orders[currentView];
  const currentSize = sizes[currentView];

  // Derived state for summary (Global)
  const globalSummary = useMemo(() => {
    let totalP = 0;
    let totalC = 0;
    const items: { container: ContainerType; size: string | null; ingredients: {item: Ingredient, qty: number}[] }[] = [];

    activeContainers.forEach(type => {
      const typeOrders = orders[type];
      const typeSize = sizes[type];
      
      const grouped: Record<string, {item: Ingredient, qty: number}> = {};
      typeOrders.forEach(entry => {
        if (grouped[entry.item.id]) {
          grouped[entry.item.id].qty += 1;
        } else {
          grouped[entry.item.id] = { item: entry.item, qty: 1 };
        }
      });
      
      const typeIngredients = Object.values(grouped);
      const typePrice = typeIngredients.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);
      const typeCal = typeIngredients.reduce((acc, curr) => acc + (curr.item.calories * curr.qty), 0);
      
      totalP += typePrice;
      totalC += typeCal;
      
      if (typeIngredients.length > 0 || typeSize) {
          items.push({ container: type, size: typeSize, ingredients: typeIngredients });
      }
    });

    return { totalPrice: totalP, totalCalories: totalC, items };
  }, [activeContainers, orders, sizes]);

  const handleAdd = (ingredient: Ingredient) => {
    if (!currentSize) return;
    const newItem = { item: ingredient, qty: 1, id: Math.random().toString(36).substr(2, 9) };
    setOrders(prev => ({
        ...prev,
        [currentView]: [...prev[currentView], newItem]
    }));
    setAiAnalysis('');
  };

  const handleRemoveOne = (ingredientId: string) => {
    setOrders(prev => {
        const currentList = prev[currentView];
        const indices = currentList.map((e, i) => e.item.id === ingredientId ? i : -1).filter(i => i !== -1);
        if (indices.length === 0) return prev;
        const lastIndex = indices[indices.length - 1];
        const newArr = [...currentList];
        newArr.splice(lastIndex, 1);
        return {
            ...prev,
            [currentView]: newArr
        };
    });
    setAiAnalysis('');
  };

  const handleClearCurrent = () => {
    setOrders(prev => ({ ...prev, [currentView]: [] }));
    setAiAnalysis('');
  };

  const handleClearAll = () => {
      setOrders({ bowl: [], shake: [], plate: [] });
      setSizes({ bowl: null, shake: null, plate: null });
      setActiveContainers(['bowl']);
      setCurrentView('bowl');
      setAiAnalysis('');
      setAddress('');
      localStorage.removeItem('fusionBowl_config');
  };

  const toggleContainer = (type: ContainerType) => {
    if (activeContainers.includes(type)) {
        if (activeContainers.length === 1) {
            alert("You must have at least one item in your order.");
            return;
        }
        const newActive = activeContainers.filter(t => t !== type);
        setActiveContainers(newActive);
        setOrders(prev => ({ ...prev, [type]: [] }));
        setSizes(prev => ({ ...prev, [type]: null }));
        if (currentView === type) {
            setCurrentView(newActive[0]);
        }
    } else {
        setActiveContainers([...activeContainers, type]);
        setCurrentView(type);
    }
  };

  const switchTo = (type: ContainerType) => {
      if (!activeContainers.includes(type)) {
          toggleContainer(type); 
      } else {
          setCurrentView(type);
      }
  };

  const handleAIAnalysis = async () => {
    if (globalSummary.items.length === 0) return;
    setIsAnalyzing(true);
    const allIngredients = activeContainers.flatMap(type => orders[type].map(o => o.item));
    const result = await analyzeBowlNutrition(allIngredients);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleWhatsAppOrder = () => {
    let message = `Hi Fusion Bowl! I'd like to place an order:\n`;
    
    globalSummary.items.forEach(item => {
        const config = CONTAINER_CONFIG[item.container];
        message += `\n*${config.label}* (${item.size || 'No Size'}):\n`;
        if (item.ingredients.length === 0) {
            message += `(No ingredients selected)\n`;
        } else {
            item.ingredients.forEach(ing => {
                message += `- ${ing.item.name} x${ing.qty}\n`;
            });
        }
    });

    message += `\n*Total Price:* ₹${globalSummary.totalPrice}`;
    
    if (address.trim()) {
      message += `\n\n*Delivery Address:*\n${address.trim()}`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/917207003062?text=${encodedMessage}`, '_blank');
  };

  const handleDragEnd = (event: any, info: any, ingredient: Ingredient) => {
    if (!currentSize) return;
    if (!bowlRef.current) return;
    const bowlRect = bowlRef.current.getBoundingClientRect();
    const dropPoint = { x: info.point.x, y: info.point.y };

    if (
        dropPoint.x >= bowlRect.left && 
        dropPoint.x <= bowlRect.right && 
        dropPoint.y >= bowlRect.top && 
        dropPoint.y <= bowlRect.bottom
    ) {
        handleAdd(ingredient);
    }
  };

  const getPrevContainer = (curr: ContainerType): ContainerType => {
      if (curr === 'bowl') return 'plate';
      if (curr === 'plate') return 'shake';
      return 'bowl'; 
  };
  const getNextContainer = (curr: ContainerType): ContainerType => {
      if (curr === 'bowl') return 'shake';
      if (curr === 'shake') return 'plate';
      return 'bowl'; 
  };

  const prevType = getPrevContainer(currentView);
  const nextType = getNextContainer(currentView);

  // Dynamic visual sizing logic
  const getContainerDimensions = () => {
      if (currentView === 'bowl') {
          if (currentSize === 'Mini') return 'w-64 h-64 border-white dark:border-neutral-800';
          if (currentSize === 'Grand') return 'w-96 h-96 border-white dark:border-neutral-800';
          return 'w-80 h-80 border-white dark:border-neutral-800'; // Compact
      }
      if (currentView === 'shake') {
          if (currentSize === 'Shot') return 'w-40 h-64 rounded-b-[3rem] rounded-t-lg border-white dark:border-neutral-800';
          if (currentSize === 'Mega') return 'w-56 h-96 rounded-b-[5rem] rounded-t-lg border-white dark:border-neutral-800';
          return 'w-48 h-80 rounded-b-[4rem] rounded-t-lg border-white dark:border-neutral-800'; // Default
      }
      if (currentView === 'plate') {
          // Salad Plate
          if (currentSize === 'Lite') return 'w-64 h-64 md:w-72 md:h-72 rounded-full border-gray-100 dark:border-neutral-700 shadow-none';
          if (currentSize === 'Platter') return 'w-80 h-80 md:w-[32rem] md:h-[32rem] rounded-full border-gray-100 dark:border-neutral-700 shadow-none';
          return 'w-72 h-72 md:w-[26rem] md:h-[26rem] rounded-full border-gray-100 dark:border-neutral-700 shadow-none'; // Crunch
      }
      return 'w-80 h-80 rounded-full border-white dark:border-neutral-800'; // Fallback
  };

  return (
    <section id={SectionId.BUILDER} className="py-12 md:py-24 relative bg-white dark:bg-brand-dark overflow-hidden transition-colors duration-300 min-h-screen">
      
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50/50 dark:bg-orange-900/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-brand-orange font-semibold tracking-wider uppercase text-sm">Interactive Builder</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark dark:text-brand-cream mt-2 mb-4">
            Build Your <span className="text-brand-green">Perfect Meal</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Combine a Bowl, Shake, or Salad Plate. Customize each one to your taste.
          </p>
        </motion.div>

        {/* Top Control Bar: Active Containers */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
            {(['bowl', 'shake', 'plate'] as ContainerType[]).map((type) => {
                const isActive = activeContainers.includes(type);
                const isCurrent = currentView === type;
                const config = CONTAINER_CONFIG[type];

                return (
                    <button
                        key={type}
                        onClick={() => isActive ? setCurrentView(type) : toggleContainer(type)}
                        className={`relative flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 border-2 ${
                            isCurrent 
                                ? `${config.color} text-white border-transparent shadow-lg scale-105` 
                                : isActive 
                                    ? 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-neutral-600'
                                    : 'bg-transparent text-gray-400 border-dashed border-gray-300 dark:border-neutral-700 hover:border-brand-orange hover:text-brand-orange'
                        }`}
                    >
                        {config.icon}
                        <span className="font-bold">{isActive ? config.label : `Add ${config.label}`}</span>
                        {isActive && (
                            <div
                                onClick={(e) => { e.stopPropagation(); toggleContainer(type); }}
                                className="ml-2 p-1 rounded-full hover:bg-black/20 transition-colors"
                            >
                                <X size={12} />
                            </div>
                        )}
                    </button>
                )
            })}
        </div>

        {/* Size Selection for CURRENT View */}
        <div className="flex justify-center mb-10">
            <div className="bg-gray-100 dark:bg-neutral-800 p-2 rounded-2xl flex gap-2 overflow-x-auto max-w-full">
                <span className="flex items-center px-4 text-xs font-bold uppercase text-gray-400">
                    Size for {CONTAINER_CONFIG[currentView].label}:
                </span>
                {CONTAINER_CONFIG[currentView].sizeOptions.map((s) => (
                    <button
                        key={s}
                        onClick={() => setSizes(prev => ({ ...prev, [currentView]: s }))}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                            currentSize === s 
                            ? 'bg-brand-dark dark:bg-brand-cream text-white dark:text-brand-dark shadow-md' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700'
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Ingredient Palette (Dependent on Current View) */}
          <motion.div 
            className={`lg:col-span-5 order-2 lg:order-1 transition-opacity duration-300 ${!currentSize ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-3xl p-6 border border-gray-100 dark:border-neutral-800 h-full">
                <h3 className="font-serif font-bold text-xl mb-4 dark:text-brand-cream flex items-center gap-2">
                    {CONTAINER_CONFIG[currentView].icon}
                    Adding to {CONTAINER_CONFIG[currentView].label}
                </h3>
                <div className="space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                    {categories.map((cat) => (
                    <div key={cat}>
                        <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">{cat}</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                        {INGREDIENTS.filter(i => i.category === cat).map((ingredient) => (
                            <motion.div
                                key={ingredient.id}
                                drag={!!currentSize}
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
                                    <p className="text-[10px] text-gray-400">
                                        ₹{ingredient.price}<span className="text-brand-orange">/Kg</span>
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
          </motion.div>

          {/* RIGHT: The Builder Area (Sticky) */}
          <motion.div 
            className="lg:col-span-7 order-1 lg:order-2 sticky top-20"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-gray-100 dark:border-neutral-800 p-6 md:p-10 relative overflow-hidden">
                
                {/* Visual Bowl Container & Ghosts */}
                <div className="flex justify-center mb-8 relative z-20 h-[32rem] items-center w-full">
                    
                    {/* PREV GHOST (Left) */}
                    <div 
                        onClick={() => switchTo(prevType)}
                        className={`absolute left-0 md:left-4 top-1/2 transform -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 border-2 border-dashed rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center flex-col gap-1 z-10 hover:scale-110 hover:border-brand-orange bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm group`}
                    >
                         <div className="text-gray-400 group-hover:text-brand-orange transition-colors">
                             {CONTAINER_CONFIG[prevType].icon}
                         </div>
                         <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-brand-orange text-center px-1">
                             {activeContainers.includes(prevType) ? 'Switch to' : 'Add'} <br/> {CONTAINER_CONFIG[prevType].label}
                         </span>
                    </div>

                    {/* NEXT GHOST (Right) */}
                    <div 
                        onClick={() => switchTo(nextType)}
                        className={`absolute right-0 md:right-4 top-1/2 transform -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 border-2 border-dashed rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center flex-col gap-1 z-10 hover:scale-110 hover:border-brand-orange bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm group`}
                    >
                         <div className="text-gray-400 group-hover:text-brand-orange transition-colors">
                             {CONTAINER_CONFIG[nextType].icon}
                         </div>
                         <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-brand-orange text-center px-1">
                             {activeContainers.includes(nextType) ? 'Switch to' : 'Add'} <br/> {CONTAINER_CONFIG[nextType].label}
                         </span>
                    </div>

                    {/* ACTIVE CONTAINER (Center) */}
                    <motion.div 
                        key={currentView} // Force re-render animation on switch
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.3 }}
                        ref={bowlRef}
                        className={`relative transition-all duration-500 border-8 flex items-center justify-center overflow-hidden shadow-[inset_0_10px_40px_rgba(0,0,0,0.1)] bg-brand-cream dark:bg-neutral-800 ring-1 ring-gray-200 dark:ring-neutral-700 ${getContainerDimensions()}`}
                    >
                        {/* Inner Texture */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-black/20 pointer-events-none z-20" />
                        
                        {/* BRAND LOGO WATERMARK */}
                        <img 
                            src="https://i.postimg.cc/PfYmDp54/Fusion-Bowl-Logo.png" 
                            alt="Brand Watermark" 
                            className="absolute w-1/2 h-1/2 object-contain opacity-[0.08] dark:opacity-[0.1] pointer-events-none grayscale z-0 select-none"
                        />

                        {/* Empty/Size State Overlay */}
                        {!currentSize ? (
                            <div className="absolute inset-0 z-40 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                                <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl animate-bounce-small">
                                    <div className="text-brand-orange mb-2 flex justify-center">{CONTAINER_CONFIG[currentView].icon}</div>
                                    <p className="font-bold text-lg">Select Size</p>
                                    <p className="text-xs text-gray-500">For {CONTAINER_CONFIG[currentView].label}</p>
                                </div>
                            </div>
                        ) : currentIngredients.length === 0 && (
                            <div className="text-center opacity-40 pointer-events-none relative z-30 p-4">
                                <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm font-medium">
                                    {currentView === 'shake' ? 'Add fruits to blend' : 'Drag ingredients here'}
                                </p>
                            </div>
                        )}

                        {/* Visual Ingredients */}
                        <AnimatePresence>
                            {currentIngredients.map((item) => {
                                const randomX = Math.random() * 60 - 30;
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
                    </motion.div>
                </div>

                {/* Controls & Summary */}
                <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800">
                    
                    {/* Global Summary Header */}
                    <div className="flex justify-between items-end mb-6 pb-4 border-b border-dashed border-gray-200 dark:border-neutral-700">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Meal Price</p>
                            <p className="text-3xl font-serif font-bold text-brand-dark dark:text-brand-cream">₹{globalSummary.totalPrice}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-sm text-gray-500 dark:text-gray-400">Total Energy</p>
                             <p className="text-xl font-bold text-brand-green">{globalSummary.totalCalories} kcal</p>
                        </div>
                    </div>

                    {/* List Items in CURRENT View */}
                    <div className="mb-2 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase text-gray-400">
                            Inside {CONTAINER_CONFIG[currentView].label}
                        </span>
                        {currentIngredients.length > 0 && (
                            <button onClick={handleClearCurrent} className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1">
                                <Trash2 size={10} /> Clear Container
                            </button>
                        )}
                    </div>

                    <div className="space-y-3 mb-6 max-h-48 overflow-y-auto custom-scrollbar pr-2 min-h-[100px] bg-white dark:bg-neutral-800 p-2 rounded-xl border border-gray-100 dark:border-neutral-700/50">
                        {(() => {
                            // Calculate summary specifically for current view ingredients for the UI list
                            const grouped: Record<string, {item: Ingredient, qty: number}> = {};
                            currentIngredients.forEach(entry => {
                                if (grouped[entry.item.id]) {
                                    grouped[entry.item.id].qty += 1;
                                } else {
                                    grouped[entry.item.id] = { item: entry.item, qty: 1 };
                                }
                            });
                            const viewSummary = Object.values(grouped);

                            if (viewSummary.length === 0) {
                                return (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                                        {!currentSize ? "Select a size above first." : "Container is empty."}
                                    </div>
                                );
                            }

                            return viewSummary.map((line) => (
                                <div key={line.item.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-neutral-700/50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{line.item.emoji}</span>
                                        <div>
                                            <p className="font-bold text-xs text-gray-800 dark:text-gray-200">{line.item.name}</p>
                                            <p className="text-[10px] text-gray-400">₹{line.item.price} x {line.qty}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleRemoveOne(line.item.id)}
                                            className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-neutral-700 hover:text-red-500"
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span className="text-xs font-bold w-4 text-center">{line.qty}</span>
                                        <button 
                                            onClick={() => handleAdd(line.item)}
                                            className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-neutral-700 hover:text-green-500"
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>

                    {/* Address Input */}
                    {globalSummary.items.length > 0 && (
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
                            disabled={globalSummary.items.length === 0}
                            className="w-full gap-2 shadow-orange-200 dark:shadow-none"
                        >
                            <Send size={16} /> Order Meal
                        </Button>
                        <button
                            onClick={handleClearAll}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-gray-200 dark:border-neutral-700 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                            <Trash2 size={16} /> Reset All
                        </button>
                    </div>

                    {/* AI Analysis */}
                    <div className="mt-4">
                         {!aiAnalysis ? (
                            <button 
                            onClick={handleAIAnalysis}
                            disabled={globalSummary.items.length === 0 || isAnalyzing}
                            className="w-full flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 py-2 rounded-xl transition-colors text-xs font-bold uppercase tracking-wide disabled:opacity-50"
                            >
                            {isAnalyzing ? <RefreshCw className="animate-spin w-3 h-3" /> : <Wand2 className="w-3 h-3" />}
                            {isAnalyzing ? "Analyzing Meal..." : "Analyze Meal Nutrition (AI)"}
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