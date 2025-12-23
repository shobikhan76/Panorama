import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
          e.target.closest('.interactive-element')) {
        setCursorVariant('hover');
      } else if (e.target.closest('.text-element')) {
        setCursorVariant('text');
      }
    };

    const handleMouseLeave = () => {
      setCursorVariant('default');
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const variants = {
    default: {
      width: 40,
      height: 40,
      border: '2px solid #60A5FA',
      backgroundColor: 'transparent',
      mixBlendMode: 'difference'
    },
    hover: {
      width: 60,
      height: 60,
      backgroundColor: 'rgba(96, 165, 250, 0.1)',
      border: '2px solid #93C5FD',
      mixBlendMode: 'difference'
    },
    text: {
      width: 100,
      height: 100,
      backgroundColor: 'rgba(96, 165, 250, 0.1)',
      border: '2px solid transparent',
      mixBlendMode: 'difference'
    }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full"
        animate={variants[cursorVariant]}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full bg-blue-400"
        style={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          width: 8,
          height: 8,
        }}
      />
    </>
  );
};

export default CustomCursor;