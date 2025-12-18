import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BowlBuilder from './components/BowlBuilder';
import MenuSection from './components/MenuSection';
import SubscriptionModal from './components/SubscriptionModal';
import LegalModal, { LegalDocType } from './components/LegalModal';
import CookieBanner from './components/CookieBanner';
import FAQ from './components/FAQ';
import Cursor from './components/Cursor';
import { SERVICES, TESTIMONIALS } from './constants';
import { SectionId } from './types';
import Button from './components/Button';
import { motion, Variants } from 'framer-motion';
import { Truck, MapPin, Clock, Phone, Mail, Instagram, Facebook, Code, CalendarHeart, Box, ChefHat, ArrowDown } from 'lucide-react';

const App: React.FC = () => {
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>(null);

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'daily') {
      setIsSubModalOpen(true);
    } else if (serviceId === 'bulk') {
      window.open('https://wa.me/917207003062?text=Hi%20Fusion%20Bowl!%20I%20am%20interested%20in%20placing%20a%20Bulk%20Order.', '_blank');
    } else if (serviceId === 'catering') {
      window.open('https://wa.me/917207003062?text=Hi%20Fusion%20Bowl!%20I%20am%20interested%20in%20your%20Premium%20Catering%20services.', '_blank');
    }
  };

  const getServiceIcon = (iconName: string) => {
    switch(iconName) {
      case 'calendar': return <CalendarHeart size={32} />;
      case 'box': return <Box size={32} />;
      case 'chef': return <ChefHat size={32} />;
      default: return <Truck size={32} />;
    }
  };

  // Shared transition config
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Cursor />
      <Navbar />
      
      <main>
        <Hero />

        {/* Brand Story Section */}
        <section id={SectionId.STORY} className="py-24 bg-white dark:bg-brand-dark transition-colors duration-300 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2"
              >
                <img 
                  src="https://picsum.photos/600/800?grayscale" 
                  alt="Fresh Fruits Preparation" 
                  className="rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2 space-y-6"
              >
                <h2 className="text-4xl font-serif font-bold text-brand-dark dark:text-brand-cream">Not Just a Fruit Shop. <br/>A Daily Ritual.</h2>
                <div className="w-20 h-1 bg-brand-orange"></div>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  Fusion Bowl started with a simple question: "Why is healthy food so boring?" in the Young Minds of an Enthusiastic Team
                  We believe that eating fresh shouldn't feel like a chore. It should be colorful, textural, and deeply satisfying.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  Located in the heart of NRT, we source our produce daily at 4 AM to ensure that when you customize your bowl at 10 AM, it's as fresh as nature intended.
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400"><Truck size={20} /></div>
                    <span className="font-medium dark:text-gray-300">Hand Picked with Love 🫳</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400"><Clock size={20} /></div>
                    <span className="font-medium dark:text-gray-300">Freshly Prepared ⏰🔃🕧</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id={SectionId.SERVICES} className="py-24 bg-brand-cream dark:bg-neutral-900 relative transition-colors duration-300">
          <div className="container mx-auto px-6">
             <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={fadeInUp}
               className="text-center mb-16"
             >
              <span className="text-brand-orange font-semibold tracking-wider uppercase text-sm">Our Offerings</span>
              <h2 className="text-4xl font-serif font-bold text-brand-dark dark:text-brand-cream mt-2">Services Tailored for You</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {SERVICES.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-neutral-700 flex flex-col items-center text-center group transform hover:-translate-y-3"
                >
                  {service.id === 'daily' && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
                        <div className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg mb-1 whitespace-nowrap">
                            Most Popular
                        </div>
                        <ArrowDown className="w-8 h-8 text-brand-orange mx-auto fill-current" />
                    </div>
                  )}

                  <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-brand-orange mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                    {getServiceIcon(service.icon)}
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3 text-gray-900 dark:text-brand-cream group-hover:text-brand-orange transition-colors">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed flex-grow font-medium">{service.description}</p>
                  <Button 
                    variant="outline" 
                    size="md" 
                    className="w-full"
                    onClick={() => handleServiceClick(service.id)}
                  >
                    {service.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Section (New) */}
        <MenuSection />

        {/* The Flagship Builder */}
        <BowlBuilder />

        {/* Testimonials */}
        <section id={SectionId.TESTIMONIALS} className="py-24 bg-brand-dark dark:bg-neutral-950 text-white transition-colors duration-300">
          <div className="container mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-serif font-bold text-center mb-16 text-brand-cream"
            >
              Community Love
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300"
                >
                   <div className="flex gap-1 mb-4 text-brand-orange">
                     {[...Array(t.rating)].map((_, i) => <span key={i}>★</span>)}
                   </div>
                   <p className="text-gray-300 italic mb-6">"{t.text}"</p>
                   <div>
                     <p className="font-bold text-white">{t.name}</p>
                     <p className="text-sm text-gray-500">{t.role}</p>
                   </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />

        {/* Location / Trust */}
        <section className="py-20 bg-white dark:bg-brand-dark transition-colors duration-300">
          <div className="container mx-auto px-6 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto bg-green-50 dark:bg-green-900/10 rounded-3xl p-8 md:p-12 border border-green-100 dark:border-green-900/30"
            >
              <MapPin className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h2 className="text-3xl font-serif font-bold mb-4 dark:text-brand-cream">Visit Us in NRT</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Experience the freshness live at our flagship store. We maintain strict hygiene protocols and 100% transparency in preparation.
              </p>
              
              {/* Google Map Embed */}
              <div className="w-full h-96 bg-gray-200 dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-neutral-700">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3466.394110126084!2d80.0383884!3d16.2466288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a8128722725a5%3A0xcc6c8577b8a42a7d!2sFusion%20Bowl%20-%20Customization%20is%20the%20Key!5e1!3m2!1sen!2sin!4v1765627099739!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fusion Bowl Location"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 pt-16 pb-24 md:pb-8 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <img 
                    src="https://i.postimg.cc/SxPbst4r/Fusion-Bowl-PNG-(Bg-removed).png" 
                    alt="Fusion Bowl Logo" 
                    className="h-12 w-auto" 
                 />
                 <div className="text-3xl font-serif font-bold text-brand-dark dark:text-brand-cream">
                    Fusion<span className="text-brand-orange">Bowl</span>
                 </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Customisation is the Key. We are redefining healthy eating in NRT with premium, fresh, and fully customizable fruit bowls.
              </p>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="text-lg font-bold text-brand-dark dark:text-brand-cream mb-6">Contact & Delivery</h4>
              <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-orange flex-shrink-0 mt-1" />
                  <span>
                    #4, S.N.R Green Fields, Reddynagar,<br />
                    Narasaraopet.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-orange flex-shrink-0" />
                  <a href="https://wa.me/917207003062" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                    7207003062 (WhatsApp)
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-orange flex-shrink-0" />
                  <a href="mailto:fusionbowl7@gmail.com" className="hover:text-brand-orange transition-colors break-all">
                    fusionbowl7@gmail.com
                  </a>
                </li>
              </ul>

              {/* Delivery Timings */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-800">
                <h5 className="font-bold text-brand-dark dark:text-brand-cream mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-orange" /> Delivery Timings
                </h5>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p><span className="font-medium text-gray-700 dark:text-gray-300">Mrng:</span> 6:30 AM - 10:30 AM</p>
                  <p><span className="font-medium text-gray-700 dark:text-gray-300">Evng:</span> 3:30 PM - 6:30 PM</p>
                  <p className="text-brand-orange font-medium text-xs mt-1">Sunday is a Holiday</p>
                </div>
              </div>
            </div>

            {/* Social / Links Column */}
            <div>
              <h4 className="text-lg font-bold text-brand-dark dark:text-brand-cream mb-6">Stay Connected</h4>
              <div className="flex gap-4 mb-6">
                <a href="https://www.instagram.com/fusionbowl25/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-gray-100 dark:border-neutral-700 flex items-center justify-center text-gray-500 hover:text-brand-orange hover:border-brand-orange transition-all group">
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://wa.me/917207003062" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-gray-100 dark:border-neutral-700 flex items-center justify-center text-gray-500 hover:text-green-500 hover:border-green-500 transition-all group">
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <button 
                  onClick={() => alert("Fusion Bowl Facebook page Coming Soon!")}
                  className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-gray-100 dark:border-neutral-700 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-600 transition-all group"
                >
                  <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Follow us for daily updates on fresh arrivals and special offers.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>
              &copy; {new Date().getFullYear()} Fusion Bowl. All rights reserved.
            </div>
            <div className="flex gap-6">
              <button onClick={() => setActiveLegalDoc('privacy')} className="hover:text-brand-orange transition-colors">Privacy Policy</button>
              <button onClick={() => setActiveLegalDoc('terms')} className="hover:text-brand-orange transition-colors">Terms of Service</button>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-neutral-800/50 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-600 flex items-center justify-center gap-2">
              <Code className="w-3 h-3" />
              Developed by 
              <a 
                href="mailto:kothadhakshin123@gmail.com?subject=Issue%20on%20Fusion%20Bowl%20Website" 
                className="text-gray-500 dark:text-gray-500 hover:text-brand-orange transition-colors font-medium border-b border-dashed border-gray-400 hover:border-brand-orange pb-0.5"
              >
                Dhakshin Kotha
              </a>
            </p>
          </div>
        </div>
      </footer>

      <SubscriptionModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)} 
      />

      <LegalModal 
        type={activeLegalDoc} 
        onClose={() => setActiveLegalDoc(null)} 
      />

      <CookieBanner onOpenPolicy={() => setActiveLegalDoc('cookies')} />
    </div>
  );
};

export default App;