import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  XMarkIcon,
  BuildingOffice2Icon,
  StarIcon,
  MapPinIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { LoadingSpinner } from './LoadingSpinner';
import { LazyImage } from './LazyImage';
import { BookingForm } from './BookingForm';
import { whatsappBooking } from '../services/whatsapp-booking';
import { useNotification } from '../hooks/useNotification';
import { unifiedApi } from '../services/unified-api';
import type { Property } from '../types';
import { useSmartTranslation } from '../hooks/useSmartTranslation';

export function PropertyBookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { translateButton, translateLabel } = useSmartTranslation();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await unifiedApi.properties.getById(parseInt(id!));
      setProperty(data);
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
  const reviewCount = property.reviewCount || 0;

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
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{property.name}</h2>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{property.location.island}, {property.location.atoll}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {averageRating.toFixed(1)} ({reviewCount} {translateLabel('reviews')})
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    ${parseFloat(property.price_per_night)} {translateLabel('perNight')}
                  </div>
                </div>
              </div>
            </Card>

            {/* Booking Options */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Booking Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleWhatsAppBooking}
                  variant="green"
                  className="flex items-center justify-center space-x-2"
                >
                  <CheckIcon className="h-5 w-5" />
                  <span>{translateButton('bookViaWhatsApp')}</span>
                </Button>
                <Button
                  onClick={handleFormBooking}
                  variant="secondary"
                  className="flex items-center justify-center space-x-2"
                >
                  <CalendarIcon className="h-5 w-5" />
                  <span>Fill Booking Form</span>
                </Button>
              </div>
            </Card>

            {/* Property Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Property Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <BuildingOffice2Icon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Property Type</p>
                        <p className="text-sm text-gray-600">{property.property_type.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{translateLabel('price')} {translateLabel('perNight')}</p>
                        <p className="text-sm text-gray-600">${parseFloat(property.price_per_night)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">{translateLabel('amenities')}</h4>
                  <div className="space-y-2">
                    {property.amenities.slice(0, 5).map((amenity) => (
                      <div key={amenity.id} className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-600">{amenity.name}</span>
                      </div>
                    ))}
                    {property.amenities.length > 5 && (
                      <p className="text-sm text-gray-500">
                        +{property.amenities.length - 5} more amenities
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{translateLabel('contact')} Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">+960 123 4567</span>
                </div>
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">info@threadtravels.mv</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && property && (
        <BookingForm
          propertyId={property.id}
          propertyName={property.name}
          pricePerNight={parseFloat(property.price_per_night)}
          onClose={() => setShowBookingForm(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
