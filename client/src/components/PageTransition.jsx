import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
  },
  enter: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    transition: {
      duration: 0.7,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
          willChange: 'clip-path',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
