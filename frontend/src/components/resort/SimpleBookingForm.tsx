import React, { useState } from 'react';
import { XMarkIcon, PhoneIcon, EnvelopeIcon, GiftIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../../hooks';
import { useTranslation } from '../../i18n';
import { useWhatsApp } from '../../hooks/useQueries';
import { useHomepageContent } from '../../hooks/useQueries';
import { whatsappBooking } from '../../services/whatsapp-booking';
import './SimpleBookingForm.css';

interface SimpleBookingFormProps {
  resort: any;
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleBookingForm({ resort, isOpen, onClose }: SimpleBookingFormProps) {
  const { t } = useTranslation();
  const { showError, showSuccess } = useNotification();
  const { whatsappNumber } = useWhatsApp();
  const { data: homepageContent } = useHomepageContent();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationality: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    rooms: 1,
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if resort has packaged offers
  const isPackaged = (resort as any)?.is_packaged || false;
  const packageOffer = resort.special_offers && resort.special_offers.length > 0 
    ? resort.special_offers[0] 
    : null;
  const packageDetails = packageOffer?.package_details || {};

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showError(t('simpleBooking.error.nameRequired', 'Name is required'));
      return false;
    }
    if (!formData.email.trim()) {
      showError(t('simpleBooking.error.emailRequired', 'Email is required'));
      return false;
    }
    if (!formData.phone.trim()) {
      showError(t('simpleBooking.error.phoneRequired', 'Phone is required'));
      return false;
    }
    if (!formData.nationality.trim()) {
      showError(t('simpleBooking.error.nationalityRequired', 'Nationality is required'));
      return false;
    }
    if (!formData.checkIn) {
      showError(t('simpleBooking.error.checkInRequired', 'Check-in date is required'));
      return false;
    }
    if (!formData.checkOut) {
      showError(t('simpleBooking.error.checkOutRequired', 'Check-out date is required'));
      return false;
    }
    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      showError(t('simpleBooking.error.invalidDates', 'Check-out date must be after check-in date'));
      return false;
    }
    if (!formData.rooms || formData.rooms < 1) {
      showError('Please tell us how many rooms you need.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Build WhatsApp message
      let message = '';
      
      if (isPackaged && packageOffer) {
        // Packaged resort message with package details
        message = `🏖️ *PACKAGE BOOKING - ${resort.name}*

📦 *Package Details:*
• Package: ${packageOffer.title || 'Special B2B Package'}
${packageDetails.pax_details ? `• Pax: ${packageDetails.pax_details}` : ''}
${packageDetails.stay ? `• Stay: ${packageDetails.stay}` : ''}
${packageDetails.meal_plan ? `• Meal Plan: ${packageDetails.meal_plan}` : ''}
${packageDetails.room_type ? `• Room: ${packageDetails.room_type}` : ''}
${packageDetails.transfer ? `• Transfer: ${packageDetails.transfer}` : ''}
${packageDetails.price ? `• Price: ${packageDetails.price}` : ''}

${packageDetails.additional_benefits && packageDetails.additional_benefits.length > 0 ? `✨ *Benefits:*\n${packageDetails.additional_benefits.map((b: string) => `• ${b}`).join('\n')}\n\n` : ''}👤 *Guest Info:*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Nationality: ${formData.nationality}
• Rooms: ${formData.rooms}
• Check-in: ${formData.checkIn}
• Check-out: ${formData.checkOut}
• Guests: ${formData.adults} adults, ${formData.children} children

${formData.specialRequests ? `📝 *Additional Message:*\n${formData.specialRequests}\n\n` : ''}Please confirm availability and booking. Thank you!`;
      } else {
        // Regular resort message
        message = `🏨 *${resort.name} Booking Request*

👤 *Guest Details:*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Nationality: ${formData.nationality}
• Rooms: ${formData.rooms}

📅 *Travel Dates:*
• Check-in: ${formData.checkIn}
• Check-out: ${formData.checkOut}
• Guests: ${formData.adults} adults, ${formData.children} children

${formData.specialRequests ? `💬 *Special Requests:*\n${formData.specialRequests}\n\n` : ''}Please provide availability and pricing for these dates.`;
      }

      whatsappBooking.openWhatsApp(message, whatsappNumber);
      
      showSuccess(t('simpleBooking.success.bookingSent', 'Your booking request has been sent! We will contact you soon.'));
      onClose();
    } catch (error) {
      showError(t('simpleBooking.error.submissionFailed', 'Failed to submit booking. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const message = `Hi! I'm interested in booking ${resort.name}. Please provide availability and pricing.`;
    whatsappBooking.openWhatsApp(message, whatsappNumber);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="simple-booking-overlay">
      <div className="simple-booking-modal">
        <div className="simple-booking-header">
          <h2 className="simple-booking-title">{t('simpleBooking.title', 'Book Your Stay')}</h2>
          <button
            onClick={onClose}
            className="simple-booking-close"
          >
            <XMarkIcon className="simple-booking-close-icon" />
          </button>
        </div>

        <div className="simple-booking-content">
          {/* Resort Info */}
          <div className="simple-booking-resort-info">
            <h3 className="simple-booking-resort-name">{resort.name}</h3>
            <p className="simple-booking-resort-location">{resort.full_location || `${resort.atoll}, Maldives`}</p>
            
            {/* Package Details - Show if resort is packaged */}
            {isPackaged && packageOffer && (
              <div style={{ marginTop: '16px', padding: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <GiftIcon style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                  <h4 style={{ fontWeight: 'bold', fontSize: '16px', margin: 0 }}>Special Package Available</h4>
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {packageDetails.price && (
                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                      {packageDetails.price}
                    </div>
                  )}
                  {packageDetails.stay && <div>📅 {packageDetails.stay}</div>}
                  {packageDetails.meal_plan && <div>🍽️ {packageDetails.meal_plan}</div>}
                  {packageDetails.room_type && <div>🏨 {packageDetails.room_type}</div>}
                  {packageDetails.transfer && <div>🚤 {packageDetails.transfer}</div>}
                  {packageDetails.additional_benefits && packageDetails.additional_benefits.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <strong>Benefits:</strong>
                      <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                        {packageDetails.additional_benefits.map((benefit: string, idx: number) => (
                          <li key={idx}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '12px', fontSize: '12px', fontStyle: 'italic', opacity: 0.9 }}>
                  💡 Custom packages available via WhatsApp
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="simple-booking-form">
            <div className="simple-booking-form-grid">
              <div className="simple-booking-field-group">
                <label className="simple-booking-label">
                  {t('simpleBooking.form.name', 'Full Name')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="simple-booking-input"
                  placeholder={t('simpleBooking.form.namePlaceholder', 'Enter your full name')}
                  required
                />
              </div>

              <div className="simple-booking-field-group">
                <label className="simple-booking-label">
                  {t('simpleBooking.form.email', 'Email Address')} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="simple-booking-input"
                  placeholder={t('simpleBooking.form.emailPlaceholder', 'Enter your email')}
                  required
                />
              </div>

              <div className="simple-booking-field-group">
                <label className="simple-booking-label">
                  {t('simpleBooking.form.phone', 'Phone Number')} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="simple-booking-input"
                  placeholder={t('simpleBooking.form.phonePlaceholder', 'Enter your phone number')}
                  required
                />
              </div>

              <div className="simple-booking-field-group">
                <label className="simple-booking-label">
                  {t('simpleBooking.form.nationality', 'Nationality')} *
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="simple-booking-input"
                  placeholder={t('simpleBooking.form.nationalityPlaceholder', 'Where are you travelling from?')}
                  required
                />
              </div>

              <div className="simple-booking-field-group">
                <label className="simple-booking-label">
                  {t('simpleBooking.form.checkIn', 'Check-in Date')} *
                </label>
                <input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => handleInputChange('checkIn', e.target.value)}
                  className="simple-booking-input"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="simple-booking-field-group">
                <label className="simple-booking-label">
                  {t('simpleBooking.form.checkOut', 'Check-out Date')} *
                </label>
                <input
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => handleInputChange('checkOut', e.target.value)}
                  className="simple-booking-input"
                  min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="simple-booking-field-group">
                <label className="simple-booking-label">
                  {t('simpleBooking.form.adults', 'Adults')} *
                </label>
                <select
                  value={formData.adults}
                  onChange={(e) => handleInputChange('adults', parseInt(e.target.value))}
                  className="simple-booking-select"
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="simple-booking-field-group">
                <label className="simple-booking-label">
                  {t('simpleBooking.form.children', 'Children')}
                </label>
                <select
                  value={formData.children}
                  onChange={(e) => handleInputChange('children', parseInt(e.target.value))}
                  className="simple-booking-select"
                >
                  {Array.from({ length: 10 }, (_, i) => i).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="simple-booking-field-group">
                <label className="simple-booking-label">
                  {t('simpleBooking.form.rooms', 'Number of Rooms')} *
                </label>
                <select
                  value={formData.rooms}
                  onChange={(e) => handleInputChange('rooms', parseInt(e.target.value))}
                  className="simple-booking-select"
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="simple-booking-field-group">
              <label className="simple-booking-label">
                {t('simpleBooking.form.specialRequests', 'Special Requests')}
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                className="simple-booking-textarea"
                rows={3}
                placeholder={t('simpleBooking.form.specialRequestsPlaceholder', 'Any special requests or notes...')}
              />
            </div>

            <div className="simple-booking-actions">
              <button
                type="button"
                onClick={() => {
                  // Calculate total price based on nights and room price
                  const checkIn = new Date(formData.checkIn);
                  const checkOut = new Date(formData.checkOut);
                  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                  const roomPrice = (resort as any)?.price_per_night_from || (resort as any)?.price_per_night || 200;
                  const totalAmount = roomPrice * nights * formData.rooms;
                  const description = `${resort.name} - ${nights} night(s), ${formData.rooms} room(s)`;
                  window.location.href = `/payment/checkout?amount=${totalAmount}&description=${encodeURIComponent(description)}&currency=USD&customer_name=${encodeURIComponent(formData.name)}&customer_email=${encodeURIComponent(formData.email)}&customer_phone=${encodeURIComponent(formData.phone)}`;
                }}
                className="simple-booking-button"
                style={{
                  backgroundColor: '#805AD5',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <CreditCardIcon style={{ width: '20px', height: '20px' }} />
                {t('simpleBooking.actions.payNow', 'Pay Now with BML')}
              </button>
              
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="simple-booking-button simple-booking-button-whatsapp"
              >
                {t('simpleBooking.actions.whatsapp', 'WhatsApp Direct')}
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="simple-booking-button simple-booking-button-submit"
              >
                {isSubmitting 
                  ? t('simpleBooking.actions.submitting', 'Submitting...') 
                  : t('simpleBooking.actions.submit', 'Submit Booking')
                }
              </button>
            </div>
          </form>

          {/* Contact Info */}
          <div className="simple-booking-contact">
            <h4 className="simple-booking-contact-title">{t('simpleBooking.contact.title', 'Need Help?')}</h4>
            <div className="simple-booking-contact-info">
              <div className="simple-booking-contact-item">
                <PhoneIcon className="simple-booking-contact-icon" />
                <span>{homepageContent?.settings?.contact_phone || whatsappNumber}</span>
              </div>
              <div className="simple-booking-contact-item">
                <EnvelopeIcon className="simple-booking-contact-icon" />
                <span>{homepageContent?.settings?.contact_email || 'info@threadtravels.com'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleBookingForm;