import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Video } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
}

interface BreakoutRoom {
  id: string;
  name: string;
  capacity: number;
  stream_url: string;
  current_participants: number;
}

export function VirtualEventRoom({ eventId }: { eventId: string }) {
  const { darkMode, user } = useStore();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [breakoutRooms, setBreakoutRooms] = React.useState<BreakoutRoom[]>([]);
  const chatRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat:${eventId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `event_id=eq.${eventId}`,
      }, (payload) => {
        setMessages((current) => [...current, payload.new as Message]);
      })
      .subscribe();

    // Load existing messages
    loadMessages();
    loadBreakoutRooms();

    return () => {
      subscription.unsubscribe();
    };
  }, [eventId]);

  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const loadBreakoutRooms = async () => {
    const { data, error } = await supabase
      .from('breakout_rooms')
      .select('*')
      .eq('event_id', eventId);

    if (!error && data) {
      setBreakoutRooms(data);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        event_id: eventId,
        user_id: user.id,
        message: newMessage.trim(),
      });

    if (!error) {
      setNewMessage('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className={cn(
          'rounded-lg shadow-lg overflow-hidden',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <div className="aspect-video bg-black">
            {/* Video stream component would go here */}
            <div className="w-full h-full flex items-center justify-center text-white">
              <Video className="h-16 w-16" />
            </div>
          </div>
          <div className="p-4">
            <h2 className={cn(
              'text-xl font-semibold mb-4',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              Main Stage
            </h2>
            <div className="flex items-center space-x-4">
              <Users className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                250 Viewers
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {breakoutRooms.map((room) => (
            <motion.div
              key={room.id}
              whileHover={{ scale: 1.02 }}
              className={cn(
                'p-4 rounded-lg cursor-pointer',
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              )}
            >
              <h3 className={cn(
                'font-semibold mb-2',
                darkMode ? 'text-white' : 'text-gray-900'
              )}>
                {room.name}
              </h3>
              <div className="flex items-center justify-between text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {room.current_participants} / {room.capacity} participants
                </span>
                <button
                  className={cn(
                    'px-3 py-1 rounded-full text-sm',
                    darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                  )}
                >
                  Join Room
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={cn(
        'rounded-lg shadow-lg flex flex-col h-[600px]',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className={cn(
            'text-xl font-semibold flex items-center',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            <MessageSquare className="h-5 w-5 mr-2" />
            Live Chat
          </h2>
        </div>

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'p-3 rounded-lg',
                message.user_id === user?.id
                  ? darkMode ? 'bg-blue-600 ml-8' : 'bg-blue-100 ml-8'
                  : darkMode ? 'bg-gray-700 mr-8' : 'bg-gray-100 mr-8'
              )}
            >
              <p className={cn(
                'text-sm',
                message.user_id === user?.id
                  ? 'text-white'
                  : darkMode ? 'text-gray-200' : 'text-gray-900'
              )}>
                {message.message}
              </p>
              <span className={cn(
                'text-xs mt-1 block',
                message.user_id === user?.id
                  ? 'text-blue-200'
                  : darkMode ? 'text-gray-400' : 'text-gray-500'
              )}>
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className={cn(
                'flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none',
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              )}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
            >
              Send
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}