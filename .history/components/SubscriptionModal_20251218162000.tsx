{/* Stepper Navigation Footer */}
<div className="p-6 md:p-8 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] shrink-0">
  <div className="max-w-2xl mx-auto">
    <div className="flex justify-between items-end mb-8">
      {step !== 1 && (
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Investment</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-serif font-bold text-brand-dark dark:text-brand-cream">₹{currentPrice}</span>
            <span className="text-sm text-gray-500">/{duration}</span>
          </div>
        </div>
      )}
      
      <div className="text-right hidden sm:block">
        <div className="flex items-center gap-2 bg-brand-orange/10 px-4 py-1.5 rounded-full border border-brand-orange/20 mb-1">
          <Star size={14} className="text-brand-orange fill-current" />
          <span className="font-black text-brand-orange uppercase text-[10px]">{planType} - {size}</span>
        </div>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{currentWeight}</span>
      </div>
    </div>
