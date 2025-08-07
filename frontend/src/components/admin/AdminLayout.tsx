import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../../hooks';
import {
  HomeIcon,
  BuildingOffice2Icon,
  GiftIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
  UserCircleIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, description: 'Overview and analytics' },
  { name: 'Properties', href: '/admin/properties', icon: BuildingOffice2Icon, description: 'Manage properties' },
  { name: 'Packages', href: '/admin/packages', icon: GiftIcon, description: 'Manage packages' },
  { name: 'Reviews', href: '/admin/reviews', icon: StarIcon, description: 'Customer reviews' },
  { name: 'Settings', href: '/admin/amenities-types-locations', icon: WrenchScrewdriverIcon, description: 'Amenities & locations' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const { logout } = useAuth();
  
  // Session monitoring
  useEffect(() => {
    const checkSession = () => {
      // This will be handled by the ProtectedRoute component
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
                
                {/* Mobile sidebar content */}
                <div className="flex flex-shrink-0 items-center px-6 py-4 border-b border-gray-200">
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
                
                {/* Mobile user menu */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">Admin User</p>
                      <p className="text-xs text-gray-500">admin@threadtravels.mv</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
                    Sign out
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72 bg-white border-r border-gray-200 shadow-lg">
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
          
          {/* Desktop user menu */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@threadtravels.mv</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 rounded-lg hover:bg-gray-100"
                title="Sign out"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

              {/* Profile dropdown */}
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-1.5 flex items-center p-1.5"
                  id="user-menu-button"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    <div className="ml-3 text-left">
                      <p className="text-sm font-medium text-gray-700">Admin User</p>
                      <p className="text-xs text-gray-500">admin@threadtravels.mv</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 