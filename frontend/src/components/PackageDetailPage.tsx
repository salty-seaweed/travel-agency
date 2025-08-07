import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from './index';
import { useNotification } from '../hooks';
import {
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { LazyImage } from './LazyImage';
import { SEO } from './SEO';

interface Package {
  id: number;
  name: string;
  description: string;
  price: string;
  properties: Array<{
    id: number;
    name: string;
    location: {
      island: string;
      atoll: string;
    };
    images: Array<{
      image: string;
    }>;
  }>;
  is_featured: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPackage();
    }
  }, [id]);

  const fetchPackage = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/packages/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setPackageData(data);
      } else {
        showError('Failed to load package details');
      }
    } catch (error) {
      showError('Failed to load package details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppBooking = () => {
    const message = `Hi! I'm interested in booking the "${packageData?.name}" package. Can you provide more details about availability and booking process?`;
    const whatsappUrl = `https://wa.me/9601234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: packageData?.name,
        text: packageData?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <XMarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h2>
            <p className="text-gray-600 mb-6">The package you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/packages')} variant="primary">
              Browse Packages
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const price = parseFloat(packageData.price);
  const originalPrice = price * 1.2; // 20% markup for display

  return (
    <>
      <SEO 
        title={`${packageData.name} - Thread Travels & Tours`}
        description={packageData.description}
        keywords={`${packageData.name}, Maldives package, travel package, Thread Travels`}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/packages')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Packages
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <HeartIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Package Header */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {packageData.is_featured && (
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Package
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{packageData.name}</h1>
                <p className="text-gray-600 text-lg mb-6">{packageData.description}</p>
              </div>

              {/* Package Details */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Package Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">7 Days / 6 Nights</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <UsersIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Max Travelers</p>
                      <p className="font-medium">Up to 4 people</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Destinations</p>
                      <p className="font-medium">{packageData.properties.length} locations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">${price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Included Properties */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Included Properties</h2>
                <div className="space-y-4">
                  {packageData.properties.map((property) => (
                    <div key={property.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <LazyImage
                          src={property.images?.[0]?.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=64&h=64&fit=crop'}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{property.name}</h3>
                        <p className="text-sm text-gray-600">
                          {property.location.island}, {property.location.atoll}
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* What's Included */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Accommodation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Daily Breakfast</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Airport Transfers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Island Hopping</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Water Activities</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Local Guide</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                    <span className="text-lg font-semibold">4.8</span>
                    <span className="text-gray-500">(24 reviews)</span>
                  </div>
                  <p className="text-sm text-gray-600">Excellent package experience</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Package Price</span>
                    <span className="text-2xl font-bold text-blue-600">${price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 line-through">Original Price</span>
                    <span className="text-gray-500 line-through">${originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600 font-medium">You Save</span>
                    <span className="text-green-600 font-medium">${(originalPrice - price).toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleWhatsAppBooking}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold mb-4"
                >
                  📱 Book via WhatsApp
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Need help?</p>
                  <div className="flex items-center justify-center space-x-4">
                    <button className="flex items-center text-blue-600 hover:text-blue-700">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">Call</span>
                    </button>
                    <button className="flex items-center text-blue-600 hover:text-blue-700">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">Email</span>
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PackageDetailPage; 