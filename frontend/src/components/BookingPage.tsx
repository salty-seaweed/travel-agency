import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, LoadingSpinner } from './index';
import { Button } from './ui/Button';
import { useNotification } from '../hooks';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { useWhatsApp } from '../hooks/useQueries';
import {
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { LazyImage } from './LazyImage';
import { SEO } from './SEO';

interface Property {
  id: number;
  name: string;
  description: string;
  price_per_night: number;
  location: {
    latitude: number;
    longitude: number;
    island: string;
    atoll: string;
  };
  property_type: {
    name: string;
  };
  images: Array<{
    image: string;
  }>;
  rating?: number;
  review_count?: number;
  is_featured: boolean;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
}

interface BookingFormData {
  check_in: string;
  check_out: string;
  guests: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests: string;
}

export function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { isAuthenticated, customerData } = useCustomerAuth();
  const { getWhatsAppUrl } = useWhatsApp();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    check_in: '',
    check_out: '',
    guests: 1,
    customer_name: customerData?.user?.first_name ? `${customerData.user.first_name} ${customerData.user.last_name || ''}` : '',
    customer_email: customerData?.user?.email || '',
    customer_phone: customerData?.phone || '',
    special_requests: '',
  });

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  useEffect(() => {
    if (customerData) {
      setFormData(prev => ({
        ...prev,
        customer_name: customerData.user?.first_name ? `${customerData.user.first_name} ${customerData.user.last_name || ''}` : prev.customer_name,
        customer_email: customerData.user?.email || prev.customer_email,
        customer_phone: customerData.phone || prev.customer_phone,
      }));
    }
  }, [customerData]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/properties/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        showError('Failed to load property details');
        navigate('/properties');
      }
    } catch (error) {
      showError('Failed to load property details');
      navigate('/properties');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateNights = () => {
    if (!formData.check_in || !formData.check_out) return 0;
    const start = new Date(formData.check_in);
    const end = new Date(formData.check_out);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    if (!property) return 0;
    const nights = calculateNights();
    return nights * property.price_per_night;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && { 'Authorization': `Bearer ${localStorage.getItem('customer_token')}` }),
        },
        body: JSON.stringify({
          ...formData,
          property: property?.id,
          total_amount: calculateTotalPrice(),
        }),
      });

      if (response.ok) {
        const bookingData = await response.json();
        showSuccess('Booking submitted successfully! We will contact you shortly to confirm.');
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        showError(errorData.message || 'Failed to submit booking');
      }
    } catch (error) {
      showError('Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppBooking = () => {
    const message = `Hi! I'm interested in booking ${property?.name} for ${formData.guests} guests from ${formData.check_in} to ${formData.check_out}. Can you help me with availability and rates?`;
    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <XMarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
            <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/properties')} variant="primary">
              Browse Properties
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const averageRating = property.rating || 0;
  const reviewCount = property.review_count || 0;
  const nights = calculateNights();
  const totalPrice = calculateTotalPrice();

  return (
    <>
      <SEO 
        title={`Book ${property.name} - Thread Travels & Tours`}
        description={`Book your stay at ${property.name} in ${property.location.island}, ${property.location.atoll}`}
        keywords={`book ${property.name}, Maldives accommodation, ${property.location.island}`}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <Button
                onClick={() => navigate(`/properties/${property.id}`)}
                variant="secondary"
                size="sm"
                className="mr-4"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Property
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Book Your Stay</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Summary */}
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <LazyImage
                      src={property.images?.[0]?.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&h=150&fit=crop'}
                      alt={property.name}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{property.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {property.location.island}, {property.location.atoll}
                      </div>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-1" />
                        Up to {property.max_guests} guests
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarSolidIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ${property.price_per_night}
                    </div>
                    <div className="text-sm text-gray-600">per night</div>
                  </div>
                </div>
              </Card>

              {/* Booking Form */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Details</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.check_in}
                        onChange={(e) => handleInputChange('check_in', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.check_out}
                        onChange={(e) => handleInputChange('check_out', e.target.value)}
                        min={formData.check_in || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests *
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Array.from({ length: property.max_guests }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Guest Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customer_name}
                        onChange={(e) => handleInputChange('customer_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.customer_email}
                        onChange={(e) => handleInputChange('customer_email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customer_phone}
                      onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      rows={4}
                      value={formData.special_requests}
                      onChange={(e) => handleInputChange('special_requests', e.target.value)}
                      placeholder="Any special requests or requirements..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                    </Button>
                    <a
                      href={getWhatsAppUrl(`Hi! I'm interested in booking. Can you help me?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-200 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">💬</span>
                      Book via WhatsApp
                    </a>
                  </div>
                </form>
              </Card>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per night</span>
                      <span className="font-medium">${property.price_per_night}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of nights</span>
                      <span className="font-medium">{nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of guests</span>
                      <span className="font-medium">{formData.guests}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-gray-900">${totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">What's included?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li className="flex items-center">
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Accommodation
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Basic amenities
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Local support
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 