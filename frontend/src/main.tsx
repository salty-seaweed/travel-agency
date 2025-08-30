import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App.tsx'
import AppErrorBoundary from './components/ErrorBoundary.tsx'
import { CurrencyProvider } from './contexts/CurrencyContext.tsx'
import { queryClient } from './lib/query-client'
import './i18n'
import './main.css'

// Silence all console output in production (prevents third-party logs too)
if (import.meta.env.PROD) {
  /* eslint-disable no-console */
  const noop = () => {}
  const consoleMethods = [
    'log',
    'debug',
    'info',
    'warn',
    'error',
    'group',
    'groupCollapsed',
    'groupEnd',
    'time',
    'timeEnd',
    'trace',
    'table',
    'dir',
  ] as const
  const c: any = console
  for (const method of consoleMethods) {
    try { c[method] = noop } catch {}
  }
  /* eslint-enable no-console */
}

// Extend Chakra UI theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    sunset: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    paradise: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
  // Add animations to Chakra UI theme
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  // Add custom animations
  animations: {
    float: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-20px)' },
    },
    'float-delayed': {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-15px)' },
    },
    'float-slow': {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
    },
  },
})

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <CurrencyProvider>
            <Router>
              <AppErrorBoundary level="app" name="AppRoot">
                <App />
              </AppErrorBoundary>
            </Router>
          </CurrencyProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
