import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { GoogleTranslateWidget } from './GoogleTranslateWidget';
// import { HomepageSwitcher } from './HomepageSwitcher'; // Removed - no longer needed

export default function Layout() {
  return (
    <div className="bg-gray-50">
      <Navigation />
      {/* <HomepageSwitcher /> - Removed - no longer needed */}
      <main>
        <Outlet />
      </main>
      <GoogleTranslateWidget position="bottom-right" />
    </div>
  );
} 