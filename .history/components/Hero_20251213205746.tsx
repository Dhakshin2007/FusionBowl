import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from './Button';
import { SectionId } from '../types';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Parallax configurations for different depths/directions
  const yUp = useTransform(scrollY, [0, 1000], [0, -300]);
  const yDown = useTransform(scrollY, [0, 1000], [0, 300]);
  const ySlowUp = useTransform(scrollY, [0, 1000], [0, -150]);
  const ySlowDown = useTransform(scrollY, [0, 1000], [0, 150]);

  // Floating Fruits Configuration
  const fruits = [
    // Corners & Edges
    { emoji: '🍓', top: '5%', left: '10%', size: 'text-4xl md:text-5xl', style: { y: yDown }, z: 20 },
    { emoji: '🥑', bottom: '10%', left: '5%', size: 'text-5xl md:text-6xl', style: { y: yUp }, z: 20 },
    { emoji: '🍇', top: '15%', right: '15%', size: 'text-4xl md:text-5xl', style: { y: ySlowDown }, z: 10 },
    { emoji: '🍍', bottom: '5%', right: '10%', size: 'text-5xl md:text-6xl', style: { y: ySlowUp }, z: 20 },
    
    // Mid-Floating (Continuous Animation)
    { emoji: '🥭', top: '45%', right: '-5%', size: 'text-5xl md:text-6xl', animate: { y: [0, -20, 0], rotate: [0, 5, 0] }, duration: 4, z: 15 },
    { emoji: '🍉', bottom: '35%', left: '-5%', size: 'text-4xl md:text-5xl', animate: { rotate: [0, 10, 0], x: [0, 10, 0] }, duration: 6, z: 10 },
    
    // Inner Circle (Smaller/Subtler)
    { emoji: '🥝', top: '10%', right: '35%', size: 'text-3xl', animate: { y: [0, 15, 0] }, duration: 5, z: 5 },
    { emoji: '🍌', top: '30%', left: '20%', size: 'text-4xl', style: { y: yDown }, z: 5 },
    { emoji: '🍒', bottom: '25%', right: '30%', size: 'text-3xl', style: { y: ySlowDown }, z: 5 },
    
    // Background / Blurred
    { emoji: '🍎', bottom: '-5%', left: '40%', size: 'text-4xl', style: { y: yUp }, z: 10, blur: false },
    { emoji: '🍏', top: '-5%', left: '50%', size: 'text-3xl', animate: { y: [0, 10, 0] }, duration: 7, z: 0, blur: false },
    { emoji: '🍊', top: '40%', right: '5%', size: 'text-7xl md:text-8xl', animate: { scale: [1, 1.1, 1] }, duration: 8, z: 0, blur: true },
  ];

  return (
    <section id={SectionId.HERO} className="relative min-h-screen flex items-center overflow-hidden bg-brand-cream dark:bg-brand-dark pt-20 md:pt-0 transition-colors duration-300">
      
      {/* Abstract Shapes/Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-brand-orange/10 dark:bg-brand-orange/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30rem] h-[30rem] bg-brand-green/10 dark:bg-brand-green/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left"
        >
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-brand-orange font-semibold text-sm tracking-wide border border-orange-100 dark:border-orange-500/20">
            #1 Premium Fruit Bowls in NRT
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-brand-dark dark:text-brand-cream mb-6">
            Freshness You Can <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">
              Taste & Feel
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
            Experience the fusion of health and luxury. Customize your daily dose of vitamins with our premium, hand-picked fruits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={`#${SectionId.BUILDER}`}>
              <Button size="lg" className="w-full sm:w-auto gap-2 group">
                Customise Bowl <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href={`#${SectionId.SERVICES}`}>
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                Explore Services
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Visual Content (Mock 3D Parallax) */}
        <div className="relative h-[500px] w-full flex items-center justify-center">
            
            {/* ROTATING TEXT RING */}
            <motion.div
                className="absolute z-0 w-[350px] h-[350px] md:w-[580px] md:h-[580px] flex items-center justify-center pointer-events-none opacity-20 dark:opacity-30"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                    <defs>
                    <path id="textCircle" d="M 100, 100 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0" />
                    </defs>
                    <text className="font-serif font-bold uppercase tracking-[0.25em] fill-current text-brand-dark dark:text-brand-cream text-[13px]">
                    <textPath href="#textCircle" startOffset="0%">
                        Fusion Bowl • Pure Freshness  • Pure Royalty • 
                    </textPath>
                    </text>
                </svg>
            </motion.div>

            {/* The "Bowl" Circle */}
            <motion.div 
              className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-white dark:bg-neutral-800 rounded-full shadow-2xl shadow-orange-500/10 flex items-center justify-center relative z-10 border border-orange-50 dark:border-neutral-700 transition-colors duration-300"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
               <div className="text-center p-8">
                  <span className="text-9xl block mb-2 filter drop-shadow-md">🥗</span>
                  <p className="font-serif italic text-gray-400 dark:text-gray-500">Pure. Fresh. Yours.</p>
               </div>
            </motion.div>

            {/* Floating Fruits */}
            {fruits.map((fruit, idx) => (
                <motion.div
                    key={idx}
                    className={`absolute select-none drop-shadow-lg cursor-pointer hover:scale-110 transition-transform ${fruit.size} ${fruit.blur ? 'blur-[2px] opacity-60' : 'opacity-100'}`}
                    style={{
                        top: fruit.top,
                        bottom: fruit.bottom,
                        left: fruit.left,
                        right: fruit.right,
                        zIndex: fruit.z,
                        ...fruit.style
                    }}
                    animate={fruit.animate}
                    transition={fruit.animate ? {
                        repeat: Infinity,
                        duration: fruit.duration,
                        ease: "easeInOut"
                    } : undefined}
                >
                    {fruit.emoji}
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;