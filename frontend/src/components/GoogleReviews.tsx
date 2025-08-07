import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { Card } from './index';

interface GoogleReview {
  id: string;
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
}

interface GoogleReviewsProps {
  placeId?: string;
  maxReviews?: number;
  showHeader?: boolean;
}

export function GoogleReviews({ 
  placeId = 'YOUR_GOOGLE_PLACE_ID', 
  maxReviews = 6, 
  showHeader = true 
}: GoogleReviewsProps) {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Mock data for demonstration - replace with actual Google Places API
  const mockReviews: GoogleReview[] = [
    {
      id: '1',
      author_name: 'Sarah Johnson',
      author_url: '#',
      profile_photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      rating: 5,
      relative_time_description: '2 weeks ago',
      text: 'Thread Travels made our Maldives trip absolutely perfect! The accommodation was exactly as described, and the team was incredibly helpful throughout our stay. Highly recommend!',
      time: Date.now() - 14 * 24 * 60 * 60 * 1000,
      translated: false
    },
    {
      id: '2',
      author_name: 'Mike Chen',
      author_url: '#',
      profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      rating: 5,
      relative_time_description: '1 month ago',
      text: 'Excellent service from start to finish. The team at Thread Travels went above and beyond to ensure we had the best experience. The property was clean, comfortable, and perfectly located.',
      time: Date.now() - 30 * 24 * 60 * 60 * 1000,
      translated: false
    },
    {
      id: '3',
      author_name: 'Emma Wilson',
      author_url: '#',
      profile_photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      rating: 5,
      relative_time_description: '2 months ago',
      text: 'Amazing experience! Thread Travels helped us find the perfect accommodation for our budget. The communication was excellent and everything was arranged perfectly.',
      time: Date.now() - 60 * 24 * 60 * 60 * 1000,
      translated: false
    },
    {
      id: '4',
      author_name: 'David Brown',
      author_url: '#',
      profile_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      rating: 4,
      relative_time_description: '3 months ago',
      text: 'Great service and very professional. The team was responsive and helped us with all our questions. The accommodation was clean and well-maintained.',
      time: Date.now() - 90 * 24 * 60 * 60 * 1000,
      translated: false
    },
    {
      id: '5',
      author_name: 'Lisa Garcia',
      author_url: '#',
      profile_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
      rating: 5,
      relative_time_description: '4 months ago',
      text: 'Thread Travels exceeded our expectations! The booking process was smooth, and the accommodation was even better than described. Will definitely use their services again.',
      time: Date.now() - 120 * 24 * 60 * 60 * 1000,
      translated: false
    },
    {
      id: '6',
      author_name: 'James Miller',
      author_url: '#',
      profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      rating: 5,
      relative_time_description: '5 months ago',
      text: 'Outstanding service! The team at Thread Travels made our Maldives vacation unforgettable. Professional, reliable, and truly caring about customer satisfaction.',
      time: Date.now() - 150 * 24 * 60 * 60 * 1000,
      translated: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // In production, replace this with actual Google Places API call
        // const response = await fetch(`/api/google-reviews?placeId=${placeId}`);
        // const data = await response.json();
        
        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setReviews(mockReviews.slice(0, maxReviews));
        
        // Calculate average rating
        const avg = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
        setAverageRating(avg);
        setTotalReviews(mockReviews.length);
        
      } catch (err) {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [placeId, maxReviews]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>
        {i < rating ? (
          <StarIcon className="h-4 w-4 text-yellow-400" />
        ) : (
          <StarOutlineIcon className="h-4 w-4 text-gray-300" />
        )}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-lg font-semibold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500">({totalReviews} reviews)</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-600">
            Real reviews from travelers who booked through Thread Travels
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start space-x-3 mb-4">
              <img
                src={review.profile_photo_url}
                alt={review.author_name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{review.author_name}</h4>
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500 ml-2">
                    {review.relative_time_description}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed">
              "{review.text}"
            </p>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <a
          href="https://g.page/thread-travels-maldives/review"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Leave a Review
        </a>
      </div>
    </div>
  );
}

export default GoogleReviews; 