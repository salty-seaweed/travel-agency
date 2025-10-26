import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, LoadingSpinner } from './index';
import { Button } from './ui/Button';
import { useNotification } from '../hooks';
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
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { LazyImage } from './LazyImage';
import './BookingForm.css';

interface BookingFormData {
  // Step 1: Travel Details
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  
  // Step 2: Guest Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  
  // Step 3: Special Requests
  specialRequests: string;
  dietaryRequirements: string;
  roomPreferences: string;
  
  // Step 4: Review
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

const initialFormData: BookingFormData = {
  checkIn: '',
  checkOut: '',
  adults: 2,
  children: 0,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  specialRequests: '',
  dietaryRequirements: '',
  roomPreferences: '',
  agreeToTerms: false,
  subscribeToNewsletter: false,
};

export function BookingForm() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const { whatsappNumber } = useWhatsApp();
  const { data: homepageContent } = useHomepageContent();
  const [pkg, setPackage] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  // Helper function to get translated content based on current language
  const getTranslatedContent = React.useCallback((field: string, fallback: string = ''): string => {
    if (!pkg) return fallback;
    
    const currentLang = i18n.language;
    const translatedField = `${field}_${currentLang}` as keyof Package;
    
    // Check if translated version exists and is not empty
    if (pkg[translatedField] && typeof pkg[translatedField] === 'string' && pkg[translatedField].trim() !== '') {
      return pkg[translatedField] as string;
    }
    
    // Fallback to original field
    return (pkg[field as keyof Package] as string) || fallback;
  }, [pkg, i18n.language]);

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
        showError(t('bookingForm.error.loadFailed', 'Failed to load package details'));
      }
    } catch (error) {
      showError(t('bookingForm.error.loadFailed', 'Failed to load package details'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.checkIn && formData.checkOut && formData.adults > 0;
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 3:
        return true; // Optional step
      case 4:
        return formData.agreeToTerms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      showError(t('bookingForm.error.requiredFields', 'Please fill in all required fields'));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculateTotalPrice = () => {
    if (!pkg) return 0;
    const basePrice = parseFloat(pkg.price as any);
    const nights = Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return basePrice * nights * formData.adults;
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      showError(t('bookingForm.error.agreeToTerms', 'Please agree to the terms and conditions'));
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically send the booking data to your backend
      // For now, we'll simulate a successful booking
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess(t('bookingForm.success.bookingConfirmed', 'Your booking has been confirmed!'));
      navigate(`/packages/${id}`);
    } catch (error) {
      showError(t('bookingForm.error.submissionFailed', 'Failed to submit booking. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="booking-form-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="booking-form-error">
        <Card className="booking-form-card">
          <div className="booking-form-error-content">
            <XMarkIcon className="booking-form-error-icon" />
            <h2 className="booking-form-error-title">{t('bookingForm.notFound.title', 'Package Not Found')}</h2>
            <p className="booking-form-error-description">{t('bookingForm.notFound.description', "The package you're looking for doesn't exist.")}</p>
            <Button onClick={() => navigate('/packages')} variant="primary">
              {t('bookingForm.notFound.browsePackages', 'Browse Packages')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const averageRating = pkg.rating || 0;
  const reviewCount = pkg.review_count || 0;

  return (
    <div className="booking-form-container">
      {/* Header */}
      <div className="booking-form-header">
        <div className="booking-form-header-content">
          <button
            onClick={() => navigate(`/packages/${pkg.id}`)}
            className="booking-form-back-button"
          >
            <ArrowLeftIcon className="booking-form-back-icon" />
            {t('bookingForm.header.backToPackage', 'Back to Package')}
          </button>
          <h1 className="booking-form-title">{t('bookingForm.header.title', 'Book Your Stay')}</h1>
        </div>
      </div>

      <div className="booking-form-content">
        <div className="booking-form-layout">
          {/* Main Content */}
          <div className="booking-form-main">
            {/* Progress Bar */}
            <div className="booking-form-progress">
              <div className="booking-form-progress-bar">
                <div 
                  className="booking-form-progress-fill"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <div className="booking-form-progress-steps">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
                  <div 
                    key={step}
                    className={`booking-form-progress-step ${
                      step <= currentStep ? 'active' : ''
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <Card className="booking-form-step-card">
              {currentStep === 1 && (
                <div className="booking-form-step">
                  <h2 className="booking-form-step-title">{t('bookingForm.step1.title', 'When are you traveling?')}</h2>
                  <p className="booking-form-step-description">{t('bookingForm.step1.description', 'Select your travel dates and number of guests')}</p>
                  
                  <div className="booking-form-fields">
                    <div className="booking-form-field-group">
                      <label className="booking-form-label">
                        {t('bookingForm.step1.checkIn', 'Check-in Date')} *
                      </label>
                      <input
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => handleInputChange('checkIn', e.target.value)}
                        className="booking-form-input"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="booking-form-field-group">
                      <label className="booking-form-label">
                        {t('bookingForm.step1.checkOut', 'Check-out Date')} *
                      </label>
                      <input
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => handleInputChange('checkOut', e.target.value)}
                        className="booking-form-input"
                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="booking-form-field-group">
                      <label className="booking-form-label">
                        {t('bookingForm.step1.adults', 'Adults')} *
                      </label>
                      <select
                        value={formData.adults}
                        onChange={(e) => handleInputChange('adults', parseInt(e.target.value))}
                        className="booking-form-select"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="booking-form-field-group">
                      <label className="booking-form-label">
                        {t('bookingForm.step1.children', 'Children')}
                      </label>
                      <select
                        value={formData.children}
                        onChange={(e) => handleInputChange('children', parseInt(e.target.value))}
                        className="booking-form-select"
                      >
                        {Array.from({ length: 10 }, (_, i) => i).map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="booking-form-step">
                  <h2 className="booking-form-step-title">{t('bookingForm.step2.title', 'Guest Information')}</h2>
                  <p className="booking-form-step-description">{t('bookingForm.step2.description', 'Please provide your contact details')}</p>
                  
                  <div className="booking-form-fields">
                    <div className="booking-form-field-row">
                      <div className="booking-form-field-group">
                        <label className="booking-form-label">
                          {t('bookingForm.step2.firstName', 'First Name')} *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="booking-form-input"
                          placeholder={t('bookingForm.step2.firstNamePlaceholder', 'Enter your first name')}
                        />
                      </div>
                      
                      <div className="booking-form-field-group">
                        <label className="booking-form-label">
                          {t('bookingForm.step2.lastName', 'Last Name')} *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="booking-form-input"
                          placeholder={t('bookingForm.step2.lastNamePlaceholder', 'Enter your last name')}
                        />
                      </div>
                    </div>
                    
                    <div className="booking-form-field-group">
                      <label className="booking-form-label">
                        {t('bookingForm.step2.email', 'Email Address')} *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="booking-form-input"
                        placeholder={t('bookingForm.step2.emailPlaceholder', 'Enter your email address')}
                      />
                    </div>
                    
                    <div className="booking-form-field-group">
                      <label className="booking-form-label">
                        {t('bookingForm.step2.phone', 'Phone Number')} *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="booking-form-input"
                        placeholder={t('bookingForm.step2.phonePlaceholder', 'Enter your phone number')}
                      />
                    </div>
                    
                    <div className="booking-form-field-group">
                      <label className="booking-form-label">
                        {t('bookingForm.step2.country', 'Country')}
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="booking-form-select"
                      >
                        <option value="">{t('bookingForm.step2.countryPlaceholder', 'Select your country')}</option>
                        <option value="MV">Maldives</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IT">Italy</option>
                        <option value="ES">Spain</option>
                        <option value="AU">Australia</option>
                        <option value="CA">Canada</option>
                        <option value="JP">Japan</option>
                        <option value="SG">Singapore</option>
                        <option value="IN">India</option>
                        <option value="CN">China</option>
                        <option value="AE">United Arab Emirates</option>
                        <option value="SA">Saudi Arabia</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="booking-form-step">
                  <h2 className="booking-form-step-title">{t('bookingForm.step3.title', 'Special Requests')}</h2>
                  <p className="booking-form-step-description">{t('bookingForm.step3.description', 'Let us know about any special requirements or preferences')}</p>
                  
                  <div className="booking-form-fields">
                    <div className="booking-form-field-group">
                      <label className="booking-form-label">
                        {t('bookingForm.step3.specialRequests', 'Special Requests')}
                      </label>
                      <textarea
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        className="booking-form-textarea"
                        rows={4}
                        placeholder={t('bookingForm.step3.specialRequestsPlaceholder', 'Any special requests or notes for your stay...')}
                      />
                    </div>
                    
                    <div className="booking-form-field-group">
                      <label className="booking-form-label">
                        {t('bookingForm.step3.dietaryRequirements', 'Dietary Requirements')}
                      </label>
                      <textarea
                        value={formData.dietaryRequirements}
                        onChange={(e) => handleInputChange('dietaryRequirements', e.target.value)}
                        className="booking-form-textarea"
                        rows={3}
                        placeholder={t('bookingForm.step3.dietaryRequirementsPlaceholder', 'Any dietary restrictions or preferences...')}
                      />
                    </div>
                    
                    <div className="booking-form-field-group">
                      <label className="booking-form-label">
                        {t('bookingForm.step3.roomPreferences', 'Room Preferences')}
                      </label>
                      <textarea
                        value={formData.roomPreferences}
                        onChange={(e) => handleInputChange('roomPreferences', e.target.value)}
                        className="booking-form-textarea"
                        rows={3}
                        placeholder={t('bookingForm.step3.roomPreferencesPlaceholder', 'Any specific room preferences...')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="booking-form-step">
                  <h2 className="booking-form-step-title">{t('bookingForm.step4.title', 'Review & Confirm')}</h2>
                  <p className="booking-form-step-description">{t('bookingForm.step4.description', 'Please review your booking details and confirm')}</p>
                  
                  <div className="booking-form-review">
                    <div className="booking-form-review-section">
                      <h3 className="booking-form-review-title">{t('bookingForm.step4.travelDetails', 'Travel Details')}</h3>
                      <div className="booking-form-review-content">
                        <p><strong>{t('bookingForm.step4.checkIn', 'Check-in:')}</strong> {formData.checkIn}</p>
                        <p><strong>{t('bookingForm.step4.checkOut', 'Check-out:')}</strong> {formData.checkOut}</p>
                        <p><strong>{t('bookingForm.step4.guests', 'Guests:')}</strong> {formData.adults} adults, {formData.children} children</p>
                      </div>
                    </div>
                    
                    <div className="booking-form-review-section">
                      <h3 className="booking-form-review-title">{t('bookingForm.step4.guestInfo', 'Guest Information')}</h3>
                      <div className="booking-form-review-content">
                        <p><strong>{t('bookingForm.step4.name', 'Name:')}</strong> {formData.firstName} {formData.lastName}</p>
                        <p><strong>{t('bookingForm.step4.email', 'Email:')}</strong> {formData.email}</p>
                        <p><strong>{t('bookingForm.step4.phone', 'Phone:')}</strong> {formData.phone}</p>
                        {formData.country && <p><strong>{t('bookingForm.step4.country', 'Country:')}</strong> {formData.country}</p>}
                      </div>
                    </div>
                    
                    {(formData.specialRequests || formData.dietaryRequirements || formData.roomPreferences) && (
                      <div className="booking-form-review-section">
                        <h3 className="booking-form-review-title">{t('bookingForm.step4.specialRequests', 'Special Requests')}</h3>
                        <div className="booking-form-review-content">
                          {formData.specialRequests && <p><strong>{t('bookingForm.step4.specialRequests', 'Special Requests:')}</strong> {formData.specialRequests}</p>}
                          {formData.dietaryRequirements && <p><strong>{t('bookingForm.step4.dietaryRequirements', 'Dietary Requirements:')}</strong> {formData.dietaryRequirements}</p>}
                          {formData.roomPreferences && <p><strong>{t('bookingForm.step4.roomPreferences', 'Room Preferences:')}</strong> {formData.roomPreferences}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="booking-form-checkboxes">
                    <label className="booking-form-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                        className="booking-form-checkbox"
                      />
                      <span className="booking-form-checkbox-text">
                        {t('bookingForm.step4.agreeToTerms', 'I agree to the terms and conditions and privacy policy')} *
                      </span>
                    </label>
                    
                    <label className="booking-form-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.subscribeToNewsletter}
                        onChange={(e) => handleInputChange('subscribeToNewsletter', e.target.checked)}
                        className="booking-form-checkbox"
                      />
                      <span className="booking-form-checkbox-text">
                        {t('bookingForm.step4.subscribeToNewsletter', 'Subscribe to our newsletter for travel updates and offers')}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="booking-form-navigation">
                {currentStep > 1 && (
                  <Button
                    onClick={handlePrevious}
                    variant="secondary"
                    className="booking-form-button booking-form-button-secondary"
                  >
                    <ChevronLeftIcon className="booking-form-button-icon" />
                    {t('bookingForm.navigation.previous', 'Previous')}
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    variant="primary"
                    className="booking-form-button booking-form-button-primary"
                  >
                    {t('bookingForm.navigation.next', 'Next')}
                    <ChevronRightIcon className="booking-form-button-icon" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    variant="primary"
                    className="booking-form-button booking-form-button-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('bookingForm.navigation.submitting', 'Submitting...') : t('bookingForm.navigation.confirm', 'Confirm Booking')}
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="booking-form-sidebar">
            <div className="booking-form-sidebar-sticky">
              {/* Package Summary */}
              <Card className="booking-form-sidebar-card">
                <div className="booking-form-package-summary">
                  <div className="booking-form-package-image">
                    {pkg.images && pkg.images.length > 0 ? (
                      <LazyImage
                        src={pkg.images[0].image}
                        alt={getTranslatedContent('name', pkg.name)}
                        className="booking-form-package-image-content"
                      />
                    ) : (
                      <div className="booking-form-package-image-placeholder">
                        <BuildingOffice2Icon className="booking-form-package-image-icon" />
                      </div>
                    )}
                  </div>
                  
                  <div className="booking-form-package-details">
                    <h3 className="booking-form-package-name">{getTranslatedContent('name', pkg.name)}</h3>
                    <div className="booking-form-package-location">
                      <MapPinIcon className="booking-form-package-location-icon" />
                      {pkg.destinations?.join(', ') || t('bookingForm.package.defaultDestination', 'Maldives Paradise')}
                    </div>
                    <div className="booking-form-package-rating">
                      <div className="booking-form-package-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarSolidIcon
                            key={star}
                            className={`booking-form-package-star ${
                              star <= averageRating ? 'active' : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span className="booking-form-package-rating-text">
                        {averageRating.toFixed(1)} ({reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Price Summary */}
              <Card className="booking-form-sidebar-card">
                <h3 className="booking-form-price-title">{t('bookingForm.price.title', 'Price Summary')}</h3>
                <div className="booking-form-price-details">
                  <div className="booking-form-price-row">
                    <span>{t('bookingForm.price.basePrice', 'Base Price')}</span>
                    <span>${pkg.price}</span>
                  </div>
                  {formData.checkIn && formData.checkOut && (
                    <>
                      <div className="booking-form-price-row">
                        <span>{t('bookingForm.price.nights', 'Nights')}</span>
                        <span>{Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))}</span>
                      </div>
                      <div className="booking-form-price-row">
                        <span>{t('bookingForm.price.guests', 'Guests')}</span>
                        <span>{formData.adults + formData.children}</span>
                      </div>
                    </>
                  )}
                  <div className="booking-form-price-total">
                    <span>{t('bookingForm.price.total', 'Total')}</span>
                    <span>${calculateTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="booking-form-sidebar-card">
                <h3 className="booking-form-contact-title">{t('bookingForm.contact.title', 'Need Help?')}</h3>
                <div className="booking-form-contact-info">
                  <div className="booking-form-contact-item">
                    <PhoneIcon className="booking-form-contact-icon" />
                    <span>{homepageContent?.settings?.contact_phone || whatsappNumber}</span>
                  </div>
                  <div className="booking-form-contact-item">
                    <EnvelopeIcon className="booking-form-contact-icon" />
                    <span>{homepageContent?.settings?.contact_email || 'info@threadtravels.com'}</span>
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

export default BookingForm;