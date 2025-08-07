import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from '../index';
import { useNotification } from '../../hooks';
import { apiGet } from '../../api';
import type { DashboardStats, Review } from '../../types';
import {
  BuildingOffice2Icon,
  GiftIcon,
  StarIcon,
  ChartBarIcon,
  PlusIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  EyeIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { notification, showError } = useNotification();
  const [stats, setStats] = useState<DashboardStats>({ properties: 0, packages: 0, reviews: 0 });
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [properties, packages, reviews, analyticsData] = await Promise.all([
          apiGet('/properties/'),
          apiGet('/packages/'),
          apiGet('/reviews/?ordering=-created_at&limit=5'),
          apiGet('/analytics/'),
        ]);
        
        setStats({ 
          properties: properties.count || properties.length, 
          packages: packages.count || packages.length, 
          reviews: reviews.count || reviews.length 
        });
        setRecentReviews(reviews.results ? reviews.results.slice(0, 5) : reviews.slice(0, 5));
        
        // Set analytics data (mock for now)
        setAnalytics({
          totalBookings: 156,
          monthlyRevenue: 28450,
          activeUsers: 89,
          conversionRate: 12.5,
        });
      } catch (error) {
        showError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showError]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={() => navigate('/admin/properties/new')}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Property
              </Button>
              <Button variant="primary" onClick={() => navigate('/admin/packages/new')}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Package
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Properties</p>
                <p className="text-3xl font-bold text-blue-900">{stats.properties}</p>
                <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <BuildingOffice2Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Packages</p>
                <p className="text-3xl font-bold text-green-900">{stats.packages}</p>
                <p className="text-xs text-green-600 mt-1">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <GiftIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Total Reviews</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.reviews}</p>
                <p className="text-xs text-yellow-600 mt-1">+15% from last month</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-purple-900">${analytics.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-purple-600 mt-1">+23% from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Revenue chart will be displayed here</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Booking Analytics</h3>
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="font-semibold">{analytics.totalBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-semibold">{analytics.activeUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="font-semibold text-green-600">{analytics.conversionRate}%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="secondary" 
                  className="justify-start h-auto p-4 flex-col items-start gap-2 w-full"
                  onClick={() => navigate('/admin/properties')}
                >
                  <BuildingOffice2Icon className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Manage Properties</div>
                    <div className="text-xs opacity-90">Add, edit, or remove properties</div>
                  </div>
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="justify-start h-auto p-4 flex-col items-start gap-2 w-full"
                  onClick={() => navigate('/admin/packages')}
                >
                  <GiftIcon className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Manage Packages</div>
                    <div className="text-xs opacity-90">Create and manage travel packages</div>
                  </div>
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="justify-start h-auto p-4 flex-col items-start gap-2 w-full"
                  onClick={() => navigate('/admin/reviews')}
                >
                  <StarIcon className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Review Management</div>
                    <div className="text-xs opacity-90">Moderate customer reviews</div>
                  </div>
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="justify-start h-auto p-4 flex-col items-start gap-2 w-full"
                  onClick={() => navigate('/admin/amenities-types-locations')}
                >
                  <WrenchScrewdriverIcon className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Settings</div>
                    <div className="text-xs opacity-90">System configuration</div>
                  </div>
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Reviews */}
          <Card className="lg:col-span-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Reviews</h3>
                <Button variant="secondary" size="sm" onClick={() => navigate('/admin/reviews')}>
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentReviews.length > 0 ? (
                  recentReviews.map((review) => (
                    <div key={review.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <StarIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{review.customer_name}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{review.property_name}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <StarIcon 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 