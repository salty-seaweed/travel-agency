import React, { useState, useEffect } from 'react';
import { CalendarIcon, UsersIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from './LoadingSpinner';
import { useNotification } from '../hooks';

interface BookingFormProps {
  propertyId: number;
  propertyName: string;
  pricePerNight: number;
  onClose: () => void;
  onBookingSuccess?: (booking: any) => void;
}

interface AvailabilityResponse {
  property_id: number;
  property_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  is_available: boolean;
  price_per_night: number;
  total_price: number;
  currency: string;
}

export function BookingForm({ propertyId, propertyName, pricePerNight, onClose, onBookingSuccess }: BookingFormProps) {
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    check_in_date: '',
    check_out_date: '',
    number_of_guests: 1,
    special_requests: ''
  });
  
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Check availability when dates change
  useEffect(() => {
    if (formData.check_in_date && formData.check_out_date) {
      checkAvailability();
    }
  }, [formData.check_in_date, formData.check_out_date]);

  const checkAvailability = async () => {
    if (!formData.check_in_date || !formData.check_out_date) return;
    
    setCheckingAvailability(true);
    try {
      const response = await fetch(
        `/api/properties/${propertyId}/availability/?check_in=${formData.check_in_date}&check_out=${formData.check_out_date}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
      } else {
        const error = await response.json();
        showError(error.error || 'Failed to check availability');
      }
    } catch (error) {
      showError('Failed to check availability');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!availability?.is_available) {
      showError('Selected dates are not available');
      return;
    }

    setLoading(true);
    try {
      // Instead of making an API call, send the booking data to WhatsApp
      const message = `Hi! I'm interested in booking ${propertyName}.

📋 *Booking Details:*
• Check-in: ${formData.check_in_date}
• Check-out: ${formData.check_out_date}
• Guests: ${formData.number_of_guests}
• Price per night: $${pricePerNight}

👤 *Guest Information:*
• Name: ${formData.customer_name}
• Email: ${formData.customer_email}
• Phone: ${formData.customer_phone}

${formData.special_requests ? `📝 *Special Requests:*\n${formData.special_requests}\n` : ''}
Please let me know if this property is available for these dates and help me with the booking process. Thank you!`;

      // Open WhatsApp with the booking information
      const cleanPhone = '+9601234567'.replace(/\D/g, '');
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      showSuccess('Booking request sent to WhatsApp! We will contact you soon.');
      onClose();
    } catch (error) {
      showError('Failed to send booking request');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Book Your Stay</h3>
              <p className="text-sm text-gray-500">{propertyName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Guest Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Guests *
                </label>
                <select
                  name="number_of_guests"
                  value={formData.number_of_guests}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Stay Dates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                     <input
                     type="date"
                     name="check_in_date"
                     value={formData.check_in_date}
                     onChange={handleInputChange}
                     min={getMinDate()}
                     max={getMaxDate()}
                     required
                     className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
                   />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                     <input
                     type="date"
                     name="check_out_date"
                     value={formData.check_out_date}
                     onChange={handleInputChange}
                     min={formData.check_in_date || getMinDate()}
                     max={getMaxDate()}
                     required
                     className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
                   />
                </div>
              </div>
            </div>
          </div>

          {/* Availability Status */}
          {checkingAvailability && (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-gray-600">Checking availability...</span>
            </div>
          )}

          {availability && !checkingAvailability && (
            <div className={`p-4 rounded-lg border ${
              availability.is_available 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center">
                {availability.is_available ? (
                  <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <XMarkIcon className="h-5 w-5 text-red-600 mr-2" />
                )}
                <span className={`font-medium ${
                  availability.is_available ? 'text-green-800' : 'text-red-800'
                }`}>
                  {availability.is_available ? 'Available' : 'Not Available'}
                </span>
              </div>
              {availability.is_available && (
                <div className="mt-2 text-sm text-green-700">
                  <p>{availability.nights} nights • ${availability.total_price} total</p>
                  <p>${availability.price_per_night} per night</p>
                </div>
              )}
            </div>
          )}

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests (Optional)
            </label>
            <textarea
              name="special_requests"
              value={formData.special_requests}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any special requests or requirements..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !availability?.is_available}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Submitting...</span>
                </>
              ) : (
                'Send to WhatsApp'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm; 