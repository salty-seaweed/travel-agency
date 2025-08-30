import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  StarIcon, 
  SparklesIcon,
  UserIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { useWhatsApp } from '../hooks/useQueries';
import { Button } from './ui/Button';

interface MobileNavigationProps {
  className?: string;
}

export function MobileNavigation({ className = '' }: MobileNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, customerData } = useCustomerAuth();
  const { getWhatsAppUrl, whatsappNumber } = useWhatsApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Handle scroll effect
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Packages', href: '/packages', icon: StarIcon },
    { name: 'Transport', href: '/transportation', icon: SparklesIcon },
    { name: 'Profile', href: '/customer/dashboard', icon: UserIcon, requiresAuth: true }
  ];

  const quickActions = [
    {
      name: 'WhatsApp',
      icon: ChatBubbleLeftRightIcon,
      action: () => {
        const message = "Hi! I'm interested in Maldives travel packages. Can you help me?";
        window.open(getWhatsAppUrl(message), '_blank');
      },
      color: 'text-green-600'
    },
    {
      name: 'Call Us',
      icon: PhoneIcon,
      action: () => {
        window.location.href = `tel:${whatsappNumber}`;
      },
      color: 'text-blue-600'
    },
    {
      name: 'Favorites',
      icon: HeartIcon,
      action: () => {
        // Navigate to favorites or show favorites modal
        navigate('/packages?filter=favorites');
      },
      color: 'text-red-600'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''} ${className}`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-gray-900">Thread Travels</span>
          </Link>

          {/* Search and Menu Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              ) : (
                <Bars3Icon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="px-4 pb-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages, destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* User Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {customerData?.user?.first_name} {customerData?.user?.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{customerData?.user?.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Guest</p>
                      <Link to="/customer/login" className="text-sm text-blue-600 hover:underline">
                        Sign in
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  if (item.requiresAuth && !isAuthenticated) return null;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.name}
                      onClick={action.action}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                    >
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                      <span>{action.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Us</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📞 {whatsappNumber}</p>
                  <p>📧 info@threadtravels.mv</p>
                  <p>📍 Male, Maldives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 4).map((item) => {
            if (item.requiresAuth && !isAuthenticated) return null;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-30 md:hidden">
        <Button
          onClick={() => {
            const message = "Hi! I'm interested in Maldives travel packages. Can you help me?";
            window.open(getWhatsAppUrl(message), '_blank');
          }}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg flex items-center justify-center"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </Button>
      </div>

      {/* Bottom Spacing for Mobile */}
      <div className="h-20 md:hidden" />
    </>
  );
}

export default MobileNavigation;
