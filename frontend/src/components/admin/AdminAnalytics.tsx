import { useState, useEffect } from 'react';
import { Card, LoadingSpinner } from '../index';
import { useNotification } from '../../hooks';
import {
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  MapPinIcon,
  StarIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalPackages: number;
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
  averageRating: number;
  totalReviews: number;
  monthlyBookings: Array<{
    month: string;
    bookings: number;
    revenue: number;
  }>;
  topPackages: Array<{
    id: number;
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
  bookingStatuses: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  packageCategories: Array<{
    category: string;
    count: number;
    bookings: number;
  }>;
}

export function AdminAnalytics() {
  const { showError } = useNotification();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://127.0.0.1:8000/api/analytics/?time_range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        // For demo purposes, create mock data
        setAnalytics(createMockAnalytics());
      }
    } catch (error) {
      // For demo purposes, create mock data
      setAnalytics(createMockAnalytics());
    } finally {
      setIsLoading(false);
    }
  };

  const createMockAnalytics = (): AnalyticsData => ({
    totalPackages: 24,
    totalBookings: 156,
    totalRevenue: 45600,
    totalCustomers: 89,
    averageRating: 4.3,
    totalReviews: 234,
    monthlyBookings: [
      { month: 'Jan', bookings: 12, revenue: 3200 },
      { month: 'Feb', bookings: 18, revenue: 4800 },
      { month: 'Mar', bookings: 25, revenue: 6800 },
      { month: 'Apr', bookings: 22, revenue: 5900 },
      { month: 'May', bookings: 28, revenue: 7500 },
      { month: 'Jun', bookings: 31, revenue: 8400 },
    ],
    topPackages: [
      { id: 1, name: 'Luxury Island Hopping Package', bookings: 45, revenue: 12500, rating: 4.8 },
      { id: 2, name: 'Adventure Diving Package', bookings: 38, revenue: 8900, rating: 4.5 },
      { id: 3, name: 'Romantic Getaway Package', bookings: 32, revenue: 11200, rating: 4.7 },
      { id: 4, name: 'Family Fun Package', bookings: 28, revenue: 7800, rating: 4.3 },
      { id: 5, name: 'Wellness Retreat Package', bookings: 25, revenue: 9200, rating: 4.6 },
    ],
    bookingStatuses: {
      pending: 12,
      confirmed: 89,
      completed: 45,
      cancelled: 10,
    },
    packageCategories: [
      { category: 'Luxury', count: 8, bookings: 67 },
      { category: 'Adventure', count: 12, bookings: 58 },
      { category: 'Romantic', count: 4, bookings: 31 },
    ],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPinIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Packages</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalPackages}</p>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</p>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                +8% from last month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                +15% from last month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalCustomers}</p>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                +5% from last month
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Bookings</h3>
          <div className="space-y-4">
            {analytics.monthlyBookings.map((month) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{month.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-900">{month.bookings} bookings</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(month.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Booking Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
          <div className="space-y-3">
            {Object.entries(analytics.bookingStatuses).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">{status}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(count / analytics.totalBookings) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Packages */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Packages</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.topPackages.map((pkg) => (
                <tr key={pkg.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.bookings}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(pkg.revenue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">{pkg.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Package Categories Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Categories Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analytics.packageCategories.map((category) => (
            <div key={category.category} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{category.count}</div>
              <div className="text-sm text-gray-600">{category.category}</div>
              <div className="text-sm font-medium text-blue-600">{category.bookings} bookings</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <StarIcon className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.averageRating}</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <EyeIcon className="h-8 w-8 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.totalReviews}</div>
          <div className="text-sm text-gray-600">Total Reviews</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <ChartBarIcon className="h-8 w-8 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round((analytics.totalBookings / analytics.totalPackages) * 10) / 10}
          </div>
          <div className="text-sm text-gray-600">Avg Bookings per Package</div>
        </Card>
      </div>
    </div>
  );
} 