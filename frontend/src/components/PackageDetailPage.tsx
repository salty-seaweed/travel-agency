import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  StarIcon, 
  MapPinIcon, 
  CalendarIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  ShareIcon,
  XMarkIcon,
  CheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  CameraIcon,
  WifiIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TruckIcon,
  HomeIcon,
  CakeIcon,
  SunIcon,
  CloudIcon,
  ExclamationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TagIcon,
  CreditCardIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Card } from './Card';
import { Button } from './ui/Button';
import { LoadingSpinner } from './LoadingSpinner';
import { SEO } from './SEO';
import { useNotification } from '../hooks/useNotification';
import { config, getWhatsAppUrl } from '../config';
import { unifiedApi } from '../services/unified-api';
import type { Package } from '../types';
import { PageErrorBoundary } from './SimpleErrorBoundary';
import { LazyImage } from './LazyImage';
import { BookingChoiceModal } from './BookingChoiceModal';

export function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  useEffect(() => {
    if (id) {
      fetchPackage();
    }
  }, [id]);

  const fetchPackage = async () => {
    try {
      const data = await unifiedApi.packages.getById(Number(id));
      setPackageData(data);
    } catch (error) {
      showError('Failed to load package details');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInclusionIcon = (category: string) => {
    switch (category) {
      case 'included': return <CheckIcon className="h-5 w-5 text-green-500" />;
      case 'excluded': return <XMarkIcon className="h-5 w-5 text-red-500" />;
      case 'optional': return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      default: return <CheckIcon className="h-5 w-5 text-gray-500" />;
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
  const originalPrice = packageData.original_price ? parseFloat(packageData.original_price) : price * 1.2;

  return (
    <>
      <SEO 
        title={`${packageData.name} - Maldives Travel Package`}
        description={packageData.description}
        image={packageData.images?.[0]?.image}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate('/packages')}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Packages</span>
              </button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {packageData.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(packageData.difficulty_level)}`}>
                    {packageData.difficulty_level}
                  </span>
                  {packageData.is_featured && (
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {packageData.name}
                </h1>
                
                <p className="text-xl text-white/90 mb-6">
                  {packageData.description}
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{packageData.duration}</div>
                    <div className="text-sm text-white/80">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{packageData.group_size?.max || 4}</div>
                    <div className="text-sm text-white/80">Max Group</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{packageData.destinations?.length || 1}</div>
                    <div className="text-sm text-white/80">Destinations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{packageData.activities?.length || 0}</div>
                    <div className="text-sm text-white/80">Activities</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold"
                  >
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Book Now
                  </Button>
                  <Button
                    onClick={() => window.open(getWhatsAppUrl(`Hi! I'm interested in the "${packageData.name}" package.`), '_blank')}
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: packageData.name,
                          text: packageData.description,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        showSuccess('Link copied!');
                      }
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    <ShareIcon className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                {packageData.images && packageData.images.length > 0 ? (
                  <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                    <LazyImage
                      src={packageData.images[0].image}
                      alt={packageData.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                ) : (
                  <div className="h-96 lg:h-[500px] bg-gradient-to-br from-blue-400 to-green-400 rounded-2xl flex items-center justify-center">
                    <CameraIcon className="h-16 w-16 text-white/50" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Overview Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                  <button
                    onClick={() => toggleSection('overview')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {expandedSections.has('overview') ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {expandedSections.has('overview') && (
                  <div className="space-y-6">
                    {packageData.detailed_description && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Package</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {packageData.detailed_description}
                        </p>
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Package Highlights</h3>
                        <ul className="space-y-2">
                          {packageData.highlights?.map((highlight, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Facts</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-blue-500" />
                            <span className="text-gray-700">{packageData.duration} days</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <UsersIcon className="h-5 w-5 text-green-500" />
                            <span className="text-gray-700">
                              {packageData.group_size?.min}-{packageData.group_size?.max} people
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPinIcon className="h-5 w-5 text-purple-500" />
                            <span className="text-gray-700">
                              {packageData.destinations?.length || 1} destination(s)
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <GlobeAltIcon className="h-5 w-5 text-orange-500" />
                            <span className="text-gray-700">{packageData.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Itinerary Section */}
              {packageData.itinerary && packageData.itinerary.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Daily Itinerary</h2>
                    <button
                      onClick={() => toggleSection('itinerary')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {expandedSections.has('itinerary') ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {expandedSections.has('itinerary') && (
                    <div className="space-y-6">
                      {packageData.itinerary.map((day, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              {day.day}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{day.title}</h3>
                          </div>
                          <p className="text-gray-700 mb-4">{day.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            {day.activities && day.activities.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                  <GlobeAltIcon className="h-4 w-4" />
                                  Activities
                                </h4>
                                <ul className="space-y-1">
                                  {day.activities.map((activity, actIndex) => (
                                    <li key={actIndex} className="text-sm text-gray-600">• {activity}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {day.meals && day.meals.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                  <CakeIcon className="h-4 w-4" />
                                  Meals
                                </h4>
                                <ul className="space-y-1">
                                  {day.meals.map((meal, mealIndex) => (
                                    <li key={mealIndex} className="text-sm text-gray-600">• {meal}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          
                          {day.accommodation && (
                            <div className="mt-3">
                              <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                <HomeIcon className="h-4 w-4" />
                                Accommodation
                              </h4>
                              <p className="text-sm text-gray-600">{day.accommodation}</p>
                            </div>
                          )}
                          
                          {day.transportation && (
                            <div className="mt-3">
                              <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                <TruckIcon className="h-4 w-4" />
                                Transportation
                              </h4>
                              <p className="text-sm text-gray-600">{day.transportation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Activities Section */}
              {packageData.activities && packageData.activities.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Activities & Experiences</h2>
                    <button
                      onClick={() => toggleSection('activities')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {expandedSections.has('activities') ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {expandedSections.has('activities') && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {packageData.activities.map((activity, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                            <div className="flex items-center gap-2">
                              {activity.included ? (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Included
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Optional
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                                {activity.difficulty}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <ClockIcon className="h-4 w-4" />
                              {activity.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <TagIcon className="h-4 w-4" />
                              {activity.category}
                            </span>
                            {activity.price && !activity.included && (
                              <span className="font-semibold text-green-600">
                                ${activity.price}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Destinations Section */}
              {packageData.destinations && packageData.destinations.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Destinations</h2>
                    <button
                      onClick={() => toggleSection('destinations')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {expandedSections.has('destinations') ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {expandedSections.has('destinations') && (
                    <div className="space-y-6">
                      {packageData.destinations.map((destination, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {destination.location.island}, {destination.location.atoll}
                              </h3>
                              <p className="text-gray-600">{destination.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">{destination.duration} days</div>
                              <div className="text-sm text-gray-500">Duration</div>
                            </div>
                          </div>
                          
                          {destination.highlights && destination.highlights.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-900 mb-2">Highlights</h4>
                              <div className="flex flex-wrap gap-2">
                                {destination.highlights.map((highlight, hIndex) => (
                                  <span key={hIndex} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {destination.activities && destination.activities.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Activities</h4>
                              <ul className="space-y-1">
                                {destination.activities.map((activity, aIndex) => (
                                  <li key={aIndex} className="text-sm text-gray-600 flex items-center gap-2">
                                    <CheckIcon className="h-4 w-4 text-green-500" />
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* What's Included/Excluded */}
              {packageData.inclusions && packageData.inclusions.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">What's Included</h2>
                    <button
                      onClick={() => toggleSection('inclusions')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {expandedSections.has('inclusions') ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {expandedSections.has('inclusions') && (
                    <div className="space-y-6">
                      {['included', 'excluded', 'optional'].map((category) => {
                        const categoryItems = packageData.inclusions?.filter(item => item.category === category);
                        if (!categoryItems || categoryItems.length === 0) return null;
                        
                        return (
                          <div key={category}>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                              {category} Items
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                              {categoryItems.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  {getInclusionIcon(item.category)}
                                  <div>
                                    <div className="font-medium text-gray-900">{item.item}</div>
                                    {item.description && (
                                      <div className="text-sm text-gray-600">{item.description}</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              )}

              {/* Accommodation & Transportation */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Accommodation & Transportation</h2>
                  <button
                    onClick={() => toggleSection('accommodation')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {expandedSections.has('accommodation') ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {expandedSections.has('accommodation') && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <HomeIcon className="h-5 w-5" />
                        Accommodation
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-900">Type:</span>
                          <span className="text-gray-600 ml-2">{packageData.accommodation_type || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Room:</span>
                          <span className="text-gray-600 ml-2">{packageData.room_type || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Meal Plan:</span>
                          <span className="text-gray-600 ml-2">{packageData.meal_plan || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <TruckIcon className="h-5 w-5" />
                        Transportation
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-900">Details:</span>
                          <span className="text-gray-600 ml-2">{packageData.transportation_details || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">Airport Transfers:</span>
                          {packageData.airport_transfers ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Important Information */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Important Information</h2>
                  <button
                    onClick={() => toggleSection('important')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {expandedSections.has('important') ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {expandedSections.has('important') && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <SunIcon className="h-5 w-5" />
                          Best Time to Visit
                        </h3>
                        <p className="text-gray-700">{packageData.best_time_to_visit || 'Year-round'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CloudIcon className="h-5 w-5" />
                          Weather Information
                        </h3>
                        <p className="text-gray-700">{packageData.weather_info || 'Tropical climate with warm temperatures year-round'}</p>
                      </div>
                    </div>
                    
                    {packageData.what_to_bring && packageData.what_to_bring.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">What to Bring</h3>
                        <div className="grid md:grid-cols-2 gap-2">
                          {packageData.what_to_bring.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckIcon className="h-4 w-4 text-green-500" />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {packageData.important_notes && packageData.important_notes.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <ExclamationCircleIcon className="h-5 w-5" />
                          Important Notes
                        </h3>
                        <div className="space-y-2">
                          {packageData.important_notes.map((note, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mt-0.5" />
                              <span className="text-gray-700">{note}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Booking Terms & Policies */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Booking Terms & Policies</h2>
                  <button
                    onClick={() => toggleSection('policies')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {expandedSections.has('policies') ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {expandedSections.has('policies') && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <DocumentTextIcon className="h-5 w-5" />
                        Booking Terms
                      </h3>
                      <p className="text-gray-700">{packageData.booking_terms || 'Standard booking terms apply'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ExclamationTriangleIcon className="h-5 w-5" />
                        Cancellation Policy
                      </h3>
                      <p className="text-gray-700">{packageData.cancellation_policy || 'Standard cancellation policy applies'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CreditCardIcon className="h-5 w-5" />
                        Payment Terms
                      </h3>
                      <p className="text-gray-700">{packageData.payment_terms || 'Payment required to confirm booking'}</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Pricing Card */}
                <Card className="p-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                      <span className="text-lg font-semibold">{packageData.rating || 4.8}</span>
                      <span className="text-gray-500">({packageData.review_count || 24} reviews)</span>
                    </div>
                    <p className="text-sm text-gray-600">Excellent package experience</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Package Price</span>
                      <span className="text-2xl font-bold text-blue-600">${price.toLocaleString()}</span>
                    </div>
                    {originalPrice > price && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 line-through">Original Price</span>
                        <span className="text-gray-500 line-through">${originalPrice.toLocaleString()}</span>
                      </div>
                    )}
                    {originalPrice > price && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-600 font-medium">You Save</span>
                        <span className="text-green-600 font-medium">${(originalPrice - price).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="text-center text-sm text-gray-500">
                      per person
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 mb-4"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>

                  <Button
                    onClick={() => window.open(getWhatsAppUrl(`Hi! I'm interested in the "${packageData.name}" package.`), '_blank')}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    WhatsApp Inquiry
                  </Button>
                </Card>

                {/* Quick Facts */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{packageData.duration} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Group Size</span>
                      <span className="font-medium">
                        {packageData.group_size?.min}-{packageData.group_size?.max} people
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Difficulty</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(packageData.difficulty_level)}`}>
                        {packageData.difficulty_level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">{packageData.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Destinations</span>
                      <span className="font-medium">{packageData.destinations?.length || 1}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Activities</span>
                      <span className="font-medium">{packageData.activities?.length || 0}</span>
                    </div>
                  </div>
                </Card>

                {/* Contact Information */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => window.open(`tel:+9607441097`)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Call Us
                    </Button>
                    <Button
                      onClick={() => window.open(`mailto:info@maldives-travel.com`)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      Email Us
                    </Button>
                    <Button
                      onClick={() => window.open(getWhatsAppUrl('Hi! I need help with a package.'), '_blank')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                      WhatsApp Support
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Choice Modal */}
      <BookingChoiceModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        package={packageData}
      />
    </>
  );
}

export default PackageDetailPage; 