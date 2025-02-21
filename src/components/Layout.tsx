import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useStore } from '../store/useStore';

export function Layout() {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navigation />
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="container mx-auto px-4 py-8"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}