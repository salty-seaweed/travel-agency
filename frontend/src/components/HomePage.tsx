import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  StarIcon, 
  CheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useFeaturedProperties, useFeaturedPackages } from '../hooks/useApi';
import { LoadingSpinner, Card, Button } from './index';
import { GoogleReviews } from './GoogleReviews';
import { SEO } from './SEO';
import type { Property as ApiProperty, Package as ApiPackage } from '../services/api';

// Convert API property to PropertyCard format
const convertApiPropertyToCardFormat = (property: ApiProperty) => ({
  id: property.id,
  name: property.name,
  location: `${property.location.island}, ${property.location.atoll}`,
  price: parseFloat(property.price_per_night),
  rating: 4.5, // You might want to calculate this from reviews
  reviewCount: property.reviews?.length || 0,
  image: property.images?.[0]?.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
  type: property.property_type.name,
  amenities: property.amenities.map(a => a.name),
  description: property.description,
  featured: property.is_featured,
});

// Convert API package to PackageCard format
const convertApiPackageToCardFormat = (pkg: ApiPackage) => {
  // Attractive Maldives images for packages
  const packageImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=600&h=400&fit=crop&crop=center'
  ];

  return {
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    duration: '7 days', // You might want to calculate this from start/end dates
    price: parseFloat(pkg.price),
    originalPrice: parseFloat(pkg.price) * 1.2, // 20% discount
    rating: 4.8,
    reviewCount: 12,
    image: packageImages[Math.floor(Math.random() * packageImages.length)],
    destinations: pkg.properties.map((p: any) => p.location.island),
    highlights: ['All-inclusive', 'Water activities', 'Local tours', 'Island hopping', 'Snorkeling', 'Sunset cruises'],
    included: ['Accommodation', 'Meals', 'Transfers', 'Activities', 'Local guide', 'Equipment'],
    maxTravelers: 4,
    featured: pkg.is_featured,
    category: 'Adventure',
  };
};

export function HomePage() {
  const { data: apiProperties, loading: propertiesLoading } = useFeaturedProperties();
  const { data: apiPackages, loading: packagesLoading } = useFeaturedPackages();

  // Convert API data to the format expected by the component
  const featuredProperties = apiProperties ? apiProperties.map(convertApiPropertyToCardFormat) : [];
  const featuredPackages = apiPackages ? apiPackages.map(convertApiPackageToCardFormat) : [];

  return (
    <>
      <SEO 
        title="Thread Travels & Tours - Your Trusted Maldives Travel Partner"
        description="Discover the best properties and travel packages in the Maldives. We connect you with authentic local accommodations and unforgettable experiences."
        keywords="Maldives travel, property booking, local accommodation, island hopping, Thread Travels"
      />
      
      <div className="min-h-screen">
        {/* Hero Section - Improved Mobile */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white min-h-[80vh] flex items-center">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Your Trusted Partner for
                <span className="block text-yellow-400 mt-2">Maldives Adventures</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-4xl mx-auto px-4">
                We connect you with the best local properties and authentic experiences across the Maldives
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                <Link
                  to="/packages"
                  className="w-full sm:w-auto bg-yellow-400 text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                >
                  🌟 Browse Packages
                </Link>
                <Link
                  to="/properties"
                  className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white hover:text-blue-900 transition-colors flex items-center justify-center gap-2"
                >
                  🏠 Browse Properties
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Packages Showcase - Improved Mobile */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                🌟 Most Popular Packages
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                Start your Maldives adventure with our curated packages featuring the best islands and experiences
              </p>
            </div>
            
            {packagesLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {featuredPackages.slice(0, 3).map((pkg, index) => {
                  // Attractive Maldives images for packages
                  const packageImages = [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=600&h=400&fit=crop&crop=center'
                  ];
                  
                  return (
                    <div key={pkg.id} className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
                      {/* Package Image */}
                      <div className="relative h-48 sm:h-52 overflow-hidden">
                        <img 
                          src={packageImages[index % packageImages.length]} 
                          alt={pkg.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Price Badge */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                          <div className="text-sm sm:text-lg font-bold text-green-600">${pkg.price}</div>
                          <div className="text-xs text-gray-500">per person</div>
                        </div>
                        
                        {/* Rating Badge */}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1">
                          <StarSolidIcon className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                          <span className="text-sm sm:text-base font-semibold text-gray-800">{pkg.rating}</span>
                        </div>
                      </div>
                      
                      {/* Package Content */}
                      <div className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">{pkg.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-3">{pkg.description}</p>
                        
                        {/* Package Details - Improved Mobile */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{pkg.destinations.length} destinations</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-base">⏱️</span>
                            <span>{pkg.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-base">👥</span>
                            <span>Up to {pkg.maxTravelers}</span>
                          </div>
                        </div>
                        
                        {/* Highlights */}
                        <div className="mb-3 sm:mb-4">
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {pkg.highlights.slice(0, 2).map((highlight, idx) => (
                              <span 
                                key={idx}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Action Buttons - Improved Mobile */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Link 
                            to={`/packages/${pkg.id}`} 
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-center"
                          >
                            View Details
                          </Link>
                          <button 
                            onClick={() => {
                              const message = `Hi! I'm interested in the ${pkg.name} package. Can you provide more details?`;
                              const whatsappUrl = `https://wa.me/+9601234567?text=${encodeURIComponent(message)}`;
                              window.open(whatsappUrl, '_blank');
                            }}
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center gap-1"
                          >
                            <span className="text-base">💬</span>
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* View All Packages Button - Improved Mobile */}
            <div className="text-center mt-8 sm:mt-12">
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View All Packages
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Thread Travels?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We're your local experts, connecting you with authentic properties and experiences across the Maldives. 
                Our personalized service ensures you get the best value and authentic local experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Expertise</h3>
                <p className="text-gray-600">
                  We know the Maldives inside out. Our team has personally visited and vetted every property we recommend.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assured</h3>
                <p className="text-gray-600">
                  Every property in our network meets our strict quality standards for cleanliness, service, and value.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Support</h3>
                <p className="text-gray-600">
                  From booking to check-out, we're here to help. Our team provides 24/7 support throughout your stay.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Packages - Moved up for more prominence */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                🌟 Premium Travel Packages
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Curated experiences combining multiple properties and activities for the ultimate Maldives adventure
              </p>
            </div>

            {packagesLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPackages.slice(0, 3).map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                    <div className="relative h-56">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                      {pkg.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                            ⭐ Featured Package
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {pkg.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{pkg.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                      
                      {/* Package Highlights */}
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <span className="mr-2">📍</span>
                          <span>{pkg.destinations.length} destinations</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <span className="mr-2">⏱️</span>
                          <span>{pkg.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">👥</span>
                          <span>Up to {pkg.maxTravelers} travelers</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <StarSolidIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{pkg.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({pkg.reviewCount})</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">${pkg.price}</div>
                          <div className="text-sm text-gray-500">per person</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/packages/${pkg.id}`}
                          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg text-center text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </Link>
                        <button 
                          onClick={() => {
                            const message = `Hi! I'm interested in booking the "${pkg.name}" package. Can you provide more details?`;
                            const whatsappUrl = `https://wa.me/9601234567?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                          }}
                          className="bg-green-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="text-center mt-8">
              <Link
                to="/packages"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
              >
                View All Packages
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Properties</h2>
                <p className="text-gray-600">Handpicked accommodations for the best Maldives experience</p>
              </div>
              <Link
                to="/properties"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All →
              </Link>
            </div>

            {propertiesLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.slice(0, 6).map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                      {property.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.name}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <StarSolidIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{property.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({property.reviewCount})</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">${property.price}</div>
                          <div className="text-sm text-gray-500">per night</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/properties/${property.id}`}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/properties/${property.id}/book`}
                          className="bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Google Reviews Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GoogleReviews maxReviews={6} />
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Maldives Adventure?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Let us help you find the perfect property and create unforgettable memories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/9601234567"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Chat on WhatsApp
              </a>
              <a
                href="tel:+9601234567"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                Call Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage; 