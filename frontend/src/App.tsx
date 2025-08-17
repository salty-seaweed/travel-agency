import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useScrollToTop } from './hooks/useScrollToTop';
import Layout from './components/Layout';
import { HomePage } from './components/HomePage';
import { PropertyListPage } from './components/PropertyListPage';
import { PropertyDetailPage } from './components/PropertyDetailPage';
import { PackagesPage } from './components/PackagesPage';
import { PackageDetailPage } from './components/PackageDetailPage';
import { PropertyBookingPage } from './components/PropertyBookingPage';
import { PackageBookingPage } from './components/PackageBookingPage';
import { ContactPage } from './components/ContactPage';
import { AboutPage } from './components/AboutPage';
import { BlogPage } from './components/BlogPage';
import { FAQPage } from './components/FAQPage';
import { MapPage } from './components/MapPage';
import { CustomerLogin } from './components/auth/CustomerLogin';
import { CustomerRegister } from './components/auth/CustomerRegister';
import { CustomerProtectedRoute } from './components/auth/CustomerProtectedRoute';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminLogin } from './components/auth/AdminLogin';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProperties } from './components/admin/AdminProperties';
import { AdminPackages } from './components/admin/AdminPackages';
import { AdminReviews } from './components/admin/AdminReviews';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { AdminSettings } from './components/admin/AdminSettings';
import AdminContentManager from './components/admin/AdminContentManager';
import { PublicRoute } from './components/auth/PublicRoute';

function AppContent() {
  useScrollToTop();

  return (
    <>
      <Helmet>
        <title>Thread Travels & Tours - Your Maldives Paradise</title>
        <meta name="description" content="Discover the perfect Maldives getaway with Thread Travels & Tours. Luxury accommodations, exclusive packages, and unforgettable experiences." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      </Helmet>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="properties" element={<PropertyListPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
          <Route path="properties/:id/book" element={<PropertyBookingPage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="packages/:id" element={<PackageDetailPage />} />
          <Route path="packages/:id/book" element={<PackageBookingPage />} />
          <Route path="booking" element={<PropertyBookingPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="map" element={<MapPage />} />
        </Route>

        {/* Customer Auth Routes */}
        <Route path="/customer/login" element={<PublicRoute><CustomerLogin /></PublicRoute>} />
        <Route path="/customer/register" element={<PublicRoute><CustomerRegister /></PublicRoute>} />

        {/* Customer Protected Routes */}
        <Route path="/customer/dashboard" element={<CustomerProtectedRoute><CustomerDashboard /></CustomerProtectedRoute>} />

        {/* Admin Auth Routes */}
        <Route path="/ttm/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

        {/* Admin Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>}>
          <Route path="overview" element={<AdminDashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="content" element={<AdminContentManager />} />
        </Route>
      </Routes>
    </>
  );
}

export default AppContent;
