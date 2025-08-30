import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, LoadingSpinner } from './index';
import { Button } from './ui/Button';
import { PackageBookingForm } from './PackageBookingForm';
import { useNotification } from '../hooks';
import { whatsappBooking } from '../services/whatsapp-booking';
import { useTranslation } from '../i18n';
import { useWhatsApp } from '../hooks/useQueries';
import { useHomepageContent } from '../hooks/useQueries';
import type { Package } from '../types';
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

export function PackageBookingPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const { whatsappNumber } = useWhatsApp();
  const { data: homepageContent } = useHomepageContent();
  const [pkg, setPackage] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Helper function to get translated content based on current language
  const getTranslatedContent = (field: string, fallback: string = ''): string => {
    if (!pkg) return fallback;
    
    const currentLang = i18n.language;
    const translatedField = `${field}_${currentLang}` as keyof Package;
    
    // Check if translated version exists and is not empty
    if (pkg[translatedField] && typeof pkg[translatedField] === 'string' && pkg[translatedField].trim() !== '') {
      return pkg[translatedField] as string;
    }
    
    // Fallback to original field
    return (pkg[field as keyof Package] as string) || fallback;
  };

  useEffect(() => {
    if (id) {
      fetchPackage();
    }
  }, [id]);

  const fetchPackage = async () => {
    try {
      const response = await fetch(`/api/packages/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setPackage(data);
      } else {
        showError(t('packageBooking.error.loadFailed', 'Failed to load package details'));
      }
    } catch (error) {
      showError(t('packageBooking.error.loadFailed', 'Failed to load package details'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppBooking = () => {
    if (pkg) {
      whatsappBooking.bookPackageDirect(pkg);
    }
  };

  const handleFormBooking = () => {
    setShowBookingForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <XMarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('packageBooking.notFound.title', 'Package Not Found')}</h2>
            <p className="text-gray-600 mb-6">{t('packageBooking.notFound.description', "The package you're looking for doesn't exist.")}</p>
            <Button onClick={() => navigate('/packages')} variant="primary">
              {t('packageBooking.notFound.browsePackages', 'Browse Packages')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const averageRating = pkg.rating || 0;
  const reviewCount = pkg.review_count || 0;

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/packages/${pkg.id}`)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              {t('packageBooking.header.backToPackage', 'Back to Package')}
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{t('packageBooking.header.title', 'Book Your Package')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Package Summary */}
            <Card className="p-6 mb-6 border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {pkg.images && pkg.images.length > 0 ? (
                    <LazyImage
                      src={pkg.images[0].image}
                      alt={getTranslatedContent('name', pkg.name)}
                      className="w-28 h-28 object-cover rounded-xl shadow-sm"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-200 rounded-xl flex items-center justify-center">
                      <BuildingOffice2Icon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{getTranslatedContent('name', pkg.name)}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {pkg.destinations?.join(', ') || t('packageBooking.defaultDestination', 'Maldives Paradise')}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {t('packageBooking.duration', '{{count}} days', { count: pkg.duration })}
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
                      <span className="text-gray-500">{t('packageBooking.reviews', '({{count}} reviews)', { count: reviewCount })}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text">${pkg.price}</div>
                  <div className="text-sm text-gray-500">{t('packageBooking.perPerson', 'per person')}</div>
                </div>
              </div>
            </Card>

            {/* Booking Method Selection */}
            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('packageBooking.bookingMethod.title', 'Choose Your Booking Method')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form Booking Option */}
                <div className="border border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-colors bg-white/70">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('packageBooking.bookingMethod.form.title', 'Book via Form')}</h4>
                    <p className="text-sm text-gray-600">
                      {t('packageBooking.bookingMethod.form.description', 'Fill out our detailed booking form with your preferences and special requests.')}
                    </p>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      {t('packageBooking.bookingMethod.form.features.detailedForm', 'Detailed booking form')}
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      {t('packageBooking.bookingMethod.form.features.availability', 'Availability checking')}
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      {t('packageBooking.bookingMethod.form.features.specialRequests', 'Special requests')}
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      {t('packageBooking.bookingMethod.form.features.instantConfirmation', 'Instant confirmation')}
                    </li>
                  </ul>
                  <Button
                    onClick={handleFormBooking}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow"
                  >
                    {t('packageBooking.bookingMethod.form.button', 'Book via Form')}
                  </Button>
                </div>

                {/* WhatsApp Booking Option */}
                <div className="border border-gray-200 rounded-2xl p-6 hover:border-green-300 transition-colors bg-white/70">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">💬</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('packageBooking.bookingMethod.whatsapp.title', 'Book via WhatsApp')}</h4>
                    <p className="text-sm text-gray-600">
                      {t('packageBooking.bookingMethod.whatsapp.description', 'Get instant assistance and personalized booking support through WhatsApp.')}
                    </p>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      {t('packageBooking.bookingMethod.whatsapp.features.instantCommunication', 'Instant communication')}
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      {t('packageBooking.bookingMethod.whatsapp.features.personalizedAssistance', 'Personalized assistance')}
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      {t('packageBooking.bookingMethod.whatsapp.features.quickResponses', 'Quick responses')}
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      {t('packageBooking.bookingMethod.whatsapp.features.flexibleArrangements', 'Flexible arrangements')}
                    </li>
                  </ul>
                  <Button onClick={handleWhatsAppBooking} variant="green" fullWidth>
                    {t('packageBooking.bookingMethod.whatsapp.button', 'Book via WhatsApp')}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Package Details */}
              <Card className="p-6 mb-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('packageBooking.sidebar.packageDetails.title', 'Package Details')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t('packageBooking.sidebar.packageDetails.duration', 'Duration')}</p>
                      <p className="text-sm text-gray-600">{t('packageBooking.sidebar.packageDetails.durationValue', '{{count}} days', { count: pkg.duration })}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t('packageBooking.sidebar.packageDetails.maxTravelers', 'Max Travelers')}</p>
                      <p className="text-sm text-gray-600">{t('packageBooking.sidebar.packageDetails.maxTravelersValue', 'Up to {{count}} people', { count: pkg.maxTravelers })}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t('packageBooking.sidebar.packageDetails.destinations', 'Destinations')}</p>
                      <p className="text-sm text-gray-600">{t('packageBooking.sidebar.packageDetails.destinationsValue', '{{count}} islands', { count: pkg.destinations?.length || 1 })}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Highlights */}
              {pkg.highlights && pkg.highlights.length > 0 && (
                <Card className="p-6 mb-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('packageBooking.sidebar.highlights.title', 'Highlights')}</h3>
                  <div className="space-y-2">
                    {pkg.highlights.slice(0, 5).map((highlight, index) => (
                      <div key={index} className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Contact Information */}
              <Card className="p-6 border border-gray-200 bg-white/80">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('packageBooking.sidebar.contactInfo.title', 'Contact Information')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{homepageContent?.settings?.contact_phone || whatsappNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{homepageContent?.settings?.contact_email || 'info@threadtravels.mv'}</span>
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
    {showBookingForm && pkg && (
      <PackageBookingForm
        packageId={pkg.id}
        packageName={getTranslatedContent('name', pkg.name)}
        packagePrice={parseFloat(pkg.price as any)}
        packageDurationDays={pkg.duration}
        onClose={() => setShowBookingForm(false)}
      />
    )}
    </>
  );
}

export default PackageBookingPage;
