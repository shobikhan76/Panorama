import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = () => {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 0 }}
      exit={{ scaleY: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 bg-blue-600 z-[99999] origin-bottom pointer-events-none"
    >
      <motion.div
        className="flex h-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-900"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut', delay: i * 0.08 }}
            style={{ transformOrigin: 'bottom' }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PageTransition;