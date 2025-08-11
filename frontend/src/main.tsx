import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './main.css';
import App from './App.tsx';
import { queryClient } from './lib/query-client';
import { AppErrorBoundary } from './components/SimpleErrorBoundary';
// Performance monitoring will be handled in individual components
import { isDevelopment } from './config';

// Enhanced error reporting for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </AppErrorBoundary>
  </StrictMode>,
);
