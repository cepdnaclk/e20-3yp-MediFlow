import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCrossLogo = ({ isLogoAnimated, setIsLogoAnimated }) => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 3, bounce: 0, delay: i * 0.4, repeat: Infinity, repeatDelay: 5 },
        opacity: { duration: 1.2, delay: i * 0.4, repeat: Infinity, repeatDelay: 5 }
      }
    })
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="flex items-center"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.circle
          cx="16"
          cy="16"
          r="14"
          stroke="#4F46E5"
          strokeWidth="1"
          strokeOpacity="0.3"
          fill="transparent"
          animate={{
            r: [14, 16, 14],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.circle
          cx="16"
          cy="16"
          r="15"
          stroke="#4F46E5"
          strokeWidth="0.5"
          strokeOpacity="0.2"
          fill="transparent"
          animate={{
            r: [15, 18, 15],
            opacity: [0.2, 0, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.8
          }}
        />
        <motion.circle
          cx="16"
          cy="16"
          r="14"
          stroke="#4F46E5"
          strokeWidth="2"
          strokeLinecap="round"
          fill="white"
          variants={pathVariants}
          custom={0}
          initial="hidden"
          animate="visible"
        />
        <motion.line
          x1="9"
          y1="16"
          x2="23"
          y2="16"
          stroke="#4F46E5"
          strokeWidth="4"
          strokeLinecap="round"
          variants={pathVariants}
          custom={1}
          initial="hidden"
          animate="visible"
        />
        <motion.line
          x1="16"
          y1="9"
          x2="16"
          y2="23"
          stroke="#4F46E5"
          strokeWidth="4"
          strokeLinecap="round"
          variants={pathVariants}
          custom={2}
          initial="hidden"
          animate="visible"
        />
      </svg>
      <motion.span 
        className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      >
        MediFlow
      </motion.span>
    </motion.div>
  );
};

export default AnimatedCrossLogo;