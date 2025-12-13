import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

interface CookieBannerProps {
  onOpenPolicy: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Delay slightly for animation effect
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6"
        >
          <div className="container mx-auto max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-200 dark:border-neutral-800 p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="p-3 bg-brand-orange/10 rounded-full hidden md:block">
              <Cookie className="w-6 h-6 text-brand-orange" />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">We value your comfort</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We use cookies to remember your <strong>Dark/Light mode</strong> preference and ensure the best experience. 
                Read our <button onClick={onOpenPolicy} className="text-brand-orange hover:underline font-medium">Cookie Policy</button>.
              </p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={handleAccept}
                className="flex-1 md:flex-none px-6 py-2.5 bg-brand-dark dark:bg-brand-cream text-white dark:text-brand-dark rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;