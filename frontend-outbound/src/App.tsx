import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';

// Eagerly import Layout, as it's used everywhere
import Layout from './components/Layout';

// Lazy load page components for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const CountriesPage = React.lazy(() => import('./pages/CountriesPage'));
const TourDetailPage = React.lazy(() => import('./pages/TourDetailPage'));
const SearchResultsPage = React.lazy(() => import('./pages/SearchResultsPage'));
const DealsPage = React.lazy(() => import('./pages/DealsPage'));
const BookingPage = React.lazy(() => import('./pages/BookingPage'));

const PageLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <Spinner size="xl" />
  </Box>
);

function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/countries/:continentCode" element={<CountriesPage />} />
          <Route path="/tours/:slug" element={<TourDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/book/:tourId" element={<BookingPage />} />
          {/* Add other routes like About, Contact, etc. later */}
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
