import React, { Component } from 'react';
import type { ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  level: 'app' | 'page' | 'component';
  name?: string;
}

export class SimpleErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any): void {
    console.error(`Error in ${this.props.level} boundary (${this.props.name}):`, error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // App-level error
      if (this.props.level === 'app') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Error</h1>
              <p className="text-gray-600 mb-6">Something went wrong. Please reload the page.</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Reload Application
              </button>
            </div>
          </div>
        );
      }

      // Page-level error
      if (this.props.level === 'page') {
        return (
          <div className="min-h-96 flex items-center justify-center bg-yellow-50 rounded-xl m-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Page Error</h2>
              <p className="text-gray-600 mb-4">This page encountered an error.</p>
              <div className="flex gap-3">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Component-level error
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-2">
          <div className="flex items-start gap-3">
            <span className="text-red-600">⚠️</span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                Component Error{this.props.name ? `: ${this.props.name}` : ''}
              </h3>
              <p className="text-sm text-red-700 mb-2">This component failed to load.</p>
              <button
                onClick={this.handleRetry}
                className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded font-medium hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Convenience wrappers
export const AppErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <SimpleErrorBoundary level="app" name="Application">
    {children}
  </SimpleErrorBoundary>
);

export const PageErrorBoundary: React.FC<{ children: ReactNode; pageName?: string }> = ({ 
  children, 
  pageName 
}) => (
  <SimpleErrorBoundary level="page" name={pageName}>
    {children}
  </SimpleErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{ 
  children: ReactNode; 
  componentName?: string; 
}> = ({ children, componentName }) => (
  <SimpleErrorBoundary level="component" name={componentName}>
    {children}
  </SimpleErrorBoundary>
);

export default SimpleErrorBoundary; 