import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Users, TrendingUp, Bell, BarChart2, Clock,
  DollarSign, Star, Activity, ArrowRight, TrendingDown,
  Award, ChevronUp, ChevronDown, Target, Zap
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, isFuture, isPast } from 'date-fns';
import { cn } from '../lib/utils';

export function Dashboard() {
  const { darkMode, events, user } = useStore();
  const [selectedMetric, setSelectedMetric] = React.useState('all');
  const [showTutorial, setShowTutorial] = React.useState(true);

  const upcomingEvents = events.filter((e) => isFuture(new Date(e.date)));
  const pastEvents = events.filter((e) => isPast(new Date(e.date)));
  const totalRevenue = events.reduce((sum, event) => sum + event.price, 0);
  const averageAttendees =
    events.length > 0
      ? events.reduce((sum, event) => sum + event.attendees.length, 0) / events.length
      : 0;

  const stats = [
    {
      id: 'all',
      label: 'Total Events',
      value: events.length,
      icon: Calendar,
      trend: '+12%',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      id: 'upcoming',
      label: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: TrendingUp,
      trend: '+5%',
      color: 'green',
      gradient: 'from-green-500 to-green-700',
    },
    {
      id: 'attendees',
      label: 'Total Attendees',
      value: '1.2k',
      icon: Users,
      trend: '+18%',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-700',
    },
    {
      id: 'revenue',
      label: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: '+25%',
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-700',
    },
  ];

  const analyticsData = [
    {
      title: 'Event Performance',
      metrics: [
        { label: 'Average Rating', value: '4.8', trend: '+0.3', isPositive: true },
        { label: 'Completion Rate', value: '94%', trend: '+2%', isPositive: true },
        { label: 'No-show Rate', value: '5%', trend: '-1%', isPositive: true },
      ],
    },
    {
      title: 'Attendee Insights',
      metrics: [
        { label: 'Return Rate', value: '68%', trend: '+5%', isPositive: true },
        { label: 'Avg. Session Time', value: '45m', trend: '+10m', isPositive: true },
        { label: 'Engagement Score', value: '8.5', trend: '+0.5', isPositive: true },
      ],
    },
    {
      title: 'Revenue Analytics',
      metrics: [
        { label: 'Avg. Ticket Price', value: '$75', trend: '+$5', isPositive: true },
        { label: 'Revenue/Attendee', value: '$95', trend: '+$8', isPositive: true },
        { label: 'Refund Rate', value: '2%', trend: '-0.5%', isPositive: true },
      ],
    },
  ];

  const topPerformers = [
    {
      title: 'Most Popular Event',
      value: 'Tech Conference 2025',
      metric: '2,500 attendees',
      trend: '+15%',
      isPositive: true,
      icon: Users,
    },
    {
      title: 'Highest Revenue',
      value: 'Leadership Summit',
      metric: '$125,000',
      trend: '+30%',
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: 'Best Rated',
      value: 'AI Workshop Series',
      metric: '4.9/5.0',
      trend: '+0.3',
      isPositive: true,
      icon: Star,
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'p-6 rounded-xl border-l-4 border-blue-500 shadow-lg',
            darkMode ? 'bg-gray-900 bg-opacity-80 backdrop-blur-md' : 'bg-white'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Zap className="h-6 w-6 text-blue-500 animate-pulse" />
              <div>
                <h3 className={cn('text-lg font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
                  Welcome to Your Analytics Dashboard
                </h3>
                <p className={cn('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                  Track your event performance with real-time insights
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTutorial(false)}
              className={cn(
                'text-sm font-medium px-4 py-2 rounded-full transition-colors',
                darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              )}
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('text-4xl font-extrabold', darkMode ? 'text-white' : 'text-gray-900')}
        >
          Dashboard
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500',
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            )}
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
            <option value="day">Today</option>
          </select>
          <button
            className={cn(
              'px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition-all',
              darkMode
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900'
                : 'bg-gradient-to-r from-blue-100 to-blue-300 text-blue-600 hover:from-blue-200 hover:to-blue-400'
            )}
          >
            Export Report
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className={cn(
                'p-6 rounded-xl cursor-pointer shadow-lg bg-gradient-to-br',
                darkMode
                  ? `bg-gray-900 bg-opacity-80 backdrop-blur-md ${stat.gradient}`
                  : `${stat.gradient} bg-opacity-10`,
                'border border-gray-200 dark:border-gray-700'
              )}
              onClick={() => setSelectedMetric(stat.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-sm font-medium text-white opacity-80')}>
                    {stat.label}
                  </p>
                  <p className={cn('mt-2 text-3xl font-bold text-white')}>{stat.value}</p>
                  <div className="mt-2 flex items-center">
                    <span className={`text-sm font-medium text-white`}>{stat.trend}</span>
                    <Activity className={`h-4 w-4 ml-1 text-white`} />
                  </div>
                </div>
                <Icon className={`h-10 w-10 text-white opacity-80`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {analyticsData.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'p-6 rounded-xl shadow-xl border',
              darkMode
                ? 'bg-gray-900 bg-opacity-80 backdrop-blur-md border-gray-700'
                : 'bg-white border-gray-100'
            )}
          >
            <h2 className={cn('text-xl font-bold mb-4', darkMode ? 'text-white' : 'text-gray-900')}>
              {section.title}
            </h2>
            <div className="space-y-6">
              {section.metrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <span className={cn('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                    {metric.label}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                      {metric.value}
                    </span>
                    <div
                      className={cn(
                        'flex items-center text-sm px-2 py-1 rounded-full',
                        metric.isPositive
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                      )}
                    >
                      {metric.isPositive ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span>{metric.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {topPerformers.map((performer, index) => {
          const Icon = performer.icon;
          return (
            <motion.div
              key={performer.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className={cn(
                'p-6 rounded-xl shadow-xl border relative overflow-hidden',
                darkMode
                  ? 'bg-gray-900 bg-opacity-80 backdrop-blur-md border-gray-700'
                  : 'bg-white border-gray-100'
              )}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-transparent opacity-20 rounded-bl-full" />
              <h3 className={cn('text-sm font-medium', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                {performer.title}
              </h3>
              <p className={cn('mt-2 text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
                {performer.value}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className={cn('h-5 w-5', darkMode ? 'text-gray-400' : 'text-gray-600')} />
                  <span className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                    {performer.metric}
                  </span>
                </div>
                <div
                  className={cn(
                    'flex items-center text-sm',
                    performer.isPositive ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {performer.isPositive ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span>{performer.trend}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div
        className={cn(
          'p-6 rounded-xl shadow-xl border',
          darkMode
            ? 'bg-gray-900 bg-opacity-80 backdrop-blur-md border-gray-700'
            : 'bg-white border-gray-100'
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
            Recent Events
          </h2>
          <button
            className={cn(
              'text-sm font-semibold flex items-center transition-colors',
              darkMode
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-700'
            )}
          >
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>

        <div className="space-y-4">
          {events.slice(0, 5).map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                'p-4 rounded-lg transition-all shadow-md border',
                darkMode
                  ? 'bg-gray-800 bg-opacity-80 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
              )}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-16 w-16 rounded-lg object-cover shadow-sm"
                />
                <div className="flex-1">
                  <h3 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                    {event.title}
                  </h3>
                  <div className="mt-1 flex items-center space-x-4">
                    <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                      {format(new Date(event.date), 'MMM d, yyyy')}
                    </p>
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        isFuture(new Date(event.date))
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      )}
                    >
                      {isFuture(new Date(event.date)) ? 'Upcoming' : 'Past'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                    {event.attendees.length} attendees
                  </p>
                  <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                    ${event.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
