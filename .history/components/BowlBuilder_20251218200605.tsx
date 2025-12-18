import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Minus, Send, ShoppingBag, GlassWater, Trash2, X,
  ChevronRight, ChevronLeft, Sparkles, Wand2, RefreshCw,
  Check, Utensils, Info, AlertCircle
} from 'lucide-react';

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

  const addressRef = useRef<HTMLInputElement>(null);

  /* ---------------- MOBILE DETECTION ---------------- */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activePackData = selectedPack ? PACKS[selectedPack] : null;
  const currentCategory =
    activePackData ? PLATTER_CATEGORIES[activePackData.categories[currentCategoryIndex]] : null;
  const currentCategoryWeight =
    activePackData && currentCategory
      ? (activePackData.weights as any)[currentCategory.id]
      : '';

  /* ---------------- PRICE ---------------- */
  const juicePriceMap = (juice: JuiceIngredient | undefined, size: string) => {
    if (!juice) return 0;
    return size === 'Shot' ? juice.shotPrice : juice.regularPrice;
  };

  const totalPrice = useMemo(() => {
    const bowl = activePackData ? activePackData.price : 0;
    const juices = Object.entries(selectedJuices).reduce((acc, [key, qty]) => {
      const [id, size] = key.split(':');
      const juice = INGREDIENTS.find(j => j.id === id) as JuiceIngredient;
      return acc + juicePriceMap(juice, size) * qty;
    }, 0);
    return bowl + juices;
  }, [activePackData, selectedJuices]);

  /* ---------------- HANDLERS ---------------- */
  const handleSelectPack = (packId: 'classic' | 'prime') => {
    setSelectedPack(packId);
    setSelections({});
    setCurrentCategoryIndex(0);
    setErrorMsg(null);
  };

  const handleSelectItem = (category: string, item: string) => {
    setSelections(prev => ({ ...prev, [category]: item }));
    setErrorMsg(null);

    if (activePackData && currentCategoryIndex < activePackData.categories.length - 1) {
      setTimeout(() => setCurrentCategoryIndex(i => i + 1), 300);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!address.trim()) {
      setErrorMsg('Please enter your delivery address to proceed.');
      addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      addressRef.current?.focus();
      return;
    }

    let message = `Hi Fusion Bowl! I'd like to place an order:\n\n`;

    if (selectedPack && activePackData) {
      message += `*Fruit Platter (${activePackData.name})*\n`;
      activePackData.categories.forEach(catId => {
        const cat = PLATTER_CATEGORIES[catId];
        const weight = (activePackData.weights as any)[catId];
        message += `- ${cat.name} (${weight}): ${selections[catId]}\n`;
      });
    }

    message += `\n*Total:* ₹${totalPrice}\n`;
    message += `*Address:* ${address}`;

    window.open(`https://wa.me/917207003062?text=${encodeURIComponent(message)}`, '_blank');
  };

  /* ---------------- PLATTER RENDER ---------------- */
  const renderPlatterSlots = () => {
    if (!activePackData) return null;
    const angle = 360 / activePackData.sections;

    return (
      <div className="relative w-64 h-64 mx-auto">
        {activePackData.categories.map((catId, i) => {
          const isSelected = selections[catId];
          return (
            <div
              key={catId}
              className="absolute top-0 left-1/2 h-1/2 w-1 origin-bottom"
              style={{ transform: `rotate(${i * angle}deg)` }}
            >
              <div
                className={`absolute -top-6 left-1/2 w-12 h-12 rounded-full flex items-center justify-center border
                  ${isSelected ? 'bg-brand-orange text-white' : 'bg-gray-200'}
                `}
                style={{ transform: `translateX(-50%) rotate(-${i * angle}deg)` }}
              >
                {isSelected ? <Check size={16} /> : <span>{i + 1}</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const isMobileComplete =
    isMobile &&
    selectedPack &&
    activePackData &&
    Object.keys(selections).length === activePackData.sections;

  /* ---------------- JSX ---------------- */
  return (
    <section id={SectionId.BUILDER} className="py-16">
      <div className="container mx-auto px-4">

        {/* PACK SELECTION */}
        <div className="flex gap-4 mb-8">
          {(['classic', 'prime'] as const).map(pack => (
            <button
              key={pack}
              onClick={() => handleSelectPack(pack)}
              className={`flex-1 p-6 rounded-xl border
                ${selectedPack === pack ? 'bg-brand-orange text-white' : 'bg-white'}
              `}
            >
              {PACKS[pack].name}
            </button>
          ))}
        </div>

        {/* MOBILE FLOW */}
        {isMobile && selectedPack && (
          <>
            {/* Empty / Filled Platter */}
            {renderPlatterSlots()}

            {/* ITEM SELECTION */}
            {currentCategory && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">{currentCategory.name}</h3>
                {currentCategory.items.map(item => (
                  <button
                    key={item}
                    onClick={() => handleSelectItem(currentCategory.id, item)}
                    className="w-full p-4 mb-2 border rounded-xl text-left"
                  >
                    {item}
                  </button>
                ))}

                {/* GRAMS */}
                <div className="mt-3 text-sm text-brand-orange font-bold">
                  Portion: {currentCategoryWeight}
                </div>
              </div>
            )}

            {/* CHECKOUT */}
            {isMobileComplete && (
              <div className="mt-8 p-6 bg-brand-dark text-white rounded-2xl">
                <p className="text-3xl font-bold mb-4">₹{totalPrice}</p>

                <input
                  ref={addressRef}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Delivery Address *"
                  className="w-full p-4 rounded-xl text-black mb-4"
                />

                <Button
                  onClick={handleWhatsAppOrder}
                  disabled={!address.trim()}
                  className="w-full"
                >
                  <Send size={18} /> Confirm Order
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default BowlBuilder;
