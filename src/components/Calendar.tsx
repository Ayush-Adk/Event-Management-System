import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export function Calendar() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const { darkMode, events, selectedDate, setSelectedDate } = useStore();

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getDayEvents = (date: Date) => {
    return events.filter((event) =>
      isSameDay(new Date(event.date), date)
    );
  };

  return (
    <div className={cn(
      'rounded-lg shadow-lg p-6',
      darkMode ? 'bg-gray-800' : 'bg-white'
    )}>
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={previousMonth}
          className={cn(
            'p-2 rounded-full',
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          )}
        >
          <ChevronLeft className={darkMode ? 'text-white' : 'text-gray-600'} />
        </motion.button>
        <h2 className={cn(
          'text-xl font-semibold',
          darkMode ? 'text-white' : 'text-gray-900'
        )}>
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          className={cn(
            'p-2 rounded-full',
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          )}
        >
          <ChevronRight className={darkMode ? 'text-white' : 'text-gray-600'} />
        </motion.button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className={cn(
              'text-center text-sm font-medium py-2',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayEvents = getDayEvents(day);
          const isSelected = isSameDay(new Date(selectedDate), day);
          
          return (
            <motion.button
              key={day.toISOString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(day.toISOString())}
              className={cn(
                'aspect-square p-2 rounded-lg relative',
                isSelected && (darkMode ? 'bg-blue-600' : 'bg-blue-100'),
                !isSelected && (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'),
                !isSameMonth(day, currentMonth) && 'opacity-50'
              )}
            >
              <span className={cn(
                'text-sm',
                isToday(day) && 'font-bold',
                darkMode ? 'text-white' : 'text-gray-900'
              )}>
                {format(day, 'd')}
              </span>
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-blue-500"
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}