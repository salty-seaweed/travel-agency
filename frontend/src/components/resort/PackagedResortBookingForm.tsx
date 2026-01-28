import React, { useState } from 'react';
import { XMarkIcon, GiftIcon, CheckCircleIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { whatsappBooking } from '../../services/whatsapp-booking';
import { useWhatsApp } from '../../hooks/useQueries';
import { Resort } from '../../types';

interface PackagedResortBookingFormProps {
  resort: Resort;
  isOpen: boolean;
  onClose: () => void;
}

export function PackagedResortBookingForm({ resort, isOpen, onClose }: PackagedResortBookingFormProps) {
  const { whatsappNumber } = useWhatsApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    adults: '2',
    children: '1',
    message: '',
  });

  // Extract package details from special_offers
  const packageOffer = resort.special_offers && resort.special_offers.length > 0 
    ? resort.special_offers[0] 
    : null;
  
  const packageDetails = packageOffer?.package_details || {};
  const packagePrice = packageDetails.price || '';
  const packageBenefits = packageDetails.additional_benefits || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create detailed WhatsApp message with package info
    const bookingMessage = `🏖️ *PACKAGE BOOKING REQUEST - ${resort.name}*

📦 *Package Details:*
• Package: ${packageOffer?.title || 'Special B2B Package'}
• Pax: ${packageDetails.pax_details || '2 adults + 1 child'}
• Stay: ${packageDetails.stay || '4 nights'}
• Meal Plan: ${packageDetails.meal_plan || 'All-inclusive'}
• Room Type: ${packageDetails.room_type || 'Water Bungalow'}
• Transfer: ${packageDetails.transfer || 'Included'}
• Price: ${packagePrice}

👤 *Guest Information:*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Check-in Date: ${formData.checkIn}
• Guests: ${formData.adults} adults, ${formData.children} children

${packageBenefits.length > 0 ? `✨ *Additional Benefits:*\n${packageBenefits.map(b => `• ${b}`).join('\n')}\n\n` : ''}${formData.message ? `📝 *Additional Message:*\n${formData.message}\n\n` : ''}Please confirm availability and booking process. Thank you!`;

    // Open WhatsApp with pre-filled message
    whatsappBooking.openWhatsApp(bookingMessage, whatsappNumber);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Center modal */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold">Package Booking - {resort.name}</h2>
              <p className="text-blue-100 text-sm mt-1">Exclusive B2B Package Deal</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Package Details */}
              <div className="lg:sticky lg:top-20">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  {/* Package Header */}
                  <div className="flex items-start mb-4">
                    <GiftIcon className="h-8 w-8 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {packageOffer?.title || 'Special B2B Package'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {packageOffer?.description || 'Exclusive B2B package for families and couples'}
                      </p>
                    </div>
                  </div>

                  {/* Package Price */}
                  <div className="bg-white rounded-lg p-4 mb-4 border-2 border-blue-200">
                    <div className="text-sm text-gray-600 mb-1">Package Price</div>
                    <div className="text-4xl font-bold text-blue-600">{packagePrice}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {packageDetails.currency || 'USD'} • Valid until {packageOffer?.valid_until || '2025-12-31'}
                    </div>
                  </div>

                  {/* Package Details */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Package Includes:</h4>
                    
                    {packageDetails.pax_details && (
                      <div className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Pax Details</div>
                          <div className="text-sm text-gray-600">{packageDetails.pax_details}</div>
                        </div>
                      </div>
                    )}

                    {packageDetails.stay && (
                      <div className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Stay Duration</div>
                          <div className="text-sm text-gray-600">{packageDetails.stay}</div>
                        </div>
                      </div>
                    )}

                    {packageDetails.meal_plan && (
                      <div className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Meal Plan</div>
                          <div className="text-sm text-gray-600">{packageDetails.meal_plan}</div>
                        </div>
                      </div>
                    )}

                    {packageDetails.room_type && (
                      <div className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Room Type</div>
                          <div className="text-sm text-gray-600">{packageDetails.room_type}</div>
                        </div>
                      </div>
                    )}

                    {packageDetails.transfer && (
                      <div className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Transfer</div>
                          <div className="text-sm text-gray-600">{packageDetails.transfer}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Benefits */}
                  {packageBenefits.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-2">✨ Additional Benefits:</h4>
                      <ul className="space-y-2">
                        {packageBenefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Custom Booking Note */}
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      💡 <strong>Custom Bookings Available:</strong> Contact us directly on WhatsApp to customize your package or discuss alternative options.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Form */}
              <div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email and Phone - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+960 XXX XXXX"
                        />
                      </div>
                    </div>

                    {/* Check-in Date */}
                    <div>
                      <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Check-in Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="checkIn"
                        required
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Guests - Side by Side */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
                          Adults <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="adults"
                          value={formData.adults}
                          onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
                          Children
                        </label>
                        <select
                          id="children"
                          value={formData.children}
                          onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {[0, 1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Any special requests or questions..."
                      />
                    </div>

                    {/* Pay Now Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.checkIn) {
                          alert('Please select a check-in date first');
                          return;
                        }
                        // Extract price from package price string (e.g., "$1,500" -> 1500)
                        const priceStr = packagePrice.replace(/[^0-9.]/g, '');
                        const amount = parseFloat(priceStr) || 0;
                        if (amount === 0) {
                          alert('Package price not available. Please contact us via WhatsApp.');
                          return;
                        }
                        const description = `${resort.name} - ${packageOffer?.title || 'Package Booking'}`;
                        window.location.href = `/payment/checkout?amount=${amount}&description=${encodeURIComponent(description)}&currency=USD&customer_name=${encodeURIComponent(formData.name)}&customer_email=${encodeURIComponent(formData.email)}&customer_phone=${encodeURIComponent(formData.phone)}`;
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mb-3"
                    >
                      <CreditCardIcon className="h-5 w-5" />
                      Pay Now with BML
                    </button>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Send Booking Request via WhatsApp
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      By submitting this form, you agree to our terms and conditions. We'll contact you shortly to confirm your booking.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}