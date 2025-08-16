import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { config, errorMessages } from '../config';

// Error information interface
interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

// Error boundary state
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

// Error boundary props
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level: 'app' | 'page' | 'component';
  name?: string;
}

// Error logging service
class ErrorLogger {
  static log(error: Error, errorInfo: ErrorInfo, context: { level: string; name?: string; errorId: string }): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level: context.level,
      name: context.name,
      errorId: context.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log to console in development
    if (config.apiBaseUrl.includes('localhost')) {
      console.group(`🚨 Error Boundary [${context.level}${context.name ? `:${context.name}` : ''}]`);
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Error ID:', context.errorId);
      console.groupEnd();
    }

    // In production, send to error reporting service
    if (typeof window !== 'undefined' && !config.apiBaseUrl.includes('localhost')) {
      // Send to your error tracking service (e.g., Sentry, LogRocket, etc.)
      try {
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorData),
        }).catch(() => {
          // Silently fail if error reporting fails
        });
      } catch {
        // Silently fail if error reporting fails
      }
    }
  }
}

// Generate unique error ID
const generateErrorId = (): string => {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Main Error Boundary Component
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorId = generateErrorId();
    
    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Log the error
    ErrorLogger.log(error, errorInfo, {
      level: this.props.level,
      name: this.props.name,
      errorId,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = (): void => {
    if (this.state.retryCount >= this.maxRetries) {
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: prevState.retryCount + 1,
    }));

    // Auto-retry after a delay to prevent immediate re-errors
    this.retryTimeoutId = setTimeout(() => {
      if (this.state.hasError) {
        this.forceUpdate();
      }
    }, 1000);
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  handleGoBack = (): void => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.handleGoHome();
    }
  };

  componentWillUnmount(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Render appropriate error UI based on level
      return this.renderErrorUI();
    }

    return this.props.children;
  }

  private renderErrorUI(): ReactNode {
    const { level, name } = this.props;
    const { error, errorId, retryCount } = this.state;
    const canRetry = retryCount < this.maxRetries;

    // App-level error (most severe)
    if (level === 'app') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Application Error
            </h1>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Something went wrong with the application. We apologize for the inconvenience.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-xs font-mono text-gray-500 break-all">
                Error ID: {errorId}
              </p>
              {config.apiBaseUrl.includes('localhost') && error && (
                <p className="text-xs font-mono text-red-600 mt-2 break-words">
                  {error.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                                  <ArrowPathIcon className="h-5 w-5" />
                Reload Application
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <HomeIcon className="h-5 w-5" />
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Page-level error
    if (level === 'page') {
      return (
        <div className="min-h-96 flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl m-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Page Error
            </h2>
            
            <p className="text-gray-600 mb-4">
              This page encountered an error. Please try again.
            </p>

            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-left">
              <p className="text-xs font-mono text-gray-500 break-all">
                Error ID: {errorId}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  Retry ({this.maxRetries - retryCount} left)
                </button>
              )}
              
              <button
                onClick={this.handleGoBack}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Component-level error (least severe)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-2">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800 mb-1">
              Component Error{name ? `: ${name}` : ''}
            </h3>
            
            <p className="text-sm text-red-700 mb-3">
              This component failed to load. You can try refreshing it.
            </p>

            <div className="flex gap-2">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-md font-medium hover:bg-red-200 transition-colors duration-200 flex items-center gap-1"
                >
                  <ArrowPathIcon className="h-3 w-3" />
                  Retry
                </button>
              )}
            </div>

            {config.apiBaseUrl.includes('localhost') && (
              <details className="mt-3">
                <summary className="text-xs text-red-600 cursor-pointer hover:text-red-800">
                  Debug Info
                </summary>
                <div className="mt-2 p-2 bg-red-100 rounded text-xs font-mono text-red-800 break-words">
                  <div>Error: {error?.message}</div>
                  <div className="mt-1">ID: {errorId}</div>
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }
}

// Specialized error boundaries for different use cases

// App-level error boundary (wraps entire app)
export const AppErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="app" name="Application">
    {children}
  </ErrorBoundary>
);

// Page-level error boundary (wraps page components)
export const PageErrorBoundary: React.FC<{ children: ReactNode; pageName?: string }> = ({ 
  children, 
  pageName 
}) => (
  <ErrorBoundary level="page" name={pageName}>
    {children}
  </ErrorBoundary>
);

// Component-level error boundary (wraps individual components)
export const ComponentErrorBoundary: React.FC<{ 
  children: ReactNode; 
  componentName?: string; 
  fallback?: ReactNode;
}> = ({ children, componentName, fallback }) => (
  <ErrorBoundary level="component" name={componentName} fallback={fallback}>
    {children}
  </ErrorBoundary>
);

// HOC for wrapping components with error boundaries
export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    level?: 'page' | 'component';
    name?: string;
    fallback?: ReactNode;
  }
) => {
  const { level = 'component', name, fallback } = options || {};
  
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary level={level} name={name || WrappedComponent.displayName || WrappedComponent.name} fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
};

// Error fallback components for different scenarios

// Loading error fallback
export const LoadingErrorFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mx-auto mb-3" />
      <p className="text-gray-600 mb-4">Failed to load content</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  </div>
);

// List error fallback
export const ListErrorFallback: React.FC<{ 
  title: string; 
  onRetry?: () => void;
  showHomeButton?: boolean;
}> = ({ title, onRetry, showHomeButton }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
    <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Failed to load {title}
    </h3>
    <p className="text-gray-600 mb-6">
      We encountered an error while loading the data. Please try again.
    </p>
    
    <div className="flex justify-center gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Retry
        </button>
      )}
      
      {showHomeButton && (
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
        >
          <HomeIcon className="h-4 w-4" />
          Go Home
        </button>
      )}
    </div>
  </div>
);

export default ErrorBoundary; 