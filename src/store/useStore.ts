import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'organizer' | 'attendee';
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  image: string;
  category: string;
  price: number;
  capacity: number;
  attendees: string[];
  organizer: string;
  isVirtual: boolean;
  streamUrl?: string;
  tags: string[];
  status: 'draft' | 'published' | 'cancelled';
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

interface EventStore {
  user: User | null;
  events: Event[];
  notifications: Notification[];
  darkMode: boolean;
  selectedDate: string;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  setUser: (user: User | null) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  toggleDarkMode: () => void;
  setSelectedDate: (date: string) => void;
}

export const useStore = create<EventStore>()(
  persist(
    (set) => ({
      user: null,
      events: [],
      notifications: [],
      darkMode: false,
      selectedDate: new Date().toISOString(),
      addEvent: (event) => set((state) => ({ 
        events: [...state.events, event],
        notifications: [
          ...state.notifications,
          {
            id: crypto.randomUUID(),
            userId: state.user?.id || '',
            title: 'New Event Created',
            message: `Event "${event.title}" has been created successfully.`,
            type: 'success',
            read: false,
            createdAt: new Date().toISOString(),
          },
        ],
      })),
      updateEvent: (id, event) => set((state) => ({
        events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter((e) => e.id !== id),
      })),
      setUser: (user) => set({ user }),
      addNotification: (notification) => set((state) => ({
        notifications: [
          ...state.notifications,
          {
            ...notification,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
        ],
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setSelectedDate: (date) => set({ selectedDate: date }),
    }),
    {
      name: 'event-storage',
    }
  )
);