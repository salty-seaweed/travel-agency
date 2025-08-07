import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import {
  Notification,
  LoadingSpinner,
  Card,
  Button,
  ProtectedRoute,
  PublicRoute,
  AdminLogin,
  AdminDashboard,
  AdminLayout,
  AdminProperties,
  AdminReviews,
  AdminPackages,
  AdminSettings,
  CustomerLogin,
  CustomerRegister,
  CustomerProtectedRoute,
  CustomerDashboard,
  Layout,
  HomePage,
  PropertyListPage,
  PropertyDetailPage,
  PackageDetailPage,
  BookingPage,
  PackagesPage,
  ContactPage,
  AboutPage,
  FAQPage,
  BlogPage,
  MapPage,
} from './components';
import { useNotification } from './hooks';

// Main App component
function App() {
  const { notification, hideNotification } = useNotification();

  return (
    <HelmetProvider>
      <Router>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={hideNotification}
          />
        )}
        
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/properties" element={<Layout><PropertyListPage /></Layout>} />
          <Route path="/properties/:id" element={<Layout><PropertyDetailPage /></Layout>} />
          <Route path="/properties/:id/book" element={<Layout><BookingPage /></Layout>} />
          <Route path="/packages" element={<Layout><PackagesPage /></Layout>} />
          <Route path="/packages/:id" element={<Layout><PackageDetailPage /></Layout>} />
          <Route path="/map" element={<Layout><MapPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/faq" element={<Layout><FAQPage /></Layout>} />
          <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          
          {/* Customer Authentication Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <CustomerLogin />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <CustomerRegister />
            </PublicRoute>
          } />
          
          {/* Customer Dashboard Routes */}
          <Route path="/dashboard" element={
            <CustomerProtectedRoute>
              <CustomerDashboard />
            </CustomerProtectedRoute>
          } />
          
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
            <Route path="amenities-types-locations" element={<AdminSettings />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
