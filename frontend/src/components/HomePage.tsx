import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  StarIcon, 
  CheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CalendarIcon,
  UsersIcon,
  PlayIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CameraIcon,
  WifiIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useHomepageData } from '../hooks/useQueries';
import { LoadingSpinner, Card, Button } from './index';
import { GoogleReviews } from './GoogleReviews';
import { SEO } from './SEO';
import { PageErrorBoundary, ComponentErrorBoundary } from './SimpleErrorBoundary';
import { EnhancedSearch } from './EnhancedSearch';
import { usePerformanceMonitor } from '../utils/performanceUtils';
import { config, getWhatsAppUrl } from '../config';

export function HomePage() {
  const { properties, packages, isLoading, isError, error } = useHomepageData();
  const { measure } = usePerformanceMonitor('HomePage');

  // Handle loading state
  if (isLoading) {
    measure('loading-start');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Handle error state
  if (isError) {
    measure('error-state');
    return (
      <PageErrorBoundary pageName="Homepage">
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Failed to Load Homepage</h1>
            <p className="text-gray-600 mb-6">
              {error?.message || 'Something went wrong. Please try again.'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </PageErrorBoundary>
    );
  }

  // Measure successful render
  measure('render-complete');

  return (
    <>
      <SEO 
        title="Thread Travels & Tours - Your Trusted Maldives Travel Partner"
        description="Discover the best properties and travel packages in the Maldives. We connect you with authentic local accommodations and unforgettable experiences."
        keywords="Maldives travel, property booking, local accommodation, island hopping, Thread Travels"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Simplified Hero Section - Improved Readability & Accessibility */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" role="banner">
          {/* Simplified Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-indigo-900/80 to-purple-900/85"></div>
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center" 
              alt="Pristine Maldives beach with crystal clear waters and overwater bungalows"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            {/* Trust Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/20 shadow-xl">
                <SparklesIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                <span className="text-lg font-semibold">Trusted by 15,000+ Travelers</span>
                <div className="flex items-center gap-2">
                  <StarSolidIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                  <span className="font-bold">4.9</span>
                </div>
              </div>
            </div>
            
            {/* Improved Main Heading - Better Typography */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                Maldives Paradise
              </span>
            </h1>
            
            {/* Improved Subtitle - Better Readability */}
            <p className="text-lg sm:text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Experience the magic of the Maldives with our curated collection of 
              <span className="text-yellow-300 font-semibold"> luxury resorts</span> and 
              <span className="text-yellow-300 font-semibold"> authentic experiences</span>
            </p>
            
            {/* Enhanced CTA Buttons - Better Accessibility */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                to="/packages"
                className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-4 rounded-2xl font-bold text-xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-offset-2"
                aria-label="Explore our travel packages"
              >
                <span className="relative flex items-center gap-4">
                  <span className="text-2xl" aria-hidden="true">🌟</span>
                  Explore Packages
                  <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </Link>
              
              <Link
                to="/properties"
                className="group relative overflow-hidden bg-transparent border-2 border-white text-white px-12 py-4 rounded-2xl font-bold text-xl hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2"
                aria-label="View our properties"
              >
                <span className="relative flex items-center gap-4">
                  <span className="text-2xl" aria-hidden="true">🏠</span>
                  View Properties
                  <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </Link>
            </div>
            
            {/* Simplified Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2 group-hover:scale-105 transition-transform duration-300">500+</div>
                <div className="text-sm text-blue-100 font-medium">Properties</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2 group-hover:scale-105 transition-transform duration-300">50K+</div>
                <div className="text-sm text-blue-100 font-medium">Happy Guests</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2 group-hover:scale-105 transition-transform duration-300">24/7</div>
                <div className="text-sm text-blue-100 font-medium">Support</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2 group-hover:scale-105 transition-transform duration-300">4.9★</div>
                <div className="text-sm text-blue-100 font-medium">Rating</div>
              </div>
            </div>
          </div>
          
          {/* Simplified Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
            <span className="sr-only">Scroll down to see more content</span>
          </div>
        </section>

        {/* Enhanced Search Section - Modern & Functional */}
        <ComponentErrorBoundary componentName="SearchSection">
          <section className="py-16 bg-white relative overflow-hidden" role="search" aria-labelledby="search-heading">
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 rounded-2xl p-8 shadow-2xl">
                <h2 id="search-heading" className="text-3xl font-bold text-white mb-6 text-center">Find Your Perfect Stay</h2>
                <div className="max-w-2xl mx-auto">
                  <EnhancedSearch className="w-full" />
                </div>
                <p className="text-blue-100 text-center mt-4 text-sm">
                  Search across 500+ properties and packages with advanced filters
                </p>
              </div>
            </div>
          </section>
        </ComponentErrorBoundary>

        {/* Enhanced Featured Packages - Better Structure */}
        <ComponentErrorBoundary componentName="FeaturedPackages">
          <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden" aria-labelledby="packages-heading">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-base font-semibold mb-6">
                  <StarIcon className="h-4 w-4" aria-hidden="true" />
                  Most Popular
                </div>
                <h2 id="packages-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Curated Travel Experiences
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Handpicked packages that combine luxury accommodation, authentic experiences, and unforgettable adventures
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {packages.slice(0, 3).map((pkg, index) => {
                  const packageImages = [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
                    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
                  ];
                  
                  return (
                    <article key={pkg.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                      {/* Package Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={packageImages[index % packageImages.length]} 
                          alt={`${pkg.name} - Maldives travel package`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/95 backdrop-blur rounded-2xl px-4 py-3 shadow-lg">
                            <div className="text-2xl font-bold text-green-600">${pkg.price}</div>
                            <div className="text-xs text-gray-500 font-medium">per person</div>
                          </div>
                        </div>
                        
                        {pkg.is_featured && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                              ⭐ Featured
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Package Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{pkg.name}</h3>
                        <p className="text-gray-600 text-base mb-4 line-clamp-2 leading-relaxed">{pkg.description}</p>
                        
                        {/* Package Details */}
                        <div className="grid grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
                            <span className="font-medium">{pkg.duration} days</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UsersIcon className="h-4 w-4 text-purple-500 flex-shrink-0" aria-hidden="true" />
                            <span className="font-medium">Up to {pkg.maxTravelers}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="h-4 w-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                            <span className="font-medium">{pkg.destinations.length} islands</span>
                          </div>
                        </div>
                        
                        {/* Highlights */}
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                              <span 
                                key={idx}
                                className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-xl text-xs font-semibold border border-blue-200"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Action Buttons - Improved Accessibility */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link 
                            to={`/packages/${pkg.id}`} 
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl text-base font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                            aria-label={`View details for ${pkg.name} package`}
                          >
                            <CameraIcon className="h-4 w-4" aria-hidden="true" />
                            View Details
                            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                          </Link>
                          <button 
                            onClick={() => {
                              const message = `Hi! I'm interested in the ${pkg.name} package. Can you provide more details?`;
                              const whatsappUrl = getWhatsAppUrl(message);
                              window.open(whatsappUrl, '_blank');
                            }}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl text-base font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2"
                            aria-label={`Book ${pkg.name} package via WhatsApp`}
                          >
                            <span className="text-lg" aria-hidden="true">💬</span>
                            Book Now
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              
              {/* View All Packages Button */}
              <div className="text-center mt-16">
                <Link
                  to="/packages"
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                  aria-label="Explore all travel packages"
                >
                  Explore All Packages
                  <ArrowRightIcon className="h-6 w-6" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        </ComponentErrorBoundary>

        {/* Enhanced Why Choose Us Section */}
        <ComponentErrorBoundary componentName="WhyChooseUs">
          <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden" aria-labelledby="why-choose-heading">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 id="why-choose-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  Why Choose Thread Travels?
                </h2>
                <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  We're not just a travel agency – we're your personal gateway to the Maldives paradise
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <GlobeAltIcon className="h-10 w-10 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Local Expertise</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Our team has personally visited and vetted every property. We know the hidden gems that tourists rarely discover.
                  </p>
                </div>

                <div className="group text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheckIcon className="h-10 w-10 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Quality Assured</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Every property meets our strict standards for cleanliness, service, and authentic local experiences.
                  </p>
                </div>

                <div className="group text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <ChatBubbleLeftRightIcon className="h-10 w-10 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Personal Support</h3>
                  <p className="text-blue-100 leading-relaxed">
                    From planning to check-out, we're here 24/7. Your dream vacation is our priority.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ComponentErrorBoundary>

        {/* Enhanced Featured Properties */}
        <ComponentErrorBoundary componentName="FeaturedProperties">
          <section className="py-20 bg-white relative overflow-hidden" aria-labelledby="properties-heading">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-16">
                <div>
                  <h2 id="properties-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Properties</h2>
                  <p className="text-lg sm:text-xl text-gray-600">Handpicked accommodations for the ultimate Maldives experience</p>
                </div>
                <Link
                  to="/properties"
                  className="mt-6 sm:mt-0 inline-flex items-center gap-3 text-blue-600 hover:text-blue-700 font-bold text-xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
                  aria-label="View all properties"
                >
                  View All Properties
                  <ArrowRightIcon className="h-6 w-6" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.slice(0, 6).map((property) => (
                  <article key={property.id} className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={property.images?.[0]?.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&crop=center&auto=format&q=80'}
                        alt={`${property.name} - ${property.location.island}, ${property.location.atoll}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {property.is_featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                            Featured
                          </span>
                        </div>
                      )}
                      <button 
                        className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur rounded-xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label={`Add ${property.name} to favorites`}
                      >
                        <HeartIcon className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{property.name}</h3>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" aria-hidden="true" />
                        <span className="font-medium">{property.location.island}, {property.location.atoll}</span>
                      </div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <StarSolidIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                          <span className="font-bold text-lg">{property.rating}</span>
                          <span className="text-gray-500">({property.reviewCount} reviews)</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">${property.price}</div>
                          <div className="text-sm text-gray-500">per night</div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          to={`/properties/${property.id}`}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                          aria-label={`View details for ${property.name}`}
                        >
                          <CameraIcon className="h-4 w-4" aria-hidden="true" />
                          View Details
                          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link
                          to={`/properties/${property.id}/book`}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2"
                          aria-label={`Book ${property.name}`}
                        >
                          <span className="text-lg" aria-hidden="true">🏖️</span>
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </ComponentErrorBoundary>

        {/* Enhanced Testimonials Section */}
        <ComponentErrorBoundary componentName="Testimonials">
          <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden" aria-labelledby="testimonials-heading">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 id="testimonials-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  What Our Guests Say
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  Don't just take our word for it – hear from our satisfied guests
                </p>
              </div>
              <GoogleReviews maxReviews={6} />
            </div>
          </section>
        </ComponentErrorBoundary>

        {/* Enhanced CTA Section */}
        <ComponentErrorBoundary componentName="CTASection">
          <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden" aria-labelledby="cta-heading">
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 id="cta-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">Ready to Start Your Maldives Adventure?</h2>
              <p className="text-lg sm:text-xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Let us help you find the perfect property and create unforgettable memories in paradise
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
                <a
                  href={getWhatsAppUrl('Hi! I\'d like to know more about your Maldives travel packages.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2"
                  aria-label="Contact us on WhatsApp"
                >
                  <span className="relative flex items-center justify-center gap-3">
                    <ChatBubbleLeftRightIcon className="h-6 w-6" aria-hidden="true" />
                    Chat on WhatsApp
                  </span>
                </a>
                <a
                  href={`tel:${config.whatsappNumber}`}
                  className="group relative overflow-hidden bg-transparent border-2 border-white text-white px-12 py-4 rounded-2xl font-bold text-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2"
                  aria-label={`Call us at ${config.whatsappNumber}`}
                >
                  <span className="relative flex items-center justify-center gap-3">
                    <PhoneIcon className="h-6 w-6" aria-hidden="true" />
                    Call Us Now
                  </span>
                </a>
              </div>
            </div>
          </section>
        </ComponentErrorBoundary>
      </div>
    </>
  );
}

export default HomePage; 