import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const Cursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  
  // Motion values for tracking mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for the spotlight (smoother, slightly slower/heavier than the dot)
  const springConfig = { damping: 30, stiffness: 200, mass: 0.8 };
  const lightX = useSpring(mouseX, springConfig);
  const lightY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable custom cursor on devices with a fine pointer (mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    
    if (!mediaQuery.matches) {
        setIsVisible(false);
        return;
    }

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setOpacity(1); 
    };

    const handleMouseLeave = () => setOpacity(0);
    const handleMouseEnter = () => setOpacity(1);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Add global class to hide default cursor
    document.documentElement.classList.add('custom-cursor-enabled');

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.classList.remove('custom-cursor-enabled');
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        .custom-cursor-enabled, .custom-cursor-enabled * {
          cursor: none !important;
        }
      `}</style>

      {/* The Freshness Spotlight Glow */}
      <motion.div 
        className="fixed top-0 left-0 pointer-events-none z-[9990]"
        style={{ 
          x: lightX, 
          y: lightY, 
          translateX: '-50%', 
          translateY: '-50%',
          opacity: opacity
        }}
      >
        <div 
            className="w-[400px] h-[400px] rounded-full blur-3xl transition-colors duration-300"
            style={{
                // Using a radial gradient to simulate the spotlight/lantern effect
                // Brand Orange: #FF8C42 -> rgb(255, 140, 66)
                background: 'radial-gradient(circle, rgba(255, 140, 66, 0.25) 0%, rgba(255, 140, 66, 0.05) 50%, transparent 70%)'
            }}
        />
      </motion.div>

      {/* Precision Dot (The Seed) */}
      <motion.div 
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-brand-orange border border-white/50 rounded-full pointer-events-none z-[9999] shadow-sm"
        style={{ 
          x: mouseX, 
          y: mouseY, 
          translateX: '-50%', 
          translateY: '-50%',
          opacity: opacity
        }}
      />
    </>
  );
};

export default Cursor;