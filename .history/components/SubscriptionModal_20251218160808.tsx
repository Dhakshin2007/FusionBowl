// In the Step 1 section, remove the price-related code and update the scroll hint animation

// Find this section in step === 1 and replace the scroll hint:

{step === 1 && (
  <div className="space-y-8 pb-12">
    {/* ... existing code ... */}

    <AnimatePresence>
      {showScrollHint && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex flex-col items-center gap-2 pt-8 text-gray-400 dark:text-gray-600"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">Scroll to see details</span>
          <motion.div 
            animate={{ y: [0, 8, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="hover:text-brand-orange transition-colors cursor-pointer"
          >
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)}

// The price display in the footer is already conditional and shows for all steps.
// It will naturally display from Step 2 onwards since the price is calculated from duration/size selections in Step 2.
