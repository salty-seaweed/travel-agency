import React, { useState } from 'react';
import { CalendarIcon, UsersIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from './LoadingSpinner';
import { useNotification } from '../hooks';
import { useWhatsApp } from '../hooks/useQueries';

interface PackageBookingFormProps {
  packageId: number;
  packageName: string;
  packagePrice: number;
  packageDurationDays: number;
  onClose: () => void;
}

export function PackageBookingForm({ packageId, packageName, packagePrice, packageDurationDays, onClose }: PackageBookingFormProps) {
  const { showSuccess, showError } = useNotification();
  const { getWhatsAppUrl } = useWhatsApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    number_of_guests: 2,
    start_date: '',
    duration_days: packageDurationDays || 1,
    special_requests: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'number_of_guests' || name === 'duration_days' ? Number(value) : value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const message = `Hi! I'd like to book the package ${packageName} (ID: ${packageId}).\n\n` +
`📋 *Booking Details:*\n` +
`• Start date: ${formData.start_date || 'Flexible'}\n` +
`• Duration: ${formData.duration_days} days\n` +
`• Guests: ${formData.number_of_guests}\n` +
`• Package price (per person): $${packagePrice}\n\n` +
`👤 *Guest Information:*\n` +
`• Name: ${formData.customer_name}\n` +
`• Email: ${formData.customer_email}\n` +
`• Phone: ${formData.customer_phone}\n\n` +
`${formData.special_requests ? `📝 *Special Requests:*\n${formData.special_requests}\n\n` : ''}` +
`Please assist with availability and next steps. Thank you!`;

      const url = getWhatsAppUrl(message);
      window.open(url, '_blank');
      showSuccess('Booking request sent to WhatsApp!');
      onClose();
    } catch (err) {
      showError('Failed to send booking request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Book This Package</h3>
              <p className="text-sm text-gray-500">{packageName}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Guest Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input name="customer_name" required value={formData.customer_name} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" name="customer_email" required value={formData.customer_email} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input type="tel" name="customer_phone" required value={formData.customer_phone} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
              <select name="number_of_guests" value={formData.number_of_guests} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white">
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
              </select>
            </div>
          </div>

          {/* Dates + Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Start Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} min={getMinDate()} max={getMaxDate()} className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days) *</label>
              <select name="duration_days" value={formData.duration_days} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white">
                {[...Array(21)].map((_, i) => i+1).map(n => <option key={n} value={n}>{n} day{n>1?'s':''}</option>)}
              </select>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
            <textarea name="special_requests" value={formData.special_requests} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white" />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-400 flex items-center justify-center">
              {loading ? (<><LoadingSpinner size="sm" /><span className="ml-2">Submitting...</span></>) : 'Send to WhatsApp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PackageBookingForm;
