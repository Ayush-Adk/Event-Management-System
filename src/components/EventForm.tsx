import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Tag, DollarSign, Users, Video, Image as ImageIcon, Check, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import { useNavigate } from 'react-router-dom';

interface EventFormProps {
  editMode?: boolean;
  eventId?: string;
}

export function EventForm({ editMode, eventId }: EventFormProps) {
  const { darkMode, addEvent, updateEvent, events } = useStore();
  const [loading, setLoading] = React.useState(false);
  const [showQR, setShowQR] = React.useState(false);
  const [createdEventId, setCreatedEventId] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    image: '',
    category: '',
    price: 0,
    capacity: 0,
    isVirtual: false,
    streamUrl: '',
    tags: [] as string[],
  });

  React.useEffect(() => {
    if (editMode && eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setFormData({
          title: event.title,
          description: event.description,
          date: event.date,
          endDate: event.endDate,
          location: event.location,
          image: event.image,
          category: event.category,
          price: event.price,
          capacity: event.capacity,
          isVirtual: event.isVirtual,
          streamUrl: event.streamUrl || '',
          tags: event.tags,
        });
      }
    }
  }, [editMode, eventId, events]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newEventId = editMode && eventId ? eventId : crypto.randomUUID();
      const eventData = {
        id: newEventId,
        ...formData,
        organizer: 'current-user-id',
        attendees: [],
        status: 'published' as const,
      };

      if (editMode && eventId) {
        updateEvent(eventId, eventData);
      } else {
        addEvent(eventData);
        setCreatedEventId(newEventId);
      }

      setShowQR(true);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvent = () => {
    // In a real app, this would navigate to the event details page
    navigate(`/calendar?event=${createdEventId}`);
  };

  const shareUrl = `${window.location.origin}/event/${eventId || createdEventId || ''}`;

  return (
    <div className="max-w-4xl mx-auto">
      {!showQR ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            <div>
              <label className={cn(
                'block text-sm font-medium mb-2',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                Event Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={cn(
                  'w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none',
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                )}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={cn(
                  'block text-sm font-medium mb-2',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Start Date & Time
                </label>
                <div className="relative">
                  <CalendarIcon className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )} />
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={cn(
                      'w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none',
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    )}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={cn(
                  'block text-sm font-medium mb-2',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  End Date & Time
                </label>
                <div className="relative">
                  <Clock className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )} />
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={cn(
                      'w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none',
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    )}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={cn(
                'block text-sm font-medium mb-2',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                Location
              </label>
              <div className="relative">
                <MapPin className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                )} />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={cn(
                    'w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none',
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={cn(
                  'block text-sm font-medium mb-2',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Category
                </label>
                <div className="relative">
                  <Tag className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )} />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={cn(
                      'w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none',
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    )}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="networking">Networking</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={cn(
                  'block text-sm font-medium mb-2',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Price
                </label>
                <div className="relative">
                  <DollarSign className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )} />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className={cn(
                      'w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none',
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    )}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={cn(
                'block text-sm font-medium mb-2',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                Capacity
              </label>
              <div className="relative">
                <Users className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                )} />
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className={cn(
                    'w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none',
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className={cn(
                'block text-sm font-medium mb-2',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                Image URL
              </label>
              <div className="relative">
                <ImageIcon className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                )} />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={cn(
                    'w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none',
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isVirtual"
                checked={formData.isVirtual}
                onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="isVirtual"
                className={cn(
                  'text-sm font-medium',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}
              >
                Virtual Event
              </label>
            </div>

            {formData.isVirtual && (
              <div>
                <label className={cn(
                  'block text-sm font-medium mb-2',
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Stream URL
                </label>
                <div className="relative">
                  <Video className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )} />
                  <input
                    type="url"
                    value={formData.streamUrl}
                    onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                    className={cn(
                      'w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none',
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    )}
                    placeholder="https://stream.example.com"
                    required={formData.isVirtual}
                  />
                </div>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={cn(
              'w-full py-3 px-4 rounded-lg font-medium text-white transition-colors',
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            )}
            type="submit"
          >
            {loading ? 'Creating Event...' : editMode ? 'Update Event' : 'Create Event'}
          </motion.button>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'mt-8 p-6 rounded-lg text-center',
            darkMode ? 'bg-gray-800' : 'bg-white'
          )}
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h3 className={cn(
              'text-2xl font-semibold mt-4',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              Event Created Successfully!
            </h3>
            <p className={cn(
              'text-sm mt-2',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Your event has been created and is ready to share.
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <QRCodeSVG
              value={shareUrl}
              size={200}
              level="H"
              includeMargin
              className={darkMode ? 'bg-white p-2 rounded' : undefined}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewEvent}
              className={cn(
                'flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium',
                darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              )}
            >
              <Eye className="h-5 w-5" />
              <span>View Event</span>
            </motion.button>

            <div className="flex justify-center space-x-4">
              <FacebookShareButton url={shareUrl}>
                <div className="p-2 rounded-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors">
                  Share on Facebook
                </div>
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl}>
                <div className="p-2 rounded-full bg-blue-400 text-white cursor-pointer hover:bg-blue-500 transition-colors">
                  Share on Twitter
                </div>
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl}>
                <div className="p-2 rounded-full bg-blue-700 text-white cursor-pointer hover:bg-blue-800 transition-colors">
                  Share on LinkedIn
                </div>
              </LinkedinShareButton>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}