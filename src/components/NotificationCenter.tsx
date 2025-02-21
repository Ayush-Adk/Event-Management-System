import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { darkMode, notifications, markNotificationAsRead } = useStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-2 rounded-full relative',
          darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
        )}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={cn(
              'absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50 overflow-hidden',
              darkMode ? 'bg-gray-800' : 'bg-white'
            )}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className={cn(
                  'text-lg font-semibold',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  Notifications
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'p-1 rounded-full',
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={cn(
                      'p-4 border-b last:border-b-0 cursor-pointer transition-colors',
                      !notification.read && (darkMode ? 'bg-gray-700' : 'bg-blue-50'),
                      darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                    )}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={cn(
                          'font-medium',
                          darkMode ? 'text-white' : 'text-gray-900'
                        )}>
                          {notification.title}
                        </p>
                        <p className={cn(
                          'text-sm mt-1',
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {notification.message}
                        </p>
                        <p className={cn(
                          'text-xs mt-2',
                          darkMode ? 'text-gray-500' : 'text-gray-400'
                        )}>
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={cn(
                  'p-4 text-center',
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  No notifications
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}