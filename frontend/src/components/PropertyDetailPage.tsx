import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from './Card';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from './ui/Button';
import { ReviewSystem } from './ReviewSystem';
import { useNotification } from '../hooks';
import { whatsappBooking } from '../services/whatsapp-booking';
import { unifiedApi } from '../services/unified-api';
import {
  MapPinIcon,
  CurrencyDollarIcon,
  StarIcon,
  CalendarIcon,
  UsersIcon,
  XMarkIcon,
  HeartIcon,
  ShareIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOffice2Icon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { LazyImage } from './LazyImage';
import { SEO } from './SEO';

import type { Property } from '../types';

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError } = useNotification();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await unifiedApi.properties.getById(Number(id));
      setProperty(data);
    } catch (error) {
      showError('Failed to load property details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingClick = () => {
    // Navigate to booking form or open booking modal
    navigate(`/properties/${id}/book`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.name,
        text: property?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showError('Link copied to clipboard!');
    }
  };

  const handleContact = () => {
    if (property) {
      whatsappBooking.bookPropertyDirect(property);
    }
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
    <>
      <SEO 
        title={`${property.name} - Thread Travels & Tours`}
        description={property.description}
        keywords={`${property.name}, ${property.location.island}, ${property.location.atoll}, Maldives accommodation`}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Image Gallery */}
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            {property.images && property.images.length > 0 ? (
              <LazyImage
                src={property.images[selectedImage].image}
                alt={property.name}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
                <BuildingOffice2Icon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Image Navigation */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex space-x-2 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-500' : 'border-white'
                    }`}
                  >
                    <LazyImage
                      src={image.image}
                      alt={`${property.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {property.is_featured && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                ⭐ Featured Property
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              onClick={handleShare}
              variant="secondary"
              size="sm"
              className="bg-white/90 backdrop-blur-sm"
            >
              <ShareIcon className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              onClick={handleContact}
              variant="primary"
              size="sm"
            >
              <PhoneIcon className="h-4 w-4 mr-1" />
              Contact
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {property.location.island}, {property.location.atoll}
                  </div>
                  <div className="flex items-center">
                    <BuildingOffice2Icon className="h-4 w-4 mr-1" />
                    {property.property_type.name}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarSolidIcon
                        key={star}
                        className={`h-5 w-5 ${
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
              </div>

              {/* Property Details */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Max Guests</p>
                      <p className="text-sm text-gray-600">Up to 4 guests</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BuildingOffice2Icon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bedrooms</p>
                      <p className="text-sm text-gray-600">2 bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bathrooms</p>
                      <p className="text-sm text-gray-600">2 bathrooms</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this property</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </Card>

              {/* Amenities */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Reviews */}
              <ReviewSystem 
                propertyId={property.id}
                onReviewSubmitted={fetchProperty}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Booking Card */}
                <Card className="p-6 mb-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-900">
                      ${property.price_per_night}
                    </div>
                    <div className="text-sm text-gray-600">per night</div>
                  </div>

                  <div className="space-y-4">
                    <Link
                      to={`/properties/${property.id}/book`}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      Book Now
                    </Link>

                    <Button
                      onClick={() => whatsappBooking.bookPropertyDirect(property)}
                      variant="green"
                      fullWidth
                      className="flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">💬</span>
                      Book via WhatsApp
                    </Button>
                  </div>
                </Card>

                {/* Contact Information */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">+960 744 1097</span>
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
    </>
  );
} 