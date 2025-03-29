import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from '../components/Calendar';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export function CalendarView() {
  const { darkMode, events, selectedDate } = useStore();
  const selectedEvents = events.filter(
    (event) => event.date.startsWith(selectedDate.split('T')[0])
  );

  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'text-3xl font-bold',
          darkMode ? 'text-white' : 'text-gray-900'
        )}
      >
        Calendar
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Calendar />
        </div>

        <div>
          <div className={cn(
            'rounded-lg shadow-lg p-6',
            darkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <h2 className={cn(
              'text-xl font-semibold mb-4',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              Events for {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </h2>

            <div className="space-y-4">
              {selectedEvents.length > 0 ? (
                selectedEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'p-4 rounded-lg',
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className={cn(
                          'font-semibold',
                          darkMode ? 'text-white' : 'text-gray-900'
                        )}>
                          {event.title}
                        </h3>
                        <p className={cn(
                          'text-sm',
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {format(new Date(event.date), 'h:mm a')}
                        </p>
                        <p className={cn(
                          'text-sm mt-1',
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className={cn(
                  'text-center py-8',
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  No events scheduled for this day
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
