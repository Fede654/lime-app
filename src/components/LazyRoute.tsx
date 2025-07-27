import { Suspense, useState, useEffect } from "preact/compat";

interface LazyRouteProps {
  component: any; // Lazy component
  fallback?: JSX.Element;
  [key: string]: any; // Pass through other props
}

// Loading fallback component
const DefaultFallback = () => (
  <div class="flex items-center justify-center min-h-32 p-8">
    <div class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading plugin...</p>
    </div>
  </div>
);

// Error boundary for lazy loading failures
const LazyErrorBoundary = ({ children, onError }: { children: any; onError: () => void }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('Loading chunk')) {
        setHasError(true);
        onError();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);

  if (hasError) {
    return (
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <h3 class="text-red-800 font-semibold mb-2">Plugin Loading Error</h3>
        <p class="text-red-600 mb-4">
          Failed to load plugin. This might be due to a network issue or the plugin being unavailable.
        </p>
        <button
          onClick={() => window.location.reload()}
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return children;
};

export const LazyRoute = ({ component: Component, fallback, ...props }: LazyRouteProps) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
    console.error('Failed to load lazy plugin component');
  };

  if (error) {
    return (
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 m-4">
        <h3 class="text-yellow-800 font-semibold mb-2">Plugin Unavailable</h3>
        <p class="text-yellow-600">
          This plugin couldn't be loaded. Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <LazyErrorBoundary onError={handleError}>
      <Suspense fallback={fallback || <DefaultFallback />}>
        <Component {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );
};

export default LazyRoute;