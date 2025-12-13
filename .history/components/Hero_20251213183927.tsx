import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from './Button';
import { SectionId } from '../types';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

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
            {/* The "Bowl" Circle */}
            <motion.div 
              className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-white dark:bg-neutral-800 rounded-full shadow-2xl shadow-orange-500/10 flex items-center justify-center relative z-10 border border-orange-50 dark:border-neutral-700 transition-colors duration-300"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
               <div className="text-center p-8">
                  <span className="text-9xl block mb-2">🥗</span>
                  <p className="font-serif italic text-gray-400 dark:text-gray-500">Pure. Fresh. Yours.</p>
               </div>
            </motion.div>

            {/* Floating Elements (Simulating Fruits) */}
            <motion.div style={{ y: y1 }} className="absolute top-10 right-10 z-20 text-6xl drop-shadow-lg">
              🍓
            </motion.div>
            <motion.div style={{ y: y2 }} className="absolute bottom-20 left-10 z-20 text-7xl drop-shadow-lg">
              🥑
            </motion.div>
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-1/2 -right-4 z-0 text-8xl opacity-80 blur-[1px]"
            >
              🍊
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;