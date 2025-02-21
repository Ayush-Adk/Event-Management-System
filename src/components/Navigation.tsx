import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Home, Settings, Sun, Moon, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { NotificationCenter } from './NotificationCenter';
import { cn } from '../lib/utils';

export function Navigation() {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useStore();

  const links = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/create', icon: PlusCircle, label: 'Create Event' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className={cn(
      'fixed bottom-0 w-full border-t md:top-0 md:bottom-auto',
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'relative flex flex-col items-center justify-center px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === to
                    ? darkMode ? 'text-white' : 'text-blue-600'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-blue-600'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="mt-1">{label}</span>
                {location.pathname === to && (
                  <motion.div
                    layoutId="navigation-underline"
                    className="absolute bottom-0 h-0.5 w-full bg-blue-600"
                  />
                )}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <NotificationCenter />
            <button
              onClick={toggleDarkMode}
              className={cn(
                'p-2 rounded-full',
                darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}