import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ShoppingBag, X, Plus, Minus, Send, Trash2, Search, Filter, ArrowLeft, Clock, Calendar, MapPin, Check, ChevronRight } from 'lucide-react';
import { SHOP_PRODUCTS } from '../constants';
import { Product, CartItem } from '../types';
import Button from './Button';

const ShopPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details'>('cart');
  
  // Checkout Details
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(SHOP_PRODUCTS.map(p => p.category))];
    return cats;
  }, []);

  const filteredProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Temporary notification would be nice, but simple state change for now
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === id) {
          return { ...item, quantity: Math.max(0, item.quantity + delta) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const handleProceedToDetails = () => {
    if (cart.length === 0) return;
    setCheckoutStep('details');
  };

  const handleWhatsAppOrder = () => {
    if (!address.trim() || !deliveryDate || !deliveryTime) {
      setErrorMsg("Please fill in all mandatory delivery details.");
      return;
    }

    let message = `Hello Fusion Bowl! I would like to place an order from your Shop:\n\n`;
    
    cart.forEach(item => {
      message += `- ${item.product.name} x${item.quantity} (${item.product.unit}) = ₹${item.product.price * item.quantity}\n`;
    });

    message += `\n*Total Amount:* ₹${totalPrice}\n\n`;
    message += `*Delivery Details:*\n`;
    message += `- Address: ${address}\n`;
    message += `- Date: ${deliveryDate}\n`;
    message += `- Time: ${deliveryTime}\n`;

    window.open(`https://wa.me/917207003062?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-dark transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
             <button onClick={() => window.close()} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors md:hidden">
               <ArrowLeft size={20} />
             </button>
             <h1 className="text-2xl font-serif font-bold text-brand-dark dark:text-brand-cream">
               Fusion<span className="text-brand-orange">Shop</span>
             </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search fruits..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-neutral-800 rounded-full text-sm outline-none focus:ring-2 focus:ring-brand-orange transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-brand-orange text-white rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-brand-dark">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Categories */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold dark:text-brand-cream mb-4">Our Fresh <span className="text-brand-orange">Pantry</span></h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-lg">Hand-picked, premium quality fruits and juices delivered from our garden to your doorstep in NRT.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-brand-orange text-white shadow-lg' 
                      : 'bg-white dark:bg-neutral-800 text-gray-500 hover:border-brand-orange border-2 border-transparent shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 dark:border-white/5 group flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm p-2 rounded-2xl shadow-sm">
                      <span className="text-2xl">{product.emoji}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-[10px] font-black uppercase text-brand-orange tracking-widest mb-2">{product.category}</span>
                    <h3 className="text-xl font-bold dark:text-brand-cream mb-2 group-hover:text-brand-orange transition-colors">{product.name}</h3>
                    <div className="flex items-baseline gap-1 mt-auto mb-6">
                      <span className="text-2xl font-black text-brand-dark dark:text-brand-cream">₹{product.price}</span>
                      <span className="text-xs text-gray-400 font-medium lowercase">/ {product.unit}</span>
                    </div>
                    <Button 
                      onClick={() => addToCart(product)}
                      className="w-full py-3 text-xs font-black uppercase tracking-widest shadow-brand-orange/20"
                    >
                      <Plus size={14} className="mr-2" /> Add to Cart
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-32 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold dark:text-white">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Cart Slider */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsCartOpen(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-neutral-950 shadow-2xl h-full flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-serif font-bold dark:text-brand-cream">
                    {checkoutStep === 'cart' ? 'Your Shopping Bag' : 'Order Details'}
                  </h3>
                  <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest mt-1">
                    {cart.length} unique items selected
                  </p>
                </div>
                <button 
                  onClick={() => {
                    if (checkoutStep === 'details') setCheckoutStep('cart');
                    else setIsCartOpen(false);
                  }}
                  className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  {checkoutStep === 'cart' ? <X size={20} /> : <ArrowLeft size={20} />}
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                {checkoutStep === 'cart' ? (
                  cart.length > 0 ? (
                    <div className="space-y-6">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-neutral-900 rounded-[2rem] border border-gray-100 dark:border-white/5">
                           <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                              <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-grow">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-sm dark:text-white line-clamp-1">{item.product.name}</h4>
                                <button onClick={() => updateQuantity(item.product.id, -item.quantity)} className="text-red-400 p-1"><Trash2 size={14}/></button>
                              </div>
                              <p className="text-[10px] text-gray-500 font-medium mb-3">₹{item.product.price} / {item.product.unit}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 p-1.5 rounded-xl border border-gray-100 dark:border-white/10">
                                   <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:text-red-500 transition-colors"><Minus size={14} /></button>
                                   <span className="font-black text-xs min-w-[20px] text-center dark:text-white">{item.quantity}</span>
                                   <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:text-brand-orange transition-colors"><Plus size={14} /></button>
                                </div>
                                <span className="font-black text-sm dark:text-white">₹{item.product.price * item.quantity}</span>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag size={40} />
                      </div>
                      <h4 className="text-xl font-bold dark:text-white">Empty Basket</h4>
                      <p className="text-sm">Explore our garden and add some fruits!</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-brand-orange mb-3 tracking-widest px-1">Delivery Address *</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 text-brand-orange" size={18} />
                        <textarea 
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          placeholder="House No, Landmark, Area in NRT..."
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-white/10 rounded-2xl text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-brand-orange transition-all dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-brand-orange mb-3 tracking-widest px-1">Preferred Date *</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-orange" size={18} />
                          <input 
                            type="date"
                            value={deliveryDate}
                            onChange={e => setDeliveryDate(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-white/10 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-brand-orange transition-all dark:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-brand-orange mb-3 tracking-widest px-1">Delivery Time *</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-orange" size={18} />
                          <input 
                            type="text"
                            placeholder="e.g. 10 AM"
                            value={deliveryTime}
                            onChange={e => setDeliveryTime(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-white/10 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-brand-orange transition-all dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-center gap-3">
                        <X size={16} className="text-red-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{errorMsg}</p>
                      </div>
                    )}

                    <div className="p-6 bg-brand-orange/5 rounded-3xl border border-brand-orange/10">
                      <p className="text-xs text-brand-orange font-bold leading-relaxed">
                        <Check size={14} className="inline mr-1" /> Orders are verified and delivery cost is calculated based on location during WhatsApp confirmation.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Billable Amount</span>
                  <span className="text-4xl font-serif font-bold dark:text-brand-cream">₹{totalPrice}</span>
                </div>
                
                {checkoutStep === 'cart' ? (
                  <Button 
                    disabled={cart.length === 0}
                    onClick={handleProceedToDetails}
                    className="w-full py-5 text-sm uppercase font-black tracking-widest gap-2 shadow-brand-orange/20"
                  >
                    Set Delivery Info <ChevronRight size={18} />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleWhatsAppOrder}
                    className="w-full py-5 text-sm uppercase font-black tracking-widest gap-2 shadow-brand-orange/20"
                  >
                    <Send size={18} /> Confirm via WhatsApp
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-12 bg-white dark:bg-neutral-900 text-center border-t border-gray-100 dark:border-neutral-800">
         <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em]">&copy; {new Date().getFullYear()} Fusion Bowl • Narasaraopet</p>
      </footer>
    </div>
  );
};

export default ShopPage;