import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import { GoogleTranslateWidget } from './GoogleTranslateWidget';
// import { HomepageSwitcher } from './HomepageSwitcher'; // Removed - no longer needed

export default function Layout() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navigation />
      {/* <HomepageSwitcher /> - Removed - no longer needed */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <GoogleTranslateWidget position="bottom-right" />
    </div>
  );
} 