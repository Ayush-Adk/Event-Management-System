import React from 'react';
import { motion } from 'framer-motion';
import {
  User, Shield, Trophy, CreditCard, Watch, Medal, Crown, Users, HelpCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

// Define interfaces
interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  fields: SettingField[];
}

interface SettingField {
  id: keyof SettingsState;
  label: string;
  type: 'toggle' | 'select' | 'input' | 'multi-select';
  options?: string[];
  placeholder?: string;
}

interface SettingsState {
  profileVisibility: string;
  autoShareAchievements: boolean;
  profileImage: string;
  bio: string;
  eventReminders: boolean;
  autoEnrollRecurring: boolean;
  preferredEventTypes: string[];
  difficultyLevel: string;
  publicAchievements: boolean;
  milestoneAlerts: boolean;
  customBadgeStyle: string;
  goalNotifications: boolean;
  defaultPaymentMethod: string;
  subscriptionTier: string;
  autoRenew: boolean;
  receiveReceipts: boolean;
  syncFitbit: boolean;
  syncAppleHealth: boolean;
  syncGarmin: boolean;
  syncStrava: boolean;
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  dataSharing: string;
  locationTracking: boolean;
  eventCreationAccess: boolean;
  analyticsDetail: string;
  participantLimit: string;
  autoApproveRegistrations: boolean;
  showOnLeaderboard: boolean;
  allowFriendRequests: boolean;
  teamInvites: string;
  activityFeed: string;
  emailUpdates: boolean;
  supportLanguage: string;
  feedbackParticipation: boolean;
}

interface StoreState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: { id: string } | null;
}

export function Settings() {
  const { darkMode, toggleDarkMode, user } = useStore() as StoreState;
  const [activeSection, setActiveSection] = React.useState('profile');
  const [loading, setLoading] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [settings, setSettings] = React.useState<SettingsState>({
    profileVisibility: 'public',
    autoShareAchievements: true,
    profileImage: '',
    bio: '',
    eventReminders: true,
    autoEnrollRecurring: false,
    preferredEventTypes: ['running'],
    difficultyLevel: 'intermediate',
    publicAchievements: true,
    milestoneAlerts: true,
    customBadgeStyle: 'minimal',
    goalNotifications: true,
    defaultPaymentMethod: 'card',
    subscriptionTier: 'pro',
    autoRenew: true,
    receiveReceipts: true,
    syncFitbit: false,
    syncAppleHealth: true,
    syncGarmin: false,
    syncStrava: true,
    twoFactorAuth: false,
    loginAlerts: true,
    dataSharing: 'minimal',
    locationTracking: false,
    eventCreationAccess: true,
    analyticsDetail: 'advanced',
    participantLimit: '1000',
    autoApproveRegistrations: false,
    showOnLeaderboard: true,
    allowFriendRequests: true,
    teamInvites: 'friends',
    activityFeed: 'public',
    emailUpdates: true,
    supportLanguage: 'English',
    feedbackParticipation: true,
  });

  // Load settings from Supabase on mount
  React.useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('settings')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows found
        if (data?.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setSaveStatus('error');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user?.id]);

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
        { id: 'bio', label: 'Bio', type: 'input', placeholder: 'Tell us about yourself' },
      ],
    },
    {
      id: 'competition',
      title: 'Competition Preferences',
      icon: Trophy,
      description: 'Customize your competition and event preferences',
      fields: [
        { id: 'eventReminders', label: 'Event Reminders', type: 'toggle' },
        { id: 'autoEnrollRecurring', label: 'Auto-enroll in Recurring Events', type: 'toggle' },
        { id: 'preferredEventTypes', label: 'Preferred Event Types', type: 'multi-select', options: ['running', 'weightlifting', 'crossfit', 'yoga', 'swimming'] },
        { id: 'difficultyLevel', label: 'Preferred Difficulty', type: 'select', options: ['beginner', 'intermediate', 'advanced', 'elite'] },
      ],
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
        { id: 'goalNotifications', label: 'Goal Notifications', type: 'toggle' },
      ],
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
        { id: 'receiveReceipts', label: 'Receive Receipts', type: 'toggle' },
      ],
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
        { id: 'syncStrava', label: 'Sync with Strava', type: 'toggle' },
      ],
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
        { id: 'locationTracking', label: 'Location Tracking', type: 'toggle' },
      ],
    },
    {
      id: 'organizer',
      title: 'Event Organizer Tools',
      icon: Crown,
      description: 'Configure event organization settings',
      fields: [
        { id: 'eventCreationAccess', label: 'Event Creation Access', type: 'toggle' },
        { id: 'analyticsDetail', label: 'Analytics Detail Level', type: 'select', options: ['basic', 'advanced', 'professional'] },
        { id: 'participantLimit', label: 'Default Participant Limit', type: 'input', placeholder: 'Enter number' },
        { id: 'autoApproveRegistrations', label: 'Auto-approve Registrations', type: 'toggle' },
      ],
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
        { id: 'activityFeed', label: 'Activity Feed Privacy', type: 'select', options: ['public', 'friends', 'private'] },
      ],
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: HelpCircle,
      description: 'Access help resources and support options',
      fields: [
        { id: 'emailUpdates', label: 'Email Updates', type: 'toggle' },
        { id: 'supportLanguage', label: 'Support Language', type: 'select', options: ['English', 'Spanish', 'French', 'German', 'Japanese'] },
        { id: 'feedbackParticipation', label: 'Participate in Feedback', type: 'toggle' },
      ],
    },
  ];

  const handleSettingChange = (id: keyof SettingsState, value: string | boolean | string[]) => {
    setSettings((prev) => ({
      ...prev,
      [id]: value,
    }));
    setHasChanges(true);
    setSaveStatus('idle'); // Reset save status when changes are made
  };

  const handleSave = async () => {
    if (!user?.id) {
      setSaveStatus('error');
      console.log('Please login to save settings');
      return;
    }

    setLoading(true);
    setSaveStatus('idle');
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: user.id,
            settings,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;

      setHasChanges(false);
      setSaveStatus('success');
      console.log('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
      // Reset save status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const renderField = (field: SettingField) => {
    const value = settings[field.id];

    switch (field.type) {
      case 'toggle':
        return (
          <button
            onClick={() => handleSettingChange(field.id, !value)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              value ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                value ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        );

      case 'select':
        return (
          <select
            value={value as string}
            onChange={(e) => handleSettingChange(field.id, e.target.value)}
            className={cn(
              'rounded-lg border px-3 py-2 w-48',
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            )}
          >
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        );

      case 'multi-select':
        return (
          <div className="flex flex-wrap gap-2">
            {field.options?.map((option) => (
              <button
                key={option}
                onClick={() => {
                  const currentValues = (value as string[]) || [];
                  const newValues = currentValues.includes(option)
                    ? currentValues.filter((v) => v !== option)
                    : [...currentValues, option];
                  handleSettingChange(field.id, newValues);
                }}
                className={cn(
                  'px-3 py-1 rounded-full text-sm',
                  (value as string[])?.includes(option)
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-700'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'input':
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) => handleSettingChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={cn(
              'rounded-lg border px-3 py-2 w-64',
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('text-3xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}
        >
          Settings
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleDarkMode}
          className={cn(
            'px-4 py-2 rounded-lg',
            darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
          )}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-2 sticky top-8 self-start"
        >
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left',
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
          className="lg:col-span-3 space-y-6"
        >
          {sections.map((section) => (
            <div
              key={section.id}
              className={cn(activeSection === section.id ? 'block' : 'hidden')}
            >
              <div
                className={cn(
                  'p-6 rounded-lg',
                  darkMode ? 'bg-gray-800' : 'bg-white shadow-md'
                )}
              >
                <h2
                  className={cn(
                    'text-xl font-semibold mb-2',
                    darkMode ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {section.title}
                </h2>
                <p
                  className={cn(
                    'text-sm mb-6',
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  )}
                >
                  {section.description}
                </p>

                <div className="space-y-6">
                  {section.fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between gap-4">
                      <label
                        className={cn(
                          'text-sm font-medium flex-1',
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        )}
                      >
                        {field.label}
                      </label>
                      <div className="flex-shrink-0">{renderField(field)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={loading || !hasChanges}
                  className={cn(
                    'w-full py-3 px-4 rounded-lg font-medium text-white transition-colors',
                    loading || !hasChanges
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  )}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
                {saveStatus === 'success' && (
                  <span className="ml-4 text-green-500">Saved successfully!</span>
                )}
                {saveStatus === 'error' && (
                  <span className="ml-4 text-red-500">Failed to save</span>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
