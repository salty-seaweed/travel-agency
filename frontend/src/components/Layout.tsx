import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { GlobalSearch } from './GlobalSearch';
import { 
  Bars3Icon, 
  XMarkIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  UserIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, customerData, logout } = useCustomerAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Packages', href: '/packages', icon: '🌟' },
    { name: 'Properties', href: '/properties', icon: '🏠' },
    { name: 'Map', href: '/map', icon: '🗺️' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
    { name: 'Contact', href: '/contact', icon: '📞' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            {/* Logo - Improved Mobile */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo.png" 
                  alt="Thread Travels and Tours Maldives" 
                  className="h-8 sm:h-10 w-auto"
                  onError={(e) => {
                    // Fallback to text if logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                          <span class="text-white font-bold text-xs sm:text-sm">TT</span>
                        </div>
                      `;
                    }
                  }}
                />
                <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-bold text-gray-900">Thread Travels</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:items-center md:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.name === 'Packages' 
                      ? 'text-green-600 bg-green-50 border-2 border-green-200 font-bold'
                      : isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name === 'Packages' && '🌟 '}
                  {item.name}
                </Link>
              ))}
              
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                title="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/properties"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button - Improved */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                title="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Improved */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                  {item.name === 'Packages' && (
                    <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </span>
                  )}
                </Link>
              ))}
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserIcon className="h-5 w-5 mr-3" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span className="mr-3">🚪</span>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mr-3">🔑</span>
                      Login
                    </Link>
                    <Link
                      to="/properties"
                      className="flex items-center justify-center mt-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mr-2">🎯</span>
                      Book Now
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-4">Thread Travels & Tours</h3>
              <p className="text-gray-300 mb-4">
                Your trusted partner for authentic Maldives experiences. We connect you with the best local properties 
                and create unforgettable travel memories across the islands.
              </p>
              <div className="flex space-x-4">
                <a href="https://wa.me/9601234567" className="text-gray-300 hover:text-white">
                  <span className="sr-only">WhatsApp</span>
                  📱 WhatsApp
                </a>
                <a href="tel:+9601234567" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Phone</span>
                  📞 +960 123 4567
                </a>
                <a href="mailto:info@threadtravels.mv" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Email</span>
                  ✉️ info@threadtravels.mv
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/properties" className="text-gray-300 hover:text-white">Properties</Link></li>
                <li><Link to="/packages" className="text-gray-300 hover:text-white">Travel Packages</Link></li>
                <li><Link to="/map" className="text-gray-300 hover:text-white">Interactive Map</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white">24/7 Support</Link></li>
                <li><a href="https://wa.me/9601234567" className="text-gray-300 hover:text-white">WhatsApp Chat</a></li>
                <li><Link to="/dashboard" className="text-gray-300 hover:text-white">Customer Dashboard</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Thread Travels & Tours. All rights reserved. | 
              <a href="https://g.page/thread-travels-maldives/review" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-2">
                Leave us a review on Google
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

export default Layout; 