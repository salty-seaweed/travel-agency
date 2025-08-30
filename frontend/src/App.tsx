import React, { Suspense } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useScrollToTop } from './hooks/useScrollToTop';
import Layout from './components/Layout';
import { LoadingSpinner } from './components/LoadingSpinner';
// import { PageErrorBoundary } from './components/SimpleErrorBoundary';

// Lazy load all route components to reduce initial bundle size
const ExperiencesHomePage = React.lazy(() => import('./components/experiences-homepage').then(module => ({ default: module.ExperiencesHomePage })));


const PackagesPage = React.lazy(() => import('./components/PackagesPage').then(module => ({ default: module.PackagesPage })));
const PackageDetailPage = React.lazy(() => import('./components/PackageDetailPage').then(module => ({ default: module.PackageDetailPage })));

const PackageBookingPage = React.lazy(() => import('./components/PackageBookingPage').then(module => ({ default: module.PackageBookingPage })));
const ContactPage = React.lazy(() => import('./components/ContactPage').then(module => ({ default: module.ContactPage })));
const AboutPage = React.lazy(() => import('./components/AboutPage').then(module => ({ default: module.AboutPage })));
const BlogPage = React.lazy(() => import('./components/BlogPage').then(module => ({ default: module.BlogPage })));
const FAQPage = React.lazy(() => import('./components/FAQPage').then(module => ({ default: module.FAQPage })));

const TransportationPage = React.lazy(() => import('./components/TransportationPage').then(module => ({ default: module.TransportationPage })));
const CustomerLogin = React.lazy(() => import('./components/auth/CustomerLogin').then(module => ({ default: module.CustomerLogin })));
const CustomerRegister = React.lazy(() => import('./components/auth/CustomerRegister').then(module => ({ default: module.CustomerRegister })));
const CustomerProtectedRoute = React.lazy(() => import('./components/auth/CustomerProtectedRoute').then(module => ({ default: module.CustomerProtectedRoute })));
const CustomerDashboard = React.lazy(() => import('./components/CustomerDashboard').then(module => ({ default: module.CustomerDashboard })));
const AdminLogin = React.lazy(() => import('./components/auth/AdminLogin').then(module => ({ default: module.AdminLogin })));
const ProtectedRoute = React.lazy(() => import('./components/auth/ProtectedRoute').then(module => ({ default: module.ProtectedRoute })));
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));

const AdminPackages = React.lazy(() => import('./components/admin/AdminPackages').then(module => ({ default: module.AdminPackages })));
const AdminDestinations = React.lazy(() => import('./components/admin/AdminDestinations').then(module => ({ default: module.AdminDestinations })));
const AdminExperiences = React.lazy(() => import('./components/admin/AdminExperiences').then(module => ({ default: module.AdminExperiences })));
const AdminReviews = React.lazy(() => import('./components/admin/AdminReviews').then(module => ({ default: module.AdminReviews })));
const AdminAnalytics = React.lazy(() => import('./components/admin/AdminAnalytics').then(module => ({ default: module.AdminAnalytics })));
const AdminSettings = React.lazy(() => import('./components/admin/AdminSettings').then(module => ({ default: module.AdminSettings })));
const AdminContentManager = React.lazy(() => import('./components/admin/AdminContentManager').then(module => ({ default: module.AdminContentManager })));
const TransportationAdmin = React.lazy(() => import('./components/admin/transportation/TransportationAdmin').then(module => ({ default: module.TransportationAdmin })));
const HomepageAdmin = React.lazy(() => import('./components/admin/HomepageAdmin').then(module => ({ default: module.HomepageAdmin })));
const PublicRoute = React.lazy(() => import('./components/auth/PublicRoute').then(module => ({ default: module.PublicRoute })));
const CMSPageRenderer = React.lazy(() => import('./components/CMSPageRenderer').then(module => ({ default: module.CMSPageRenderer })));


// Loading component for lazy routes
const RouteLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <LoadingSpinner size="xl" />
  </div>
);

function AppContent() {
  useScrollToTop();

  return (
    <>
      <Helmet>
        <title>Thread Travels & Tours - Your Maldives Paradise</title>
        <meta name="description" content="Discover the perfect Maldives getaway with Thread Travels & Tours. Luxury accommodations, exclusive packages, and unforgettable experiences." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        {/* Preload critical resources */}
        <link rel="preload" href="/src/assets/logo.svg" as="image" type="image/svg+xml" />
        <link rel="dns-prefetch" href="//localhost:8001" />
        <link rel="preconnect" href="//localhost:8001" />
      </Helmet>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<RouteLoading />}>
              <ExperiencesHomePage />
            </Suspense>
          } />
          <Route path="properties" element={<Navigate to="/packages" replace />} />
          <Route path="properties/:id" element={<Navigate to="/packages" replace />} />
          <Route path="properties/:id/book" element={<Navigate to="/packages" replace />} />
          <Route path="packages" element={
            <Suspense fallback={<RouteLoading />}>
              <PackagesPage />
            </Suspense>
          } />
          <Route path="packages/:id" element={
            <Suspense fallback={<RouteLoading />}>
              <PackageDetailPage />
            </Suspense>
          } />

          <Route path="packages/:id/book" element={
            <Suspense fallback={<RouteLoading />}>
              <PackageBookingPage />
            </Suspense>
          } />
          <Route path="booking" element={<Navigate to="/packages" replace />} />
          <Route path="contact" element={
            <Suspense fallback={<RouteLoading />}>
              <ContactPage />
            </Suspense>
          } />
          <Route path="about" element={
            <Suspense fallback={<RouteLoading />}>
              <AboutPage />
            </Suspense>
          } />
          <Route path="blog" element={
            <Suspense fallback={<RouteLoading />}>
              <BlogPage />
            </Suspense>
          } />
          <Route path="faq" element={
            <Suspense fallback={<RouteLoading />}>
              <FAQPage />
            </Suspense>
          } />
          
          <Route path="transportation" element={
            <Suspense fallback={<RouteLoading />}>
              <TransportationPage />
            </Suspense>
          } />
          {/* CMS Pages - Dynamic routing for CMS-created pages */}
          <Route path="page/:slug" element={
            <Suspense fallback={<RouteLoading />}>
              <CMSPageRenderer />
            </Suspense>
          } />
        </Route>

        {/* Customer Auth Routes */}
        <Route path="/customer/login" element={
          <Suspense fallback={<RouteLoading />}>
            <PublicRoute><CustomerLogin /></PublicRoute>
          </Suspense>
        } />
        <Route path="/customer/register" element={
          <Suspense fallback={<RouteLoading />}>
            <PublicRoute><CustomerRegister /></PublicRoute>
          </Suspense>
        } />

        {/* Customer Protected Routes */}
        <Route path="/customer/dashboard" element={
          <Suspense fallback={<RouteLoading />}>
            <CustomerProtectedRoute><CustomerDashboard /></CustomerProtectedRoute>
          </Suspense>
        } />

        {/* Admin Auth Routes */}
        <Route path="/ttm/login" element={
          <Suspense fallback={<RouteLoading />}>
            <PublicRoute><AdminLogin /></PublicRoute>
          </Suspense>
        } />

        {/* Admin Routes */}
        <Route path="/dashboard" element={
          <Suspense fallback={<RouteLoading />}>
            <ProtectedRoute><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>
          </Suspense>
        }>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={
            <Suspense fallback={<RouteLoading />}>
              <AdminDashboard />
            </Suspense>
          } />

          <Route path="packages" element={
            <Suspense fallback={<RouteLoading />}>
              <AdminPackages />
            </Suspense>
          } />
          <Route path="destinations" element={
            <Suspense fallback={<RouteLoading />}>
              <AdminDestinations />
            </Suspense>
          } />
          <Route path="experiences" element={
            <Suspense fallback={<RouteLoading />}>
              <AdminExperiences />
            </Suspense>
          } />
          <Route path="reviews" element={
            <Suspense fallback={<RouteLoading />}>
              <AdminReviews />
            </Suspense>
          } />
          <Route path="analytics" element={
            <Suspense fallback={<RouteLoading />}>
              <AdminAnalytics />
            </Suspense>
          } />
          <Route path="transportation" element={
            <Suspense fallback={<RouteLoading />}>
              <TransportationAdmin />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<RouteLoading />}>
              <AdminSettings />
            </Suspense>
          } />
          <Route path="content" element={
            <Suspense fallback={<RouteLoading />}>
              <AdminContentManager />
            </Suspense>
          } />
          <Route path="homepage" element={
            <Suspense fallback={<RouteLoading />}>
              <HomepageAdmin />
            </Suspense>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default AppContent;
