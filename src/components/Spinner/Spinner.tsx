"use client"
import React from 'react'
import { motion } from 'framer-motion'

const Spinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-primary rounded-full"
            animate={{
              y: [-10, 0, -10],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default Spinner;