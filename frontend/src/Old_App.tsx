import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import './App.css'
import { apiGet, apiPost, apiPut, apiDelete, apiUpload, isAuthenticated, logout } from './api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Select from 'react-select';
import {
  HomeIcon, BuildingOffice2Icon, GiftIcon, StarIcon, WrenchScrewdriverIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, PencilIcon, TrashIcon, PhotoIcon, MagnifyingGlassIcon, CheckCircleIcon, ExclamationTriangleIcon, ChartBarIcon, UsersIcon, CalendarIcon, CurrencyDollarIcon, EyeIcon, PlusIcon, FunnelIcon, ArrowDownTrayIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon, MapPinIcon
} from '@heroicons/react/24/outline';

// Fix default marker icon for leaflet in React
if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default) {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
}

// Enhanced Notification component with better styling
function Notification({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'warning' | 'info', onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="h-5 w-5" />;
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'info': return <CheckCircleIcon className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border max-w-sm transition-all duration-300 ${getStyles()}`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-auto opacity-70 hover:opacity-100 transition-opacity">
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Loading Spinner component
function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
    </div>
  );
}

// Enhanced Card component
function Card({ children, className = '', ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

// Enhanced Button component
function Button({ children, variant = 'primary', size = 'md', className = '', ...props }: { children: React.ReactNode, variant?: 'primary' | 'secondary' | 'danger' | 'success', size?: 'sm' | 'md' | 'lg', className?: string, [key: string]: any }) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Maldives Travel Agency</h1>
        <p className="text-xl text-gray-600">Welcome to paradise!</p>
      </div>
    </div>
  );
}

function PropertyList() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Property Listings</h2>
        <p className="text-lg text-gray-600">Browse all properties here.</p>
      </div>
    </div>
  );
}

function PropertyDetail() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Property Detail</h2>
        <p className="text-lg text-gray-600">Details for a selected property.</p>
      </div>
    </div>
  );
}

// Enhanced Admin Login with better styling
// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setIsLoading(false);
      
      if (!authenticated) {
        // Clear any stale tokens
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirects if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuth) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Invalid username or password');
        } else if (res.status === 429) {
          throw new Error('Too many login attempts. Please try again later.');
        } else {
          throw new Error('Login failed. Please try again.');
        }
      }
      
      const data = await res.json();
      
      // Validate response structure
      if (!data.access || !data.refresh) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      
      // Redirect to dashboard
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <BuildingOffice2Icon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h2>
            <p className="text-gray-600">Access your dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

// Enhanced Admin Dashboard with better stats and layout
function AdminDashboard() {
  const access = localStorage.getItem('access');
  const navigate = useNavigate();
  const [stats, setStats] = useState({ properties: 0, packages: 0, reviews: 0 });
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(() => {
    if (!access) return;
    
    const fetchData = async () => {
      try {
        const [properties, packages, reviews] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/properties/', { headers: { Authorization: `Bearer ${access}` } }).then(r => r.json()),
          fetch('http://127.0.0.1:8000/api/packages/', { headers: { Authorization: `Bearer ${access}` } }).then(r => r.json()),
          fetch('http://127.0.0.1:8000/api/reviews/?ordering=-created_at&limit=5', { headers: { Authorization: `Bearer ${access}` } }).then(r => r.json()),
        ]);
        
        setStats({ 
          properties: properties.count || properties.length, 
          packages: packages.count || packages.length, 
          reviews: reviews.count || reviews.length 
        });
        setRecentReviews(reviews.results ? reviews.results.slice(0, 5) : reviews.slice(0, 5));
      } catch (error) {
        setNotification({ message: 'Failed to load dashboard data', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [access]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BuildingOffice2Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">Welcome back, Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-700">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Properties</p>
                <p className="text-3xl font-bold text-blue-900">{stats.properties}</p>
                <p className="text-xs text-blue-600 mt-1">Active listings</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <BuildingOffice2Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Total Packages</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.packages}</p>
                <p className="text-xs text-emerald-600 mt-1">Available packages</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <GiftIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Total Reviews</p>
                <p className="text-3xl font-bold text-amber-900">{stats.reviews}</p>
                <p className="text-xs text-amber-600 mt-1">Customer feedback</p>
              </div>
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Rating</p>
                <p className="text-3xl font-bold text-purple-900">4.8</p>
                <p className="text-xs text-purple-600 mt-1">Out of 5 stars</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Reviews Section */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <StarIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Recent Reviews</h3>
                <p className="text-sm text-gray-600">Latest customer feedback</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate('/admin/reviews')}>
              View All
            </Button>
          </div>

          {recentReviews.length === 0 ? (
            <div className="text-center py-12">
              <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent reviews</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReviews.map((review, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-amber-100 rounded-full flex items-center justify-center text-sm font-bold text-amber-700 border border-amber-200">
                    {review.name ? review.name[0].toUpperCase() : 'A'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{review.name || 'Anonymous'}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">• Property {review.property}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      <ClockIcon className="h-3 w-3 inline mr-1" />
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
              <p className="text-gray-600">Common tasks and shortcuts</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="primary" 
              className="justify-start h-auto p-4 flex-col items-start gap-2"
              onClick={() => navigate('/admin/properties')}
            >
              <PlusIcon className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Add Property</div>
                <div className="text-xs opacity-90">Create new listing</div>
              </div>
            </Button>
            <Button 
              variant="secondary" 
              className="justify-start h-auto p-4 flex-col items-start gap-2"
              onClick={() => navigate('/admin/packages')}
            >
              <GiftIcon className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Create Package</div>
                <div className="text-xs opacity-90">Build travel package</div>
              </div>
            </Button>
            <Button 
              variant="secondary" 
              className="justify-start h-auto p-4 flex-col items-start gap-2"
              onClick={() => navigate('/admin/reviews')}
            >
              <StarIcon className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">View Reviews</div>
                <div className="text-xs opacity-90">Customer feedback</div>
              </div>
            </Button>
            <Button 
              variant="secondary" 
              className="justify-start h-auto p-4 flex-col items-start gap-2"
              onClick={() => navigate('/admin/amenities-types-locations')}
            >
              <WrenchScrewdriverIcon className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Settings</div>
                <div className="text-xs opacity-90">System configuration</div>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function LocationMapPicker({ lat, lng, onChange }: { lat: number, lng: number, onChange: (lat: number, lng: number) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  function LocationMarker() {
    useMapEvents({
      click(e: any) {
        onChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return <Marker position={[lat, lng]} />;
  }

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Using OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=mv`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocation(searchQuery);
  };

  const handleLocationSelect = (result: any) => {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    onChange(newLat, newLng);
    setSearchQuery(result.display_name);
    setShowSearchResults(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      searchLocation(query);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for a location in Maldives..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            {isSearching ? '...' : 'Search'}
          </button>
        </form>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(result)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="font-medium text-gray-800">{result.display_name.split(',')[0]}</div>
                <div className="text-sm text-gray-500">{result.display_name}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative">
        <MapContainer 
          center={[lat, lng] as [number, number]} 
          zoom={7} 
          style={{ height: 300, width: '100%' }}
          className="rounded-lg border border-gray-200"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>
        
        {/* Coordinates Display */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow text-sm">
          <div className="font-mono text-gray-700">
            <div>Lat: {lat.toFixed(6)}</div>
            <div>Lng: {lng.toFixed(6)}</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">How to use:</p>
        <ul className="space-y-1">
          <li>• Search for a location using the search bar above</li>
          <li>• Click on the map to manually set coordinates</li>
          <li>• Selected coordinates will be saved automatically</li>
        </ul>
      </div>
    </div>
  );
}
function PropertyForm({ onClose, onSave, property, types, locations, amenities }: any) {
  const [form, setForm] = useState<any>(property || {
    name: '', description: '', property_type: '', location: '', price_per_night: '', whatsapp_number: '', amenities: []
  });
  const [saving, setSaving] = useState(false);
  // Track selected location's lat/lng for map
  const selectedLocation = locations.find((l: any) => l.id === form.location);
  const [lat, setLat] = useState(selectedLocation ? selectedLocation.latitude : 3.2028);
  const [lng, setLng] = useState(selectedLocation ? selectedLocation.longitude : 73.2207);
  
  useEffect(() => {
    if (selectedLocation) {
      setLat(selectedLocation.latitude);
      setLng(selectedLocation.longitude);
    }
  }, [form.location]);
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
  };
  
  const handleAmenityChange = (id: number) => {
    setForm((f: any) => ({ 
      ...f, 
      amenities: f.amenities.includes(id) 
        ? f.amenities.filter((a: number) => a !== id) 
        : [...f.amenities, id] 
    }));
  };
  
  const handleMapChange = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    // Update the selected location's lat/lng in the locations array
    if (form.location) {
      const idx = locations.findIndex((l: any) => l.id === form.location);
      if (idx !== -1) {
        locations[idx].latitude = newLat;
        locations[idx].longitude = newLng;
      }
    }
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    // If location is selected, update its lat/lng before saving
    let updatedForm = { ...form };
    if (form.location) {
      updatedForm.location = form.location;
      // Attach lat/lng to location if changed
      updatedForm.location_latitude = lat;
      updatedForm.location_longitude = lng;
    }
    await onSave(updatedForm);
    setSaving(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{property ? 'Edit' : 'Add'} Property</h3>
            <p className="text-gray-600 mt-1">Fill in the property details below</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Name *</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Enter property name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  placeholder="Enter property description" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
                  rows={4}
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type *</label>
                <select 
                  name="property_type" 
                  value={form.property_type} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  required
                >
                  <option value="">Select Property Type</option>
                  {types.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <select 
                  name="location" 
                  value={form.location} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map((l: any) => <option key={l.id} value={l.id}>{l.island}</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Night *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      name="price_per_night" 
                      value={form.price_per_night} 
                      onChange={handleChange} 
                      placeholder="0.00" 
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      required 
                      type="number" 
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number *</label>
                  <input 
                    name="whatsapp_number" 
                    value={form.whatsapp_number} 
                    onChange={handleChange} 
                    placeholder="+960 744 1097" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {amenities.map((a: any) => (
                    <label key={a.id} className="flex items-center space-x-3 text-sm cursor-pointer hover:bg-white p-2 rounded transition-colors">
                      <input 
                        type="checkbox" 
                        checked={form.amenities.includes(a.id)} 
                        onChange={() => handleAmenityChange(a.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700 font-medium">{a.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Select all amenities available at this property</p>
              </div>
            </div>
            
            {/* Right Column - Map and Coordinates */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Location Map</label>
                {form.location ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <LocationMapPicker lat={lat} lng={lng} onChange={handleMapChange} />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Select a location first</p>
                    <p className="text-gray-500 text-sm mt-1">Choose a location to set coordinates on the map</p>
                  </div>
                )}
              </div>
              
              {form.location && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
                    <input 
                      name="latitude" 
                      value={lat} 
                      onChange={e => { setLat(Number(e.target.value)); }} 
                      placeholder="Latitude" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      type="number" 
                      step="any" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
                    <input 
                      name="longitude" 
                      value={lng} 
                      onChange={e => { setLng(Number(e.target.value)); }} 
                      placeholder="Longitude" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      type="number" 
                      step="any" 
                      required 
                    />
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPinIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Location Tips</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Click on the map to set exact coordinates</li>
                      <li>• Use the search bar to find specific locations</li>
                      <li>• Coordinates help guests find your property easily</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={saving}
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  {property ? 'Update Property' : 'Create Property'}
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              <XMarkIcon className="h-5 w-5 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
function PropertyImages({ propertyId, onClose }: { propertyId: number, onClose: () => void }) {
  const [images, setImages] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const access = localStorage.getItem('access');
  
  useEffect(() => {
    apiGet(`/property-images/?property=${propertyId}`).then(data => {
      setImages(data.results || data);
      setLoading(false);
    }).catch(() => {
      setImages([]);
      setLoading(false);
    });
  }, [propertyId]);
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('property', propertyId.toString());
      formData.append('image', file);
      await apiUpload('/property-images/', formData);
      setFile(null);
      // Refresh images
      const data = await apiGet(`/property-images/?property=${propertyId}`);
      setImages(data.results || data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleDelete = async (id: number) => {
    try {
      await apiDelete(`/property-images/${id}/`);
      setImages(imgs => imgs.filter(img => img.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Manage Property Images</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleUpload} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <Button 
                type="submit" 
                variant="primary"
                disabled={!file || uploading}
              >
                {uploading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Image
                  </>
                )}
              </Button>
            </div>
            {file && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </form>
          
          {loading ? (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" />
              <p className="text-gray-500 mt-2">Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <PhotoIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No images uploaded yet</p>
              <p className="text-sm">Upload images to showcase this property</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img.id} className="relative group">
                  <img 
                    src={img.image} 
                    alt="Property" 
                    className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                    <button 
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(img.id)}
                      title="Delete image"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PackageImages({ packageId, onClose }: { packageId: number, onClose: () => void }) {
  const [images, setImages] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const access = localStorage.getItem('access');
  
  useEffect(() => {
    apiGet(`/package-images/?package=${packageId}`).then(data => {
      setImages(data.results || data);
      setLoading(false);
    }).catch(() => {
      setImages([]);
      setLoading(false);
    });
  }, [packageId]);
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('package', packageId.toString());
      formData.append('image', file);
      await apiUpload('/package-images/', formData);
      setFile(null);
      // Refresh images
      const data = await apiGet(`/package-images/?package=${packageId}`);
      setImages(data.results || data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleDelete = async (id: number) => {
    try {
      await apiDelete(`/package-images/${id}/`);
      setImages(imgs => imgs.filter(img => img.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Manage Package Images</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleUpload} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50" 
              disabled={!file || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <PhotoIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No images uploaded yet</p>
            <p className="text-sm">Upload images to showcase this package</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(img => (
              <div key={img.id} className="relative group">
                <img 
                  src={img.image} 
                  alt="Package" 
                  className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(img.id)}
                    title="Delete image"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
function AdminProperties() {
  const access = localStorage.getItem('access');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProperty, setEditProperty] = useState<any>(null);
  const [types, setTypes] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [showImages, setShowImages] = useState<number|null>(null);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  useEffect(() => {
    if (!access) return;
    setLoading(true);
    Promise.all([
      apiGet('/properties/'),
      apiGet('/property-types/'),
      apiGet('/locations/'),
      apiGet('/amenities/'),
    ]).then(([props, types, locs, ams]) => {
      setProperties(props.results || props);
      setTypes(types.results || types);
      setLocations(locs.results || locs);
      setAmenities(ams.results || ams);
      setLoading(false);
    }).catch(() => setError('Failed to load properties.'));
  }, [access]);
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await apiDelete(`/properties/${id}/`);
      setProperties(props => props.filter(p => p.id !== id));
      setNotification({ message: 'Property deleted successfully', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to delete property', type: 'error' });
    }
  };
  
  const handleSave = async (form: any) => {
    try {
      if (editProperty) {
        await apiPut(`/properties/${editProperty.id}/`, form);
        setProperties(props => props.map(p => p.id === editProperty.id ? { ...p, ...form } : p));
        setNotification({ message: 'Property updated successfully', type: 'success' });
      } else {
        const newProp = await apiPost('/properties/', form);
        setProperties(props => [...props, newProp]);
        setNotification({ message: 'Property created successfully', type: 'success' });
      }
      setShowForm(false);
      setEditProperty(null);
    } catch (error) {
      setNotification({ message: 'Failed to save property', type: 'error' });
    }
  };
  
  const handleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map(p => p.id));
    }
  };
  
  const handleSelectProperty = (id: number) => {
    setSelectedProperties(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };
  
  const handleBulkAction = async () => {
    if (!bulkAction || selectedProperties.length === 0) return;
    
    if (bulkAction === 'delete') {
      if (!window.confirm(`Delete ${selectedProperties.length} selected properties?`)) return;
      
      try {
        await Promise.all(selectedProperties.map(id => apiDelete(`/properties/${id}/`)));
        setProperties(props => props.filter(p => !selectedProperties.includes(p.id)));
        setSelectedProperties([]);
        setBulkAction('');
        setNotification({ message: `${selectedProperties.length} properties deleted successfully`, type: 'success' });
      } catch (error) {
        setNotification({ message: 'Failed to delete some properties', type: 'error' });
      }
    }
  };
  
  // Filter and sort properties
  const filteredProperties = properties
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || p.property_type?.id.toString() === filterType;
      const matchesLocation = !filterLocation || p.location?.id.toString() === filterLocation;
      
      return matchesSearch && matchesType && matchesLocation;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = parseFloat(a.price_per_night) || 0;
          bValue = parseFloat(b.price_per_night) || 0;
          break;
        case 'type':
          aValue = a.property_type?.name?.toLowerCase() || '';
          bValue = b.property_type?.name?.toLowerCase() || '';
          break;
        case 'location':
          aValue = a.location?.island?.toLowerCase() || '';
          bValue = b.location?.island?.toLowerCase() || '';
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterLocation('');
    setSortBy('name');
    setSortOrder('asc');
  };
  
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Description', 'Type', 'Location', 'Price per Night', 'WhatsApp Number'];
    const csvContent = [
      headers.join(','),
      ...filteredProperties.map(p => [
        p.id,
        `"${p.name}"`,
        `"${p.description || ''}"`,
        `"${p.property_type?.name || ''}"`,
        `"${p.location?.island || ''}"`,
        p.price_per_night,
        p.whatsapp_number
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `properties_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Properties</h1>
            <p className="text-gray-600">Manage your property listings and bookings</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <Button
              onClick={() => { setEditProperty(null); setShowForm(true); }}
              className="justify-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Property
            </Button>
            {selectedProperties.length > 0 && (
              <Button
                variant="danger"
                onClick={handleBulkAction}
                className="justify-center"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete Selected ({selectedProperties.length})
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Filter Bar */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Types</option>
                {types.map((type: any) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Locations</option>
                {locations.map((location: any) => (
                  <option key={location.id} value={location.id}>{location.island}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="type">Type</option>
                <option value="location">Location</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                <FunnelIcon className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
              <Button variant="secondary" size="sm" onClick={exportToCSV}>
                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {filteredProperties.length} of {properties.length} properties
              </div>
            </div>
          </div>
        </Card>

        {/* Bulk Selection Header */}
        {selectedProperties.length > 0 && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedProperties.length === filteredProperties.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-blue-900">
                  {selectedProperties.length} property{selectedProperties.length !== 1 ? 'ies' : 'y'} selected
                </span>
              </div>
              <div className="flex gap-2">
                <select 
                  value={bulkAction} 
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose action...</option>
                  <option value="delete">Delete Selected</option>
                </select>
                <Button variant="danger" size="sm" onClick={handleBulkAction} disabled={!bulkAction}>
                  Apply
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setSelectedProperties([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Properties Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => handleSelectProperty(property.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-500">#{property.id}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => { setEditProperty(property); setShowForm(true); }}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(property.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{property.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Price</span>
                    <span className="font-semibold text-green-600">${property.price_per_night?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Type</span>
                    <span className="text-sm font-medium text-gray-700">{property.property_type?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Location</span>
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" />
                      {property.location?.island || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowImages(property.id)}
                  >
                    <PhotoIcon className="h-4 w-4 mr-1" />
                    Images
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => { setEditProperty(property); setShowForm(true); }}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedProperties.length === filteredProperties.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedProperties.includes(property.id)}
                          onChange={() => handleSelectProperty(property.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{property.name}</div>
                          <div className="text-sm text-gray-500">#{property.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {property.property_type?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {property.location?.island || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${property.price_per_night?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowImages(property.id)}
                          >
                            <PhotoIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => { setEditProperty(property); setShowForm(true); }}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {filteredProperties.length === 0 && (
          <Card className="text-center py-12">
            <BuildingOffice2Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <Button onClick={() => { setEditProperty(null); setShowForm(true); }}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Your First Property
            </Button>
          </Card>
        )}
      </div>

      {showForm && (
        <PropertyForm
          onClose={() => { setShowForm(false); setEditProperty(null); }}
          onSave={handleSave}
          property={editProperty}
          types={types}
          locations={locations}
          amenities={amenities}
        />
      )}
      {showImages && (
        <PropertyImages
          propertyId={showImages}
          onClose={() => setShowImages(null)}
        />
      )}
    </div>
  );
}
// --- AdminPackages ---
function PackageForm({ onClose, onSave, pkg, properties }: any) {
  const [form, setForm] = useState<any>(pkg || {
    name: '', description: '', properties: [], price: '', is_featured: false, start_date: '', end_date: ''
  });
  const [saving, setSaving] = useState(false);
  
  // Convert properties to react-select format
  const propertyOptions = properties.map((p: any) => ({
    value: p.id,
    label: `${p.name} ($${p.price_per_night}/night)`
  }));
  
  // Get selected properties for react-select
  const selectedProperties = propertyOptions.filter((option: any) => 
    form.properties.includes(option.value)
  );
  
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((f: any) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handlePropertyChange = (selectedOptions: any) => {
    const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    setForm((f: any) => ({ ...f, properties: selectedIds }));
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-gray-800">{pkg ? 'Edit' : 'Add'} Package</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="Enter package name" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Enter package description" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              rows={3}
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input 
              name="price" 
              value={form.price} 
              onChange={handleChange} 
              placeholder="Enter package price" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
              type="number" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Properties</label>
            <Select
              isMulti
              value={selectedProperties}
              onChange={handlePropertyChange}
              options={propertyOptions}
              placeholder="Search and select properties..."
              className="text-sm"
              classNamePrefix="select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: '#d1d5db',
                  '&:hover': { borderColor: '#3b82f6' },
                  '&:focus-within': { borderColor: '#3b82f6', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)' }
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
                  color: state.isSelected ? 'white' : '#374151'
                })
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Select multiple properties to include in this package</p>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              name="is_featured" 
              checked={form.is_featured} 
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Featured Package</label>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input 
                name="start_date" 
                value={form.start_date} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                type="date" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input 
                name="end_date" 
                value={form.end_date} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                type="date" 
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button 
            type="submit" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors" 
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Package'}
          </button>
          <button 
            type="button" 
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors" 
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
function AdminPackages() {
  const access = localStorage.getItem('access');
  const [packages, setPackages] = useState<any[]>([]);
  const [allPackages, setAllPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editPackage, setEditPackage] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [showImages, setShowImages] = useState<number|null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFeatured, setFilterFeatured] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  useEffect(() => {
    if (!access) return;
    setLoading(true);
    Promise.all([
      apiGet('/packages/'),
      apiGet('/properties/'),
    ]).then(([pkgs, props]) => {
      const packagesData = pkgs.results || pkgs;
      setAllPackages(packagesData);
      setPackages(packagesData);
      setProperties(props.results || props);
      setLoading(false);
    }).catch(() => setError('Failed to load packages.'));
  }, [access]);

  // Filter and sort packages
  useEffect(() => {
    let filtered = [...allPackages];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Featured filter
    if (filterFeatured !== '') {
      filtered = filtered.filter(p => p.is_featured.toString() === filterFeatured);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setPackages(filtered);
  }, [allPackages, searchTerm, filterFeatured, sortBy, sortOrder]);
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await apiDelete(`/packages/${id}/`);
      setAllPackages(pkgs => pkgs.filter(p => p.id !== id));
      setNotification({ message: 'Package deleted successfully', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to delete package', type: 'error' });
    }
  };
  
  const handleSave = async (form: any) => {
    try {
      const data = { ...form, properties: form.properties };
      if (editPackage) {
        await apiPut(`/packages/${editPackage.id}/`, data);
        setAllPackages(pkgs => pkgs.map(p => p.id === editPackage.id ? { ...p, ...form } : p));
        setNotification({ message: 'Package updated successfully', type: 'success' });
      } else {
        const newPkg = await apiPost('/packages/', data);
        setAllPackages(pkgs => [...pkgs, newPkg]);
        setNotification({ message: 'Package added successfully', type: 'success' });
      }
      setShowForm(false);
      setEditPackage(null);
    } catch (error) {
      setNotification({ message: 'Failed to save package', type: 'error' });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterFeatured('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const getStats = () => {
    const total = allPackages.length;
    const featured = allPackages.filter(p => p.is_featured).length;
    const totalValue = allPackages.reduce((sum, p) => sum + (p.price || 0), 0);
    const avgPrice = total > 0 ? (totalValue / total).toFixed(0) : '0';
    
    return { total, featured, totalValue, avgPrice };
  };

  const stats = getStats();
  
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-12">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Travel Packages</h2>
              <p className="text-gray-600">Create and manage travel packages for your customers</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <Button 
                variant="primary"
                onClick={() => { setEditPackage(null); setShowForm(true); }}
                className="flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Package
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Packages</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <GiftIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Featured</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.featured}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Value</p>
                <p className="text-3xl font-bold text-purple-900">${stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Price</p>
                <p className="text-3xl font-bold text-orange-900">${stats.avgPrice}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
              <select
                value={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Packages</option>
                <option value="true">Featured Only</option>
                <option value="false">Not Featured</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="created_at">Date Created</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="secondary" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>

            <div className="flex items-end">
              <div className="flex items-center gap-2 w-full">
                <span className="text-sm text-gray-600">Sort:</span>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                  {sortBy === 'name' ? 'Name' : 
                   sortBy === 'price' ? 'Price' : 'Date'}
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {packages.length} of {allPackages.length} packages
          </p>
        </div>

        {/* Packages Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {pkg.is_featured && (
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="text-lg font-bold text-green-600">${pkg.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Properties:</span>
                      <span className="text-sm font-medium text-blue-600">
                        {pkg.properties?.length || 0} included
                      </span>
                    </div>
                    {pkg.start_date && pkg.end_date && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="text-sm text-gray-700">
                          {new Date(pkg.start_date).toLocaleDateString()} - {new Date(pkg.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => { setEditPackage(pkg); setShowForm(true); }}
                      className="flex-1"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => setShowImages(pkg.id)}
                      className="flex-1"
                    >
                      <PhotoIcon className="h-4 w-4 mr-1" />
                      Images
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(pkg.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600" 
                               onClick={() => { setEditPackage(pkg); setShowForm(true); }}>
                            {pkg.name}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{pkg.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-green-600">${pkg.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        {pkg.is_featured ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {pkg.properties?.length || 0} properties
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => { setEditPackage(pkg); setShowForm(true); }}
                            className="flex items-center gap-1"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => setShowImages(pkg.id)}
                            className="flex items-center gap-1"
                          >
                            <PhotoIcon className="h-4 w-4" />
                            Images
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(pkg.id)}
                            className="flex items-center gap-1"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {packages.length === 0 && (
          <div className="text-center py-12">
            <GiftIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No packages found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or create a new package</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>

      {showForm && (
        <PackageForm 
          onClose={() => { setShowForm(false); setEditPackage(null); }} 
          onSave={handleSave} 
          pkg={editPackage} 
          properties={properties} 
        />
      )}
      {showImages && (
        <PackageImages 
          packageId={showImages} 
          onClose={() => setShowImages(null)} 
        />
      )}
    </div>
  );
}
// --- AdminReviews ---
function ReviewForm({ onClose, onSave, review, properties }: any) {
  const [form, setForm] = useState<any>(review || {
    property: '', name: '', rating: 5, comment: '', approved: false
  });
  const [saving, setSaving] = useState(false);
  
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((f: any) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              {review ? 'Edit' : 'Add'} Review
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property *
            </label>
            <select 
              name="property" 
              value={form.property} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            >
              <option value="">Select a property</option>
              {properties.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reviewer Name *
            </label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="Enter reviewer name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {renderStars(form.rating)}
              </div>
              <input 
                name="rating" 
                value={form.rating} 
                onChange={handleChange} 
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center" 
                required 
                type="number" 
                min="1" 
                max="5" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Click stars or enter a number (1-5)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment *
            </label>
            <textarea 
              name="comment" 
              value={form.comment} 
              onChange={handleChange} 
              placeholder="Write your review comment..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none" 
              required 
            />
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              name="approved" 
              checked={form.approved} 
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-3 text-sm text-gray-700">
              Approve this review for public display
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              variant="primary"
              className="flex-1"
              disabled={saving}
            >
              {saving ? <LoadingSpinner size="sm" /> : 'Save Review'}
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
function AdminReviews() {
  const access = localStorage.getItem('access');
  const [reviews, setReviews] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editReview, setEditReview] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProperty, setFilterProperty] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [filterApproved, setFilterApproved] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!access) return;
    setLoading(true);
    Promise.all([
      apiGet('/reviews/'),
      apiGet('/properties/'),
    ]).then(([revs, props]) => {
      const reviewsData = revs.results || revs;
      setAllReviews(reviewsData);
      setReviews(reviewsData);
      setProperties(props.results || props);
      setLoading(false);
    }).catch(() => setError('Failed to load reviews.'));
  }, [access]);

  // Filter and sort reviews
  useEffect(() => {
    let filtered = [...allReviews];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        properties.find((p: any) => p.id === r.property)?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Property filter
    if (filterProperty) {
      filtered = filtered.filter(r => r.property.toString() === filterProperty);
    }

    // Rating filter
    if (filterRating) {
      filtered = filtered.filter(r => r.rating.toString() === filterRating);
    }

    // Approval filter
    if (filterApproved !== '') {
      filtered = filtered.filter(r => r.approved.toString() === filterApproved);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'property') {
        aVal = properties.find((p: any) => p.id === a.property)?.name || '';
        bVal = properties.find((p: any) => p.id === b.property)?.name || '';
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setReviews(filtered);
  }, [allReviews, searchTerm, filterProperty, filterRating, filterApproved, sortBy, sortOrder, properties]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await apiDelete(`/reviews/${id}/`);
      setAllReviews(revs => revs.filter(r => r.id !== id));
      setNotification({ message: 'Review deleted successfully', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to delete review', type: 'error' });
    }
  };

  const handleSave = async (form: any) => {
    try {
      if (editReview) {
        await apiPut(`/reviews/${editReview.id}/`, form);
        setAllReviews(revs => revs.map(r => r.id === editReview.id ? { ...r, ...form } : r));
        setNotification({ message: 'Review updated successfully', type: 'success' });
      } else {
        const newRev = await apiPost('/reviews/', form);
        setAllReviews(revs => [...revs, newRev]);
        setNotification({ message: 'Review added successfully', type: 'success' });
      }
      setShowForm(false);
      setEditReview(null);
    } catch (error) {
      setNotification({ message: 'Failed to save review', type: 'error' });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterProperty('');
    setFilterRating('');
    setFilterApproved('');
    setSortBy('created_at');
    setSortOrder('desc');
  };

  const getStats = () => {
    const total = allReviews.length;
    const approved = allReviews.filter(r => r.approved).length;
    const pending = total - approved;
    const avgRating = allReviews.length > 0 
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : '0.0';
    
    return { total, approved, pending, avgRating };
  };

  const stats = getStats();

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-12">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Customer Reviews</h2>
              <p className="text-gray-600">Manage and moderate customer feedback</p>
            </div>
            <Button 
              variant="primary"
              onClick={() => { setEditReview(null); setShowForm(true); }}
              className="flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Review
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Reviews</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Approved</p>
                <p className="text-3xl font-bold text-green-900">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Rating</p>
                <p className="text-3xl font-bold text-purple-900">{stats.avgRating}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
              <select
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Properties</option>
                {properties.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterApproved}
                onChange={(e) => setFilterApproved(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">Date</option>
                <option value="rating">Rating</option>
                <option value="name">Reviewer</option>
                <option value="property">Property</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="secondary" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {reviews.length} of {allReviews.length} reviews
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
              {sortBy === 'created_at' ? 'Date' : 
               sortBy === 'rating' ? 'Rating' : 
               sortBy === 'name' ? 'Reviewer' : 'Property'}
            </button>
          </div>
        </div>

        {/* Reviews Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{r.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{r.comment}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium cursor-pointer hover:text-blue-600" 
                           onClick={() => { setEditReview(r); setShowForm(true); }}>
                        {properties.find((p: any) => p.id === r.property)?.name || r.property}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">({r.rating}/5)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {r.approved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(r.created_at || r.id).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => { setEditReview(r); setShowForm(true); }}
                          className="flex items-center gap-1"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(r.id)}
                          className="flex items-center gap-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <StarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No reviews found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </Card>

        {error && (
          <div className="mt-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>

      {showForm && (
        <ReviewForm 
          onClose={() => { setShowForm(false); setEditReview(null); }} 
          onSave={handleSave} 
          review={editReview} 
          properties={properties} 
        />
      )}
    </div>
  );
}
// --- AdminAmenitiesTypesLocations ---
function AmenityForm({ onClose, onSave, amenity }: any) {
  const [form, setForm] = useState<any>(amenity || { name: '', icon: '' });
  const [saving, setSaving] = useState(false);
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const commonIcons = [
    { name: 'WiFi', icon: 'wifi' },
    { name: 'Pool', icon: 'swimming-pool' },
    { name: 'Gym', icon: 'dumbbell' },
    { name: 'Spa', icon: 'spa' },
    { name: 'Restaurant', icon: 'utensils' },
    { name: 'Bar', icon: 'wine-glass' },
    { name: 'Beach Access', icon: 'umbrella-beach' },
    { name: 'Parking', icon: 'car' },
    { name: 'Air Conditioning', icon: 'snowflake' },
    { name: 'Kitchen', icon: 'kitchen-set' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              {amenity ? 'Edit' : 'Add'} Amenity
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenity Name *
            </label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="e.g., WiFi, Pool, Gym"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon Class or URL
            </label>
            <input 
              name="icon" 
              value={form.icon} 
              onChange={handleChange} 
              placeholder="e.g., fas fa-wifi or icon URL"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
            />
            <p className="text-xs text-gray-500 mt-1">Enter FontAwesome class or custom icon URL</p>
          </div>

          {form.icon && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Icon Preview:</p>
              <div className="flex items-center gap-2">
                <i className={`${form.icon} text-2xl text-blue-600`}></i>
                <span className="text-sm text-gray-600">{form.name}</span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Common Icons:</h4>
            <div className="grid grid-cols-2 gap-2">
              {commonIcons.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setForm({ ...form, name: item.name, icon: `fas fa-${item.icon}` })}
                  className="flex items-center gap-2 p-2 text-sm text-blue-700 hover:bg-blue-100 rounded transition-colors"
                >
                  <i className={`fas fa-${item.icon}`}></i>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              variant="primary"
              className="flex-1"
              disabled={saving}
            >
              {saving ? <LoadingSpinner size="sm" /> : 'Save Amenity'}
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
function PropertyTypeForm({ onClose, onSave, type }: any) {
  const [form, setForm] = useState<any>(type || { name: '', description: '' });
  const [saving, setSaving] = useState(false);
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const commonTypes = [
    { name: 'Villa', description: 'Luxury private villa with ocean views' },
    { name: 'Resort', description: 'Full-service resort with amenities' },
    { name: 'Hotel', description: 'Traditional hotel accommodation' },
    { name: 'Bungalow', description: 'Cozy beachfront bungalow' },
    { name: 'Apartment', description: 'Modern apartment with city views' },
    { name: 'Guesthouse', description: 'Charming local guesthouse' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              {type ? 'Edit' : 'Add'} Property Type
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type Name *
            </label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="e.g., Villa, Resort, Hotel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Describe this property type..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none" 
            />
            <p className="text-xs text-gray-500 mt-1">Optional description to help categorize properties</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-3">Common Property Types:</h4>
            <div className="space-y-2">
              {commonTypes.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setForm({ name: item.name, description: item.description })}
                  className="w-full text-left p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="font-medium text-green-800">{item.name}</div>
                  <div className="text-sm text-green-600">{item.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              variant="primary"
              className="flex-1"
              disabled={saving}
            >
              {saving ? <LoadingSpinner size="sm" /> : 'Save Type'}
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
function LocationForm({ onClose, onSave, location }: any) {
  const [form, setForm] = useState<any>(location || { island: '', atoll: '', latitude: '', longitude: '' });
  const [saving, setSaving] = useState(false);
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
  };

  const handleMapChange = (lat: number, lng: number) => {
    setForm((f: any) => ({ ...f, latitude: lat, longitude: lng }));
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const commonLocations = [
    { island: 'Male', atoll: 'North Male Atoll', latitude: 4.1755, longitude: 73.5093 },
    { island: 'Hulhumale', atoll: 'North Male Atoll', latitude: 4.2125, longitude: 73.5402 },
    { island: 'Maafushi', atoll: 'South Male Atoll', latitude: 3.9408, longitude: 73.4854 },
    { island: 'Gulhi', atoll: 'South Male Atoll', latitude: 3.9333, longitude: 73.5333 },
    { island: 'Thulusdhoo', atoll: 'North Male Atoll', latitude: 4.3744, longitude: 73.6514 },
    { island: 'Rasdhoo', atoll: 'Ari Atoll', latitude: 4.2633, longitude: 72.9917 }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              {location ? 'Edit' : 'Add'} Location
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Island Name *
              </label>
              <input 
                name="island" 
                value={form.island} 
                onChange={handleChange} 
                placeholder="e.g., Male, Hulhumale, Maafushi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Atoll
              </label>
              <input 
                name="atoll" 
                value={form.atoll} 
                onChange={handleChange} 
                placeholder="e.g., North Male Atoll, South Male Atoll"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coordinates
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                <input 
                  name="latitude" 
                  value={form.latitude} 
                  onChange={handleChange} 
                  placeholder="4.1755"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                  required 
                  type="number" 
                  step="any"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                <input 
                  name="longitude" 
                  value={form.longitude} 
                  onChange={handleChange} 
                  placeholder="73.5093"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                  required 
                  type="number" 
                  step="any"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Or use the map below to set coordinates</p>
          </div>

          {form.latitude && form.longitude && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Location Preview:</h4>
              <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                <LocationMapPicker 
                  lat={parseFloat(form.latitude)} 
                  lng={parseFloat(form.longitude)} 
                  onChange={handleMapChange}
                />
              </div>
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 mb-3">Common Maldives Locations:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {commonLocations.map((item) => (
                <button
                  key={item.island}
                  type="button"
                  onClick={() => setForm({ 
                    island: item.island, 
                    atoll: item.atoll, 
                    latitude: item.latitude, 
                    longitude: item.longitude 
                  })}
                  className="text-left p-3 bg-white rounded-lg border border-yellow-200 hover:border-yellow-300 hover:bg-yellow-100 transition-colors"
                >
                  <div className="font-medium text-yellow-800">{item.island}</div>
                  <div className="text-sm text-yellow-600">{item.atoll}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              variant="primary"
              className="flex-1"
              disabled={saving}
            >
              {saving ? <LoadingSpinner size="sm" /> : 'Save Location'}
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
function AdminAmenitiesTypesLocations() {
  const access = localStorage.getItem('access');
  const navigate = useNavigate();
  
  // State management
  const [amenities, setAmenities] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [showAmenityForm, setShowAmenityForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editAmenity, setEditAmenity] = useState<any>(null);
  const [editType, setEditType] = useState<any>(null);
  const [editLocation, setEditLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [activeTab, setActiveTab] = useState<'amenities' | 'types' | 'locations'>('amenities');

  // Fetch data
  useEffect(() => {
    if (!access) return;
    setLoading(true);
    Promise.all([
      apiGet('/amenities/'),
      apiGet('/property-types/'),
      apiGet('/locations/'),
    ]).then(([ams, tps, locs]) => {
      setAmenities(ams.results || ams);
      setTypes(tps.results || tps);
      setLocations(locs.results || locs);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load data.');
      setLoading(false);
    });
  }, [access]);

  // CRUD operations
  const handleAmenityDelete = async (id: number) => {
    if (!window.confirm('Delete this amenity?')) return;
    try {
      await apiDelete(`/amenities/${id}/`);
      setAmenities(ams => ams.filter(a => a.id !== id));
      setNotification({ message: 'Amenity deleted successfully', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to delete amenity', type: 'error' });
    }
  };

  const handleAmenitySave = async (form: any) => {
    try {
      if (editAmenity) {
        await apiPut(`/amenities/${editAmenity.id}/`, form);
        setAmenities(ams => ams.map(a => a.id === editAmenity.id ? { ...a, ...form } : a));
        setNotification({ message: 'Amenity updated successfully', type: 'success' });
      } else {
        const newAmenity = await apiPost('/amenities/', form);
        setAmenities(ams => [...ams, newAmenity]);
        setNotification({ message: 'Amenity created successfully', type: 'success' });
      }
      setShowAmenityForm(false);
      setEditAmenity(null);
    } catch (error) {
      setNotification({ message: 'Failed to save amenity', type: 'error' });
    }
  };

  const handleTypeDelete = async (id: number) => {
    if (!window.confirm('Delete this property type?')) return;
    try {
      await apiDelete(`/property-types/${id}/`);
      setTypes(tps => tps.filter(t => t.id !== id));
      setNotification({ message: 'Property type deleted successfully', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to delete property type', type: 'error' });
    }
  };

  const handleTypeSave = async (form: any) => {
    try {
      if (editType) {
        await apiPut(`/property-types/${editType.id}/`, form);
        setTypes(tps => tps.map(t => t.id === editType.id ? { ...t, ...form } : t));
        setNotification({ message: 'Property type updated successfully', type: 'success' });
      } else {
        const newType = await apiPost('/property-types/', form);
        setTypes(tps => [...tps, newType]);
        setNotification({ message: 'Property type created successfully', type: 'success' });
      }
      setShowTypeForm(false);
      setEditType(null);
    } catch (error) {
      setNotification({ message: 'Failed to save property type', type: 'error' });
    }
  };

  const handleLocationDelete = async (id: number) => {
    if (!window.confirm('Delete this location?')) return;
    try {
      await apiDelete(`/locations/${id}/`);
      setLocations(locs => locs.filter(l => l.id !== id));
      setNotification({ message: 'Location deleted successfully', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to delete location', type: 'error' });
    }
  };

  const handleLocationSave = async (form: any) => {
    try {
      if (editLocation) {
        await apiPut(`/locations/${editLocation.id}/`, form);
        setLocations(locs => locs.map(l => l.id === editLocation.id ? { ...l, ...form } : l));
        setNotification({ message: 'Location updated successfully', type: 'success' });
      } else {
        const newLoc = await apiPost('/locations/', form);
        setLocations(locs => [...locs, newLoc]);
        setNotification({ message: 'Location created successfully', type: 'success' });
      }
      setShowLocationForm(false);
      setEditLocation(null);
    } catch (error) {
      setNotification({ message: 'Failed to save location', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = {
    amenities: amenities.length,
    types: types.length,
    locations: locations.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
                <p className="text-gray-600">Manage amenities, property types, and locations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-700">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('amenities')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Amenities</p>
                <p className="text-3xl font-bold text-blue-900">{stats.amenities}</p>
                <p className="text-xs text-blue-600 mt-1">Property features</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('types')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Property Types</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.types}</p>
                <p className="text-xs text-emerald-600 mt-1">Accommodation types</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('locations')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Locations</p>
                <p className="text-3xl font-bold text-amber-900">{stats.locations}</p>
                <p className="text-xs text-amber-600 mt-1">Islands & atolls</p>
              </div>
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'amenities', name: 'Amenities', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', count: stats.amenities },
                { id: 'types', name: 'Property Types', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', count: stats.types },
                { id: 'locations', name: 'Locations', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', count: stats.locations }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                  </svg>
                  {tab.name}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Amenities Tab */}
            {activeTab === 'amenities' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Amenities</h3>
                    <p className="text-gray-600">Manage property amenities and features</p>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => { setEditAmenity(null); setShowAmenityForm(true); }}
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add Amenity
                  </Button>
                </div>

                {amenities.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <p className="text-gray-500 mb-4">No amenities found</p>
                    <Button variant="primary" onClick={() => { setEditAmenity(null); setShowAmenityForm(true); }}>
                      Add Your First Amenity
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {amenities.map((amenity) => (
                      <Card key={amenity.id} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {amenity.icon && (
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className={`${amenity.icon} text-lg text-blue-600`}></i>
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold text-gray-800">{amenity.name}</h4>
                              <p className="text-sm text-gray-500">{amenity.icon || 'No icon'}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => { setEditAmenity(amenity); setShowAmenityForm(true); }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleAmenityDelete(amenity.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Property Types Tab */}
            {activeTab === 'types' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Property Types</h3>
                    <p className="text-gray-600">Define different types of accommodations</p>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => { setEditType(null); setShowTypeForm(true); }}
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add Type
                  </Button>
                </div>

                {types.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-gray-500 mb-4">No property types found</p>
                    <Button variant="primary" onClick={() => { setEditType(null); setShowTypeForm(true); }}>
                      Add Your First Type
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {types.map((type) => (
                      <Card key={type.id} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-1">{type.name}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{type.description || 'No description'}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => { setEditType(type); setShowTypeForm(true); }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleTypeDelete(type.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Locations Tab */}
            {activeTab === 'locations' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Locations</h3>
                    <p className="text-gray-600">Manage islands and atolls in Maldives</p>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => { setEditLocation(null); setShowLocationForm(true); }}
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add Location
                  </Button>
                </div>

                {locations.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-500 mb-4">No locations found</p>
                    <Button variant="primary" onClick={() => { setEditLocation(null); setShowLocationForm(true); }}>
                      Add Your First Location
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {locations.map((location) => (
                      <Card key={location.id} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <h4 className="font-semibold text-gray-800">{location.island}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{location.atoll}</p>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>Lat: {location.latitude}</div>
                              <div>Lng: {location.longitude}</div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => { setEditLocation(location); setShowLocationForm(true); }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleLocationDelete(location.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Forms */}
        {showAmenityForm && <AmenityForm onClose={() => { setShowAmenityForm(false); setEditAmenity(null); }} onSave={handleAmenitySave} amenity={editAmenity} />}
        {showTypeForm && <PropertyTypeForm onClose={() => { setShowTypeForm(false); setEditType(null); }} onSave={handleTypeSave} type={editType} />}
        {showLocationForm && <LocationForm onClose={() => { setShowLocationForm(false); setEditLocation(null); }} onSave={handleLocationSave} location={editLocation} />}
      </div>
    </div>
  );
}

const adminNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, description: 'Overview and analytics' },
  { name: 'Properties', href: '/admin/properties', icon: BuildingOffice2Icon, description: 'Manage properties' },
  { name: 'Packages', href: '/admin/packages', icon: GiftIcon, description: 'Manage packages' },
  { name: 'Reviews', href: '/admin/reviews', icon: StarIcon, description: 'Customer reviews' },
  { name: 'Settings', href: '/admin/amenities-types-locations', icon: WrenchScrewdriverIcon, description: 'Amenities & locations' },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  
  // Session monitoring
  useEffect(() => {
    const checkSession = () => {
      if (!isAuthenticated()) {
        logout();
      }
    };

    // Check session every 30 seconds
    const interval = setInterval(checkSession, 30000);
    
    // Check on window focus
    const handleFocus = () => checkSession();
    window.addEventListener('focus', handleFocus);
    
    // Check on visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 flex z-50">
            <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-72 bg-white shadow-2xl">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => setSidebarOpen(false)}>
                    <XMarkIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex items-center px-6 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                      <BuildingOffice2Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-gray-800">Maldives Admin</span>
                      <p className="text-xs text-gray-500">Travel Agency</p>
                    </div>
                  </div>
                  <nav className="mt-5 px-3 space-y-2">
                    {adminNav.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          currentPath === item.href
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                      >
                        <item.icon className={`mr-3 h-5 w-5 ${currentPath === item.href ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} aria-hidden="true" />
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </a>
                    ))}
                  </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-red-600 w-full text-sm px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                    Sign Out
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72 bg-white border-r border-gray-200 h-full shadow-lg">
          <div className="flex items-center h-16 px-6 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <BuildingOffice2Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-800">Maldives Admin</span>
              <p className="text-xs text-gray-500">Travel Agency</p>
            </div>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-2">
            {adminNav.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  currentPath === item.href
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${currentPath === item.href ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} aria-hidden="true" />
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </a>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-red-600 w-full text-sm px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur border-b border-gray-200 lg:hidden">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
                <BuildingOffice2Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">Maldives Admin</span>
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        
        {/* Admin login - public route that redirects if authenticated */}
        <Route path="/admin/login" element={
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        } />
        
        {/* Protected admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="amenities-types-locations" element={<AdminAmenitiesTypesLocations />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
