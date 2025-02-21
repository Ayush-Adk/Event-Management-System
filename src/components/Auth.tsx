import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Github, Facebook } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { darkMode, setUser } = useStore();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          if (signUpError.message === 'User already registered') {
            setError('This email is already registered. Please sign in instead.');
          } else {
            setError(signUpError.message);
          }
          return;
        }

        if (signUpData.user) {
          setUser({
            id: signUpData.user.id,
            email: signUpData.user.email!,
            name: email.split('@')[0],
            role: 'attendee'
          });
          navigate('/');
        }
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError('Invalid email or password');
          return;
        }

        if (signInData.user) {
          setUser({
            id: signInData.user.id,
            email: signInData.user.email!,
            name: email.split('@')[0],
            role: 'attendee'
          });
          navigate('/');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'github' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center px-4',
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'w-full max-w-md p-8 rounded-lg shadow-lg',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}
      >
        <h2 className={cn(
          'text-2xl font-bold text-center mb-8',
          darkMode ? 'text-white' : 'text-gray-900'
        )}>
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className={cn(
              'block text-sm font-medium mb-2',
              darkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Email
            </label>
            <div className="relative">
              <Mail className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
                darkMode ? 'text-gray-400' : 'text-gray-500'
              )} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                )}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className={cn(
              'block text-sm font-medium mb-2',
              darkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Password
            </label>
            <div className="relative">
              <Lock className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
                darkMode ? 'text-gray-400' : 'text-gray-500'
              )} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                )}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={cn(
              'w-full py-2 px-4 rounded-lg font-medium text-white transition-colors',
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            )}
            type="submit"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </motion.button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={cn(
                'w-full border-t',
                darkMode ? 'border-gray-700' : 'border-gray-300'
              )} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={cn(
                'px-2',
                darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
              )}>
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOAuth('github')}
              className={cn(
                'flex items-center justify-center px-4 py-2 rounded-lg border font-medium transition-colors',
                darkMode
                  ? 'border-gray-700 hover:bg-gray-700 text-white'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              )}
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOAuth('facebook')}
              className={cn(
                'flex items-center justify-center px-4 py-2 rounded-lg border font-medium transition-colors',
                darkMode
                  ? 'border-gray-700 hover:bg-gray-700 text-white'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              )}
            >
              <Facebook className="h-5 w-5 mr-2" />
              Facebook
            </motion.button>
          </div>
        </div>

        <p className={cn(
          'mt-8 text-center text-sm',
          darkMode ? 'text-gray-400' : 'text-gray-600'
        )}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}