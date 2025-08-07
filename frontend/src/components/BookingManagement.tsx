import { useState, useEffect } from 'react';
import { Card, Button, LoadingSpinner } from './index';
import { useNotification } from '../hooks';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import {
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

interface Booking {
  id: number;
  property: {
    id: number;
    name: string;
    image: string;
    location: {
      island: string;
      atoll: string;
    };
  };
  check_in: string;
  check_out: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  special_requests?: string;
}

interface BookingManagementProps {
  onBookingUpdate?: () => void;
}

export function BookingManagement({ onBookingUpdate }: BookingManagementProps) {
  const { showSuccess, showError } = useNotification();
  const { isAuthenticated } = useCustomerAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('customer_token');
      const response = await fetch('http://127.0.0.1:8000/api/bookings/my-bookings/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data.results || data);
      } else {
        showError('Failed to load bookings');
      }
    } catch (error) {
      showError('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('customer_token');
      const response = await fetch(`http://127.0.0.1:8000/api/bookings/${bookingId}/cancel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showSuccess('Booking cancelled successfully');
        fetchBookings();
        onBookingUpdate?.();
      } else {
        const errorData = await response.json();
        showError(errorData.message || 'Failed to cancel booking');
      }
    } catch (error) {
      showError('Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' ? true : booking.status === filter
  );

  if (!isAuthenticated) {
    return (
      <Card className="p-6 text-center">
        <div className="text-gray-500">
          <EyeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">Please log in to view your bookings</p>
          <p className="text-sm">You need to be logged in to access your booking history.</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
          <p className="text-gray-600">Manage and track your travel bookings</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Bookings</div>
          <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All', count: bookings.length },
          { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
          { key: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
          { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
          { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No bookings found</p>
              <p className="text-sm">
                {filter === 'all' 
                  ? "You haven't made any bookings yet. Start exploring our properties!"
                  : `No ${filter} bookings found.`
                }
              </p>
            </div>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {/* Property Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={booking.property.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=150&h=100&fit=crop'}
                      alt={booking.property.name}
                      className="w-20 h-16 object-cover rounded-lg"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {booking.property.name}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {booking.property.location.island}, {booking.property.location.atoll}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Check-in</div>
                        <div className="font-medium">{formatDate(booking.check_in)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Check-out</div>
                        <div className="font-medium">{formatDate(booking.check_out)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Nights</div>
                        <div className="font-medium">{calculateNights(booking.check_in, booking.check_out)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Total Amount</div>
                        <div className="font-medium text-green-600">${booking.total_amount}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col items-end space-y-3">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1 capitalize">{booking.status}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setSelectedBooking(booking)}
                      variant="secondary"
                      size="sm"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    
                    {booking.status === 'pending' && (
                      <Button
                        onClick={() => handleCancelBooking(booking.id)}
                        variant="secondary"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Date */}
              <div className="text-sm text-gray-500">
                Booked on {formatDate(booking.created_at)}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Property Info */}
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedBooking.property.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&h=150&fit=crop'}
                    alt={selectedBooking.property.name}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedBooking.property.name}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {selectedBooking.property.location.island}, {selectedBooking.property.location.atoll}
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Booking Information</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Booking ID:</span>
                        <span className="font-medium">#{selectedBooking.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {getStatusIcon(selectedBooking.status)}
                          <span className="ml-1 capitalize">{selectedBooking.status}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Check-in:</span>
                        <span className="font-medium">{formatDate(selectedBooking.check_in)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Check-out:</span>
                        <span className="font-medium">{formatDate(selectedBooking.check_out)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nights:</span>
                        <span className="font-medium">{calculateNights(selectedBooking.check_in, selectedBooking.check_out)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Amount:</span>
                        <span className="font-medium text-green-600">${selectedBooking.total_amount}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Guest Information</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{selectedBooking.customer_email}</span>
                      </div>
                      {selectedBooking.customer_phone && (
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{selectedBooking.customer_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedBooking.special_requests && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Special Requests</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedBooking.special_requests}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    onClick={() => setSelectedBooking(null)}
                    variant="secondary"
                  >
                    Close
                  </Button>
                  {selectedBooking.status === 'pending' && (
                    <Button
                      onClick={() => {
                        handleCancelBooking(selectedBooking.id);
                        setSelectedBooking(null);
                      }}
                      variant="secondary"
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 