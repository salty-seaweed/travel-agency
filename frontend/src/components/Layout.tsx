import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import { GoogleTranslateWidget } from './GoogleTranslateWidget';
// import { HomepageSwitcher } from './HomepageSwitcher'; // Removed - no longer needed

export default function Layout() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      <Navigation />
      {/* <HomepageSwitcher /> - Removed - no longer needed */}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <GoogleTranslateWidget position="bottom-right" />
    </div>
  );
} 