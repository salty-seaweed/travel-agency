import React, { useState, useEffect } from 'react';
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
  MagnifyingGlassIcon,
  HomeIcon,
  StarIcon,
  BuildingOfficeIcon,
  MapIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  HeartIcon,
  BellIcon
} from '@heroicons/react/24/outline';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, customerData, logout } = useCustomerAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Packages', href: '/packages', icon: StarIcon, featured: true },
    { name: 'Properties', href: '/properties', icon: BuildingOfficeIcon },
    { name: 'Map', href: '/map', icon: MapIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
    { name: 'Contact', href: '/contact', icon: ChatBubbleLeftRightIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header - Modern Glass Design */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/20' 
          : 'bg-white/60 backdrop-blur-md shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Modern Design */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:from-blue-700 group-hover:via-indigo-700 group-hover:to-purple-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <SparklesIcon className="h-6 w-6 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-all duration-300"></div>
                </div>
                <div className="ml-4">
                  <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Thread Travels
                  </span>
                  <div className="text-sm text-gray-500 font-medium">Maldives Paradise</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Modern Design */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    item.featured 
                      ? 'text-white bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg hover:shadow-xl hover:scale-105'
                      : isActive(item.href)
                        ? 'text-blue-600 bg-blue-50 border-2 border-blue-200'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.featured && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </div>
                </Link>
              ))}
              
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-3 rounded-2xl text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                title="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 ml-4">
                  <button className="p-3 rounded-2xl text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300">
                    <BellIcon className="h-5 w-5" />
                  </button>
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <Link
                    to="/login"
                    className="px-6 py-3 rounded-2xl text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/properties"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Book Now
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-3 rounded-2xl text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                title="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 rounded-2xl text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
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

        {/* Mobile Navigation - Modern Design */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl animate-slide-down">
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50 border-2 border-blue-200'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-4 flex-shrink-0" />
                  {item.name}
                  {item.featured && (
                    <span className="ml-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                      Popular
                    </span>
                  )}
                </Link>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-6 py-4 rounded-2xl text-base font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserIcon className="h-5 w-5 mr-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-6 py-4 rounded-2xl text-base font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                    >
                      <span className="mr-4">🚪</span>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center px-6 py-4 rounded-2xl text-base font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mr-4">🔑</span>
                      Login
                    </Link>
                    <Link
                      to="/properties"
                      className="flex items-center justify-center mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mr-3">🎯</span>
                      Book Now
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer - Modern Design */}
      <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-yellow-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                  <SparklesIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Thread Travels & Tours</h3>
                  <p className="text-blue-200 text-base">Your Gateway to Paradise</p>
                </div>
              </div>
              <p className="text-blue-100 mb-8 leading-relaxed text-lg">
                We connect you with the most authentic and luxurious Maldives experiences. 
                From pristine beaches to crystal-clear waters, let us create your perfect paradise getaway.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <a 
                  href="https://wa.me/9601234567" 
                  className="flex items-center text-blue-200 hover:text-white transition-colors duration-300 group"
                >
                  <span className="mr-3 text-2xl">📱</span>
                  <div>
                    <div className="font-semibold text-base">WhatsApp</div>
                    <div className="text-sm text-blue-300">+960 123 4567</div>
                  </div>
                </a>
                <a 
                  href="tel:+9601234567" 
                  className="flex items-center text-blue-200 hover:text-white transition-colors duration-300 group"
                >
                  <span className="mr-3 text-2xl">📞</span>
                  <div>
                    <div className="font-semibold text-base">Call Us</div>
                    <div className="text-sm text-blue-300">+960 123 4567</div>
                  </div>
                </a>
                <a 
                  href="mailto:info@threadtravels.mv" 
                  className="flex items-center text-blue-200 hover:text-white transition-colors duration-300 group"
                >
                  <span className="mr-3 text-2xl">✉️</span>
                  <div>
                    <div className="font-semibold text-base">Email</div>
                    <div className="text-sm text-blue-300">info@threadtravels.mv</div>
                  </div>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/properties" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center text-base">
                    <span className="mr-3">🏠</span>
                    Properties
                  </Link>
                </li>
                <li>
                  <Link to="/packages" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center text-base">
                    <span className="mr-3">🌟</span>
                    Travel Packages
                  </Link>
                </li>
                <li>
                  <Link to="/map" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center text-base">
                    <span className="mr-3">🗺️</span>
                    Interactive Map
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center text-base">
                    <span className="mr-3">ℹ️</span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center text-base">
                    <span className="mr-3">📞</span>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6">Support</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/faq" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center text-base">
                    <span className="mr-3">❓</span>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center text-base">
                    <span className="mr-3">🆘</span>
                    24/7 Support
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://wa.me/9601234567" 
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center text-base"
                  >
                    <span className="mr-3">💬</span>
                    WhatsApp Chat
                  </a>
                </li>
                <li>
                  <Link to="/dashboard" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center text-base">
                    <span className="mr-3">👤</span>
                    Customer Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-12 pt-8 text-center">
            <p className="text-blue-300 text-sm">
              © 2024 Thread Travels & Tours. All rights reserved. | 
              <a 
                href="https://g.page/thread-travels-maldives/review" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-yellow-400 hover:text-yellow-300 ml-2 transition-colors duration-300"
              >
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