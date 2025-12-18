import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | 'cookies' | null;

interface LegalModalProps {
  type: LegalDocType;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (type) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [type]);

  if (!type) return null;

  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    cookies: 'Cookie Policy'
  };

  const content = {
    privacy: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
        <p>At Fusion Bowl, we value your privacy. This policy explains how we handle your information.</p>
        
        <h4 className="font-bold text-gray-900 dark:text-white mt-4">1. Information We Collect</h4>
        <p>We strictly minimize data collection. We do not require account creation to browse. When you place an order via WhatsApp, we process the phone number and order details you voluntarily provide.</p>
        
        <h4 className="font-bold text-gray-900 dark:text-white mt-4">2. Usage of Data</h4>
        <p>Your data is used solely for:</p>
        <ul className="list-disc pl-5">
          <li>Fulfilling your daily bowl or catering orders.</li>
          <li>Improving our menu based on popular choices.</li>
          <li>Storing local preferences (like Dark/Light mode) on your device.</li>
        </ul>

        <h4 className="font-bold text-gray-900 dark:text-white mt-4">3. Data Sharing</h4>
        <p>We do not sell, trade, or transfer your data to third parties. All order transactions occur directly between you and our business via WhatsApp.</p>

        <h4 className="font-bold text-gray-900 dark:text-white mt-4">4. Technical Reporting</h4>
        <p className="p-3 bg-gray-100 dark:bg-neutral-800 rounded-lg border-l-4 border-brand-orange">
            Any technical reports, bugs, or vulnerability issues regarding this website should be reported directly to <strong>Dhakshin Kotha</strong>.
        </p>
      </div>
    ),
    terms: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <p>Welcome to Fusion Bowl. By using this website, you agree to the following terms.</p>
        
        <h4 className="font-bold text-gray-900 dark:text-white mt-4">1. Pricing & Availability</h4>
        <p>Prices listed (per Kg or per Bowl) are subject to seasonal fluctuation. While we aim for accuracy, the final price confirmed on WhatsApp is binding. "Market Price" items depend on daily availability in NRT.</p>

        <h4 className="font-bold text-gray-900 dark:text-white mt-4">2. Orders</h4>
        <p>This website serves as a catalogue and customization tool. Actual orders are placed via WhatsApp. We are not responsible for connectivity issues preventing order transmission.</p>

        <h4 className="font-bold text-gray-900 dark:text-white mt-4">3. Health Disclaimer</h4>
        <p>While we ensure the highest hygiene standards, customers with severe allergies (nuts, dairy, specific fruits) should disclose them explicitly when ordering on WhatsApp.</p>
      </div>
    ),
    cookies: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <p>Fusion Bowl uses cookies and local storage to enhance your experience.</p>
        
        <h4 className="font-bold text-gray-900 dark:text-white mt-4">1. What we store</h4>
        <p>We store simple data in your browser's "Local Storage" to remember:</p>
        <ul className="list-disc pl-5 mt-2">
            <li>Your <strong>Dark Mode / Light Mode</strong> preference.</li>
            <li>Your <strong>Meal Configuration</strong> (e.g., if you are building a Bowl + Shake combination) so you don't lose your progress if you refresh the page.</li>
        </ul>
        
        <h4 className="font-bold text-gray-900 dark:text-white mt-4">2. Third-Party Cookies</h4>
        <p>We may use embedded maps (Google Maps) which may set their own cookies according to their policies. We do not use invasive tracking cookies for advertising.</p>

        <h4 className="font-bold text-gray-900 dark:text-white mt-4">3. Managing Preferences</h4>
        <p>You can clear your browser cache at any time to reset these preferences. This will reset your theme and clear any unsent orders in the Builder.</p>
      </div>
    )
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        >
          <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
            <h3 className="text-2xl font-serif font-bold text-brand-dark dark:text-brand-cream">{titles[type]}</h3>
            <button 
              onClick={onClose}
              className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto custom-scrollbar">
            {content[type]}
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-neutral-800 text-right">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-brand-dark dark:bg-brand-cream text-white dark:text-brand-dark rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LegalModal;