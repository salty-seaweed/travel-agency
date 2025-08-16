import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from './index';
import { BookingForm } from './BookingForm';
import { useNotification } from '../hooks';
import { whatsappBooking } from '../services/whatsapp-booking';
import {
  MapPinIcon,
  StarIcon,
  CalendarIcon,
  UsersIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOffice2Icon,
  CheckIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { LazyImage } from './LazyImage';

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
  amenities: Array<{
    name: string;
  }>;
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

export function PropertyBookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingMethod, setBookingMethod] = useState<'form' | 'whatsapp' | null>(null);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        showError('Failed to load property details');
      }
    } catch (error) {
      showError('Failed to load property details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppBooking = () => {
    if (property) {
      whatsappBooking.bookPropertyDirect(property);
    }
  };

  const handleFormBooking = () => {
    setShowBookingForm(true);
  };

  const handleBookingSuccess = (booking: any) => {
    showSuccess('Booking submitted successfully! We will contact you soon.');
    navigate(`/properties/${id}`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/properties/${property.id}`)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Property
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Book Your Stay</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Summary */}
            <Card className="p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {property.images && property.images.length > 0 ? (
                    <LazyImage
                      src={property.images[0].image}
                      alt={property.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center">
                      <BuildingOffice2Icon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {property.location.island}, {property.location.atoll}
                    </div>
                    <div className="flex items-center">
                      <BuildingOffice2Icon className="h-4 w-4 mr-1" />
                      {property.property_type.name}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarSolidIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 font-medium text-gray-900">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500">({reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${property.price_per_night}</div>
                  <div className="text-sm text-gray-500">per night</div>
                </div>
              </div>
            </Card>

            {/* Booking Method Selection */}
            {!showBookingForm && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Choose Your Booking Method</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Form Booking Option */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CalendarIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Book via Form</h4>
                      <p className="text-sm text-gray-600">
                        Fill out our detailed booking form with your preferences and special requests.
                      </p>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-2 mb-6">
                      <li className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        Detailed booking form
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        Availability checking
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        Special requests
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        Instant confirmation
                      </li>
                    </ul>
                                         <Button
                       onClick={handleFormBooking}
                       className="w-full bg-purple-600 hover:bg-purple-700"
                     >
                       Book via Form
                     </Button>
                  </div>

                  {/* WhatsApp Booking Option */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">💬</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Book via WhatsApp</h4>
                      <p className="text-sm text-gray-600">
                        Get instant assistance and personalized booking support through WhatsApp.
                      </p>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-2 mb-6">
                      <li className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        Instant communication
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        Personalized assistance
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        Quick responses
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        Flexible arrangements
                      </li>
                    </ul>
                    <Button
                      onClick={handleWhatsAppBooking}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Book via WhatsApp
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Booking Form */}
            {showBookingForm && (
              <BookingForm
                propertyId={property.id}
                propertyName={property.name}
                pricePerNight={property.price_per_night}
                onClose={() => setShowBookingForm(false)}
                onBookingSuccess={handleBookingSuccess}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Property Details */}
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Max Guests</p>
                      <p className="text-sm text-gray-600">{property.max_guests} guests</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BuildingOffice2Icon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bedrooms</p>
                      <p className="text-sm text-gray-600">{property.bedrooms} bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bathrooms</p>
                      <p className="text-sm text-gray-600">{property.bathrooms} bathrooms</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">+960 123 4567</span>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">info@threadtravels.mv</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">Male, Maldives</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
