"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default error UI
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="mb-2 text-2xl font-bold text-red-800">Oops! Something went wrong</h2>
          <p className="mb-4 text-red-600">
            We encountered an unexpected error. Please try again.
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mb-4 max-w-md text-left">
              <summary className="cursor-pointer text-sm font-medium text-red-700">
                Error Details (Development)
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 text-xs text-red-800">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          <Button onClick={this.resetError} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error("Error caught by useErrorHandler:", error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      // You can add error reporting here
      console.error("Unhandled error:", error);
    }
  }, [error]);

  return { error, resetError, handleError };
}

// Error fallback components
export function ProductErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <div className="mb-3 text-4xl">😵</div>
      <h3 className="mb-2 text-lg font-bold text-red-800">Product Load Failed</h3>
      <p className="mb-4 text-sm text-red-600">
        We couldn&apos;t load this product. Please try again.
      </p>
      <Button onClick={resetError} size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
        Retry
      </Button>
    </div>
  );
}

export function GridErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <div className="mb-4 text-5xl">🚫</div>
      <h3 className="mb-2 text-xl font-bold text-red-800">Failed to Load Products</h3>
      <p className="mb-4 text-red-600">
        We&apos;re having trouble loading the product grid. Please check your connection and try again.
      </p>
      <Button onClick={resetError} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
        Reload Products
      </Button>
    </div>
  );
}