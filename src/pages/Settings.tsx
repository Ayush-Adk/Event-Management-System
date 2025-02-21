import React from 'react';
import { motion } from 'framer-motion';
import {
  User, Shield, Bell, Globe, Dumbbell, Trophy, CreditCard, 
  Smartphone, Heart, Lock, Users, Activity, HelpCircle,
  Settings as SettingsIcon, Medal, Share2, Zap, Crown,
  Watch, Bluetooth, MessageSquare, BarChart
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  fields: SettingField[];
}

interface SettingField {
  id: string;
  label: string;
  type: 'toggle' | 'select' | 'input' | 'color' | 'button';
  options?: string[];
  value?: any;
  placeholder?: string;
}

export function Settings() {
  const { darkMode, toggleDarkMode, user } = useStore();
  const [activeSection, setActiveSection] = React.useState('profile');
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState({
    // Profile & Account
    profileVisibility: 'public',
    autoShareAchievements: true,
    profileImage: '',
    bio: '',
    
    // Competition Preferences
    eventReminders: true,
    autoEnrollRecurring: false,
    preferredEventTypes: ['running', 'weightlifting'],
    difficultyLevel: 'intermediate',
    
    // Achievements & Rewards
    publicAchievements: true,
    milestoneAlerts: true,
    customBadgeStyle: 'minimal',
    goalNotifications: true,
    
    // Payments & Subscriptions
    defaultPaymentMethod: 'card',
    subscriptionTier: 'pro',
    autoRenew: true,
    receiveReceipts: true,
    
    // Device Integration
    syncFitbit: false,
    syncAppleHealth: true,
    syncGarmin: false,
    syncStrava: true,
    
    // Security
    twoFactorAuth: false,
    loginAlerts: true,
    dataSharing: 'minimal',
    locationTracking: false,
    
    // Event Organizer
    eventCreationAccess: true,
    analyticsDetail: 'advanced',
    participantLimit: '1000',
    autoApproveRegistrations: false,
    
    // Community
    showOnLeaderboard: true,
    allowFriendRequests: true,
    teamInvites: 'friends',
    activityFeed: 'public',
    
    // Support
    emailUpdates: true,
    supportLanguage: 'English',
    feedbackParticipation: true
  });

  const sections: SettingSection[] = [
    {
      id: 'profile',
      title: 'Profile & Account',
      icon: User,
      description: 'Manage your personal information and account preferences',
      fields: [
        { id: 'profileVisibility', label: 'Profile Visibility', type: 'select', options: ['public', 'friends', 'private'] },
        { id: 'autoShareAchievements', label: 'Auto-share Achievements', type: 'toggle' },
        { id: 'profileImage', label: 'Profile Image URL', type: 'input', placeholder: 'https://example.com/image.jpg' },
        { id: 'bio', label: 'Bio', type: 'input', placeholder: 'Tell us about yourself' }
      ]
    },
    {
      id: 'competition',
      title: 'Competition Preferences',
      icon: Trophy,
      description: 'Customize your competition and event preferences',
      fields: [
        { id: 'eventReminders', label: 'Event Reminders', type: 'toggle' },
        { id: 'autoEnrollRecurring', label: 'Auto-enroll in Recurring Events', type: 'toggle' },
        { id: 'preferredEventTypes', label: 'Preferred Event Types', type: 'select', options: ['running', 'weightlifting', 'crossfit', 'yoga', 'swimming'] },
        { id: 'difficultyLevel', label: 'Preferred Difficulty', type: 'select', options: ['beginner', 'intermediate', 'advanced', 'elite'] }
      ]
    },
    {
      id: 'achievements',
      title: 'Achievements & Rewards',
      icon: Medal,
      description: 'Manage your achievements and reward preferences',
      fields: [
        { id: 'publicAchievements', label: 'Public Achievements', type: 'toggle' },
        { id: 'milestoneAlerts', label: 'Milestone Alerts', type: 'toggle' },
        { id: 'customBadgeStyle', label: 'Badge Style', type: 'select', options: ['minimal', 'classic', 'animated', 'premium'] },
        { id: 'goalNotifications', label: 'Goal Notifications', type: 'toggle' }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Subscriptions',
      icon: CreditCard,
      description: 'Manage your payment methods and subscriptions',
      fields: [
        { id: 'defaultPaymentMethod', label: 'Default Payment Method', type: 'select', options: ['card', 'paypal', 'apple-pay', 'google-pay'] },
        { id: 'subscriptionTier', label: 'Subscription Tier', type: 'select', options: ['basic', 'pro', 'elite'] },
        { id: 'autoRenew', label: 'Auto-renew Subscription', type: 'toggle' },
        { id: 'receiveReceipts', label: 'Receive Receipts', type: 'toggle' }
      ]
    },
    {
      id: 'devices',
      title: 'Device & App Integration',
      icon: Watch,
      description: 'Connect your fitness devices and apps',
      fields: [
        { id: 'syncFitbit', label: 'Sync with Fitbit', type: 'toggle' },
        { id: 'syncAppleHealth', label: 'Sync with Apple Health', type: 'toggle' },
        { id: 'syncGarmin', label: 'Sync with Garmin', type: 'toggle' },
        { id: 'syncStrava', label: 'Sync with Strava', type: 'toggle' }
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      description: 'Manage your security and privacy settings',
      fields: [
        { id: 'twoFactorAuth', label: 'Two-factor Authentication', type: 'toggle' },
        { id: 'loginAlerts', label: 'Login Alerts', type: 'toggle' },
        { id: 'dataSharing', label: 'Data Sharing', type: 'select', options: ['minimal', 'standard', 'full'] },
        { id: 'locationTracking', label: 'Location Tracking', type: 'toggle' }
      ]
    },
    {
      id: 'organizer',
      title: 'Event Organizer Tools',
      icon: Crown,
      description: 'Configure event organization settings',
      fields: [
        { id: 'eventCreationAccess', label: 'Event Creation Access', type: 'toggle' },
        { id: 'analyticsDetail', label: 'Analytics Detail Level', type: 'select', options: ['basic', 'advanced', 'professional'] },
        { id: 'participantLimit', label: 'Default Participant Limit', type: 'input' },
        { id: 'autoApproveRegistrations', label: 'Auto-approve Registrations', type: 'toggle' }
      ]
    },
    {
      id: 'community',
      title: 'Community & Social',
      icon: Users,
      description: 'Manage your community and social preferences',
      fields: [
        { id: 'showOnLeaderboard', label: 'Show on Leaderboard', type: 'toggle' },
        { id: 'allowFriendRequests', label: 'Allow Friend Requests', type: 'toggle' },
        { id: 'teamInvites', label: 'Team Invites', type: 'select', options: ['all', 'friends', 'none'] },
        { id: 'activityFeed', label: 'Activity Feed Privacy', type: 'select', options: ['public', 'friends', 'private'] }
      ]
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: HelpCircle,
      description: 'Access help resources and support options',
      fields: [
        { id: 'emailUpdates', label: 'Email Updates', type: 'toggle' },
        { id: 'supportLanguage', label: 'Support Language', type: 'select', options: ['English', 'Spanish', 'French', 'German', 'Japanese'] },
        { id: 'feedbackParticipation', label: 'Participate in Feedback', type: 'toggle' }
      ]
    }
  ];

  const handleSettingChange = (id: string, value: any) => {
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          settings: settings,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'text-3xl font-bold',
          darkMode ? 'text-white' : 'text-gray-900'
        )}
      >
        Settings
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-1"
        >
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all',
                  activeSection === section.id
                    ? darkMode 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-white shadow-md text-blue-600'
                    : darkMode
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-white hover:shadow-md hover:text-blue-600'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{section.title}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          {sections.map((section) => (
            <div
              key={section.id}
              className={cn(
                'space-y-6',
                activeSection === section.id ? 'block' : 'hidden'
              )}
            >
              <div className={cn(
                'p-6 rounded-lg',
                darkMode ? 'bg-gray-800' : 'bg-white shadow-md'
              )}>
                <h2 className={cn(
                  'text-xl font-semibold mb-2',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {section.title}
                </h2>
                <p className={cn(
                  'text-sm mb-6',
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {section.description}
                </p>

                <div className="space-y-6">
                  {section.fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between">
                      <label className={cn(
                        'text-sm font-medium',
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        {field.label}
                      </label>
                      {field.type === 'toggle' ? (
                        <button
                          onClick={() => handleSettingChange(field.id, !settings[field.id as keyof typeof settings])}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            settings[field.id as keyof typeof settings]
                              ? 'bg-blue-600'
                              : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              settings[field.id as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                            )}
                          />
                        </button>
                      ) : field.type === 'select' ? (
                        <select
                          value={settings[field.id as keyof typeof settings]}
                          onChange={(e) => handleSettingChange(field.id, e.target.value)}
                          className={cn(
                            'rounded-lg border px-3 py-2',
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          )}
                        >
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={settings[field.id as keyof typeof settings]}
                          onChange={(e) => handleSettingChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className={cn(
                            'rounded-lg border px-3 py-2',
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={loading}
                className={cn(
                  'w-full py-3 px-4 rounded-lg font-medium text-white transition-colors',
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                )}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}