import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { GoogleTranslateWidget } from './GoogleTranslateWidget';

export default function Layout() {
  return (
    <div className="bg-gray-50">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <GoogleTranslateWidget position="bottom-right" />
    </div>
  );
} 