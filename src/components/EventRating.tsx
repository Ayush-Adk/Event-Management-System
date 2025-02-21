import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface EventRatingProps {
  eventId: string;
}

export function EventRating({ eventId }: EventRatingProps) {
  const { darkMode, user } = useStore();
  const [rating, setRating] = React.useState(0);
  const [hoveredRating, setHoveredRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [userRating, setUserRating] = React.useState<number | null>(null);
  const [averageRating, setAverageRating] = React.useState<number | null>(null);
  const [reviews, setReviews] = React.useState<Array<{
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
    user_name: string;
  }>>([]);

  React.useEffect(() => {
    loadRatings();
  }, [eventId]);

  const loadRatings = async () => {
    try {
      // Load user's rating
      const { data: userRatingData } = await supabase
        .from('event_ratings')
        .select('rating')
        .eq('event_id', eventId)
        .eq('user_id', user?.id)
        .single();

      if (userRatingData) {
        setUserRating(userRatingData.rating);
        setRating(userRatingData.rating);
      }

      // Load average rating
      const { data: avgRatingData } = await supabase
        .rpc('get_average_event_rating', { event_id: eventId });

      if (avgRatingData) {
        setAverageRating(avgRatingData);
      }

      // Load reviews
      const { data: reviewsData } = await supabase
        .from('event_ratings')
        .select(`
          rating,
          comment,
          created_at,
          user_id,
          profiles (
            full_name
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (reviewsData) {
        setReviews(reviewsData.map(review => ({
          ...review,
          user_name: review.profiles?.full_name || 'Anonymous'
        })));
      }
    } catch (error) {
      console.error('Error loading ratings:', error);
    }
  };

  const handleRatingSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('event_ratings')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          rating,
          comment
        });

      if (error) throw error;

      setUserRating(rating);
      await loadRatings();
      setComment('');
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      'p-6 rounded-lg shadow-lg',
      darkMode ? 'bg-gray-800' : 'bg-white'
    )}>
      <h2 className={cn(
        'text-xl font-semibold mb-4',
        darkMode ? 'text-white' : 'text-gray-900'
      )}>
        Event Rating
      </h2>

      {averageRating !== null && (
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className={cn(
              'text-3xl font-bold',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              {averageRating.toFixed(1)}
            </span>
            <Star className="h-6 w-6 text-yellow-500 fill-current" />
          </div>
          <p className={cn(
            'text-sm mt-1',
            darkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            Average rating from {reviews.length} reviews
          </p>
        </div>
      )}

      {user && (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={cn(
                    'h-8 w-8 transition-colors',
                    (hoveredRating ? star <= hoveredRating : star <= rating)
                      ? 'text-yellow-500 fill-current'
                      : darkMode ? 'text-gray-600' : 'text-gray-300'
                  )}
                />
              </motion.button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this event..."
            className={cn(
              'w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none',
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            )}
            rows={3}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRatingSubmit}
            disabled={loading || !rating}
            className={cn(
              'w-full py-2 px-4 rounded-lg font-medium text-white transition-colors',
              loading || !rating
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            )}
          >
            {loading ? 'Submitting...' : userRating ? 'Update Rating' : 'Submit Rating'}
          </motion.button>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <h3 className={cn(
          'text-lg font-semibold flex items-center',
          darkMode ? 'text-white' : 'text-gray-900'
        )}>
          <MessageSquare className="h-5 w-5 mr-2" />
          Reviews
        </h3>

        {reviews.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'p-4 rounded-lg',
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn(
                'font-medium',
                darkMode ? 'text-white' : 'text-gray-900'
              )}>
                {review.user_name}
              </span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < review.rating
                        ? 'text-yellow-500 fill-current'
                        : darkMode ? 'text-gray-600' : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className={cn(
                'text-sm',
                darkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                {review.comment}
              </p>
            )}
            <p className={cn(
              'text-xs mt-2',
              darkMode ? 'text-gray-400' : 'text-gray-500'
            )}>
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}