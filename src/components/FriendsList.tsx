import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Users, Search, Check, X, Mail, 
  MessageSquare, Share2, UserMinus, Settings,
  Bell, Shield, Filter
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export function FriendsList() {
  const { darkMode, user } = useStore();
  const [friends, setFriends] = React.useState<any[]>([]);
  const [friendRequests, setFriendRequests] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'friends' | 'requests' | 'suggestions'>('friends');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'online' | 'offline'>('all');

  React.useEffect(() => {
    if (user) {
      loadFriends();
      loadFriendRequests();
    }
  }, [user]);

  const loadFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          friend_id,
          profiles!friendships_friend_id_fkey (
            id,
            full_name,
            avatar_url,
            last_seen
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'accepted');

      if (error) throw error;
      setFriends(data || []);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const loadFriendRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          user_id,
          profiles!friendships_user_id_fkey (
            id,
            full_name,
            avatar_url,
            last_seen
          )
        `)
        .eq('friend_id', user?.id)
        .eq('status', 'pending');

      if (error) throw error;
      setFriendRequests(data || []);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, last_seen')
        .ilike('full_name', `%${searchQuery}%`)
        .neq('id', user?.id)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user?.id,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) throw error;
      setSearchResults(prev => prev.filter(user => user.id !== friendId));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleFriendRequest = async (userId: string, accept: boolean) => {
    try {
      if (accept) {
        await supabase
          .from('friendships')
          .update({ status: 'accepted' })
          .eq('user_id', userId)
          .eq('friend_id', user?.id);

        await supabase
          .from('friendships')
          .insert({
            user_id: user?.id,
            friend_id: userId,
            status: 'accepted'
          });
      } else {
        await supabase
          .from('friendships')
          .delete()
          .eq('user_id', userId)
          .eq('friend_id', user?.id);
      }

      await loadFriendRequests();
      await loadFriends();
    } catch (error) {
      console.error('Error handling friend request:', error);
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      await supabase
        .from('friendships')
        .delete()
        .or(`user_id.eq.${user?.id},friend_id.eq.${user?.id}`)
        .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`);

      await loadFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const isOnline = (lastSeen: string) => {
    const lastSeenDate = new Date(lastSeen);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastSeenDate > fiveMinutesAgo;
  };

  const filteredFriends = friends.filter(friend => {
    if (filterStatus === 'all') return true;
    const online = isOnline(friend.profiles.last_seen);
    return filterStatus === 'online' ? online : !online;
  });

  const tabs = [
    { id: 'friends', label: 'Friends', icon: Users, count: friends.length },
    { id: 'requests', label: 'Requests', icon: Mail, count: friendRequests.length },
    { id: 'suggestions', label: 'Suggestions', icon: UserPlus, count: null },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className={cn(
        'p-6 rounded-lg shadow-lg',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={cn(
            'text-2xl font-bold flex items-center',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            <Users className="h-7 w-7 mr-3" />
            My Network
          </h2>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'p-2 rounded-lg',
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              )}
            >
              <Settings className={cn(
                'h-5 w-5',
                darkMode ? 'text-gray-400' : 'text-gray-600'
              )} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'p-2 rounded-lg',
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              )}
            >
              <Bell className={cn(
                'h-5 w-5',
                darkMode ? 'text-gray-400' : 'text-gray-600'
              )} />
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
            darkMode ? 'text-gray-400' : 'text-gray-500'
          )} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for friends by name..."
            className={cn(
              'w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            )}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            disabled={loading}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-md text-sm font-medium text-white',
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            )}
          >
            {loading ? 'Searching...' : 'Search'}
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors',
              activeTab === tab.id
                ? darkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-600'
                : darkMode
                  ? 'text-gray-400 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={cn(
                'px-2 py-0.5 rounded-full text-sm',
                activeTab === tab.id
                  ? darkMode
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-200 text-blue-600'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-600'
              )}>
                {tab.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Filter */}
      {activeTab === 'friends' && (
        <div className="flex items-center space-x-2">
          <Filter className={cn(
            'h-5 w-5',
            darkMode ? 'text-gray-400' : 'text-gray-600'
          )} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm font-medium',
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            )}
          >
            <option value="all">All Friends</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      )}

      {/* Content */}
      <div className={cn(
        'p-6 rounded-lg shadow-lg min-h-[400px]',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <AnimatePresence mode="wait">
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredFriends.map((friend) => (
                <motion.div
                  key={friend.friend_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    'p-4 rounded-lg border transition-colors',
                    darkMode
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                          {friend.profiles.avatar_url ? (
                            <img
                              src={friend.profiles.avatar_url}
                              alt={friend.profiles.full_name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-lg font-medium">
                              {friend.profiles.full_name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className={cn(
                          'absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2',
                          darkMode ? 'border-gray-700' : 'border-white',
                          isOnline(friend.profiles.last_seen)
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                        )} />
                      </div>
                      <div>
                        <h3 className={cn(
                          'font-medium',
                          darkMode ? 'text-white' : 'text-gray-900'
                        )}>
                          {friend.profiles.full_name}
                        </h3>
                        <p className={cn(
                          'text-sm',
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {isOnline(friend.profiles.last_seen)
                            ? 'Online'
                            : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'p-2 rounded-lg transition-colors',
                          darkMode
                            ? 'hover:bg-gray-600 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600'
                        )}
                      >
                        <MessageSquare className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'p-2 rounded-lg transition-colors',
                          darkMode
                            ? 'hover:bg-gray-600 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600'
                        )}
                      >
                        <Share2 className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeFriend(friend.friend_id)}
                        className={cn(
                          'p-2 rounded-lg transition-colors',
                          darkMode
                            ? 'hover:bg-red-500 text-gray-300 hover:text-white'
                            : 'hover:bg-red-100 text-gray-600 hover:text-red-600'
                        )}
                      >
                        <UserMinus className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredFriends.length === 0 && (
                <div className="col-span-2 text-center py-12">
                  <Users className={cn(
                    'h-12 w-12 mx-auto mb-4',
                    darkMode ? 'text-gray-600' : 'text-gray-400'
                  )} />
                  <p className={cn(
                    'text-lg font-medium',
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    No friends found
                  </p>
                  <p className={cn(
                    'text-sm mt-1',
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  )}>
                    Try searching for people you know
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {friendRequests.map((request) => (
                <motion.div
                  key={request.user_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    'p-4 rounded-lg border transition-colors',
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                        {request.profiles.avatar_url ? (
                          <img
                            src={request.profiles.avatar_url}
                            alt={request.profiles.full_name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-lg font-medium">
                            {request.profiles.full_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className={cn(
                          'font-medium',
                          darkMode ? 'text-white' : 'text-gray-900'
                        )}>
                          {request.profiles.full_name}
                        </h3>
                        <p className={cn(
                          'text-sm',
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          Wants to be your friend
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleFriendRequest(request.user_id, true)}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                      >
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleFriendRequest(request.user_id, false)}
                        className={cn(
                          'px-4 py-2 rounded-lg font-medium',
                          darkMode
                            ? 'bg-gray-600 text-white hover:bg-gray-500'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        Decline
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {friendRequests.length === 0 && (
                <div className="text-center py-12">
                  <Mail className={cn(
                    'h-12 w-12 mx-auto mb-4',
                    darkMode ? 'text-gray-600' : 'text-gray-400'
                  )} />
                  <p className={cn(
                    'text-lg font-medium',
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    No friend requests
                  </p>
                  <p className={cn(
                    'text-sm mt-1',
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  )}>
                    When someone sends you a friend request, it will appear here
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'suggestions' && searchResults.length > 0 && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {searchResults.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    'p-4 rounded-lg border transition-colors',
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                        {result.avatar_url ? (
                          <img
                            src={result.avatar_url}
                            alt={result.full_name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-lg font-medium">
                            {result.full_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className={cn(
                          'font-medium',
                          darkMode ? 'text-white' : 'text-gray-900'
                        )}>
                          {result.full_name}
                        </h3>
                        <p className={cn(
                          'text-sm',
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {isOnline(result.last_seen) ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendFriendRequest(result.id)}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                    >
                      Add Friend
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'suggestions' && searchResults.length === 0 && (
            <div className="text-center py-12">
              <UserPlus className={cn(
                'h-12 w-12 mx-auto mb-4',
                darkMode ? 'text-gray-600' : 'text-gray-400'
              )} />
              <p className={cn(
                'text-lg font-medium',
                darkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                Search for new friends
              </p>
              <p className={cn(
                'text-sm mt-1',
                darkMode ? 'text-gray-500' : 'text-gray-500'
              )}>
                Use the search bar above to find people
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}