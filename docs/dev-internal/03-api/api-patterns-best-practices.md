# API Patterns and Best Practices

> **Development patterns, conventions, and best practices for ubus API integration in lime-app**

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [File Structure Patterns](#file-structure-patterns)
- [API Implementation Patterns](#api-implementation-patterns)
- [TanStack Query Integration](#tanstack-query-integration)
- [Error Handling Strategies](#error-handling-strategies)
- [Testing Patterns](#testing-patterns)
- [Performance Optimization](#performance-optimization)
- [Security Best Practices](#security-best-practices)

## Architecture Overview

### Request Flow Architecture

```
Component → Hook → API Function → ubus Service → Router Backend
    ↓         ↓         ↓             ↓              ↓
[UI Layer] [Query] [Transform] [JSON-RPC] [LibreMesh Service]
```

### Layer Responsibilities

1. **UI Layer**: Components consume hooks, handle loading states
2. **Query Layer**: TanStack Query for caching, optimization, state management
3. **Transform Layer**: API functions handle data transformation and validation
4. **JSON-RPC Layer**: ubus communication protocol
5. **Service Layer**: LibreMesh backend services

## File Structure Patterns

### Standard Plugin API Structure

```
plugins/lime-plugin-example/
├── src/
│   ├── exampleApi.js          # API functions
│   ├── exampleQueries.js      # TanStack Query hooks
│   ├── exampleApi.spec.js     # API tests
│   └── components/
│       └── ExamplePage.js     # UI components
```

### API File Naming Conventions

- **API Functions**: `pluginNameApi.js` (e.g., `notesApi.js`)
- **Query Hooks**: `pluginNameQueries.js` (e.g., `notesQueries.js`)
- **API Tests**: `pluginNameApi.spec.js`
- **Legacy Promise**: `pluginNameApi.js` (contains both patterns during migration)

## API Implementation Patterns

### 1. Modern API Function Pattern

```javascript
// src/exampleApi.js
import api from 'utils/api';

/**
 * Get example data
 * @returns {Promise<Object>} Example data
 */
export const getExampleData = () => {
  return api.call('lime-example', 'get_data', {});
};

/**
 * Update example data
 * @param {Object} data - Data to update
 * @returns {Promise<boolean>} Success status
 */
export const updateExampleData = (data) => {
  return api.call('lime-example', 'set_data', { data });
};
```

### 2. Legacy Promise Pattern (Being Phased Out)

```javascript
// Legacy pattern - avoid in new code
export const getExampleDataPromise = () => {
  return new Promise((resolve, reject) => {
    api.call('lime-example', 'get_data', {})
      .then(resolve)
      .catch(reject);
  });
};
```

### 3. Error Handling with Fallbacks

```javascript
// Robust API with fallback for optional services
export const getOptionalService = async () => {
  try {
    const response = await api.call('optional-service', 'get_status', {});
    return response;
  } catch (error) {
    if (error.message.includes('Method not found')) {
      // Service not available, return safe default
      return { enabled: false, available: false };
    }
    throw error; // Re-throw unexpected errors
  }
};
```

### 4. Parameter Validation Pattern

```javascript
// API function with input validation
export const setNodeLocation = (lat, lon) => {
  // Validate inputs
  if (!lat || !lon) {
    throw new Error('Latitude and longitude are required');
  }
  
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  
  if (isNaN(latNum) || isNaN(lonNum)) {
    throw new Error('Invalid coordinates provided');
  }
  
  if (latNum < -90 || latNum > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  
  if (lonNum < -180 || lonNum > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }
  
  return api.call('lime-location', 'set', {
    lat: latNum.toString(),
    lon: lonNum.toString()
  });
};
```

## TanStack Query Integration

### 1. Query Hook Pattern

```javascript
// src/exampleQueries.js
import { useQuery } from '@tanstack/react-query';
import { getExampleData } from './exampleApi';

export const useExampleData = () => {
  return useQuery({
    queryKey: ['example-data'],
    queryFn: getExampleData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```

### 2. Mutation Hook Pattern

```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateExampleData } from './exampleApi';

export const useUpdateExampleData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateExampleData,
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['example-data'] });
      
      // Optional: Update cache optimistically
      queryClient.setQueryData(['example-data'], data);
    },
    onError: (error) => {
      console.error('Failed to update example data:', error);
    },
  });
};
```

### 3. Optimistic Updates Pattern

```javascript
export const useUpdateNotesOptimistic = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateNotes,
    onMutate: async (newNotes) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notes'] });
      
      // Snapshot previous value
      const previousNotes = queryClient.getQueryData(['notes']);
      
      // Optimistically update
      queryClient.setQueryData(['notes'], { notes: newNotes });
      
      return { previousNotes };
    },
    onError: (err, newNotes, context) => {
      // Rollback on error
      queryClient.setQueryData(['notes'], context.previousNotes);
    },
    onSettled: () => {
      // Refetch after success or error
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
```

### 4. Dependent Queries Pattern

```javascript
export const useNodeDetails = (nodeId) => {
  return useQuery({
    queryKey: ['node-details', nodeId],
    queryFn: () => getNodeDetails(nodeId),
    enabled: !!nodeId, // Only run if nodeId is truthy
    staleTime: 2 * 60 * 1000,
  });
};

export const useNodeMetrics = (nodeId) => {
  return useQuery({
    queryKey: ['node-metrics', nodeId],
    queryFn: () => getNodeMetrics(nodeId),
    enabled: !!nodeId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
```

## Error Handling Strategies

### 1. Centralized Error Handling

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.message.includes('Permission denied')) {
    // Redirect to login
    window.location.href = '/login';
    return;
  }
  
  if (error.message.includes('Method not found')) {
    // Service not available
    console.warn('Service not available:', error.message);
    return null;
  }
  
  // Log other errors
  console.error('API Error:', error);
  throw error;
};

// Usage in API function
export const getDataWithErrorHandling = async () => {
  try {
    return await api.call('service', 'method', {});
  } catch (error) {
    return handleApiError(error);
  }
};
```

### 2. Query Error Boundaries

```javascript
// components/ErrorBoundary.js
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

export const QueryErrorBoundary = ({ children }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div className="error-boundary">
              <h2>Something went wrong</h2>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
```

### 3. Graceful Degradation Pattern

```javascript
export const useServiceWithFallback = () => {
  const query = useQuery({
    queryKey: ['optional-service'],
    queryFn: getOptionalService,
    retry: false, // Don't retry for optional services
    staleTime: Infinity, // Cache failure indefinitely
  });
  
  return {
    data: query.data,
    isLoading: query.isLoading,
    isAvailable: !query.isError,
    error: query.error,
  };
};
```

## Testing Patterns

### 1. API Function Testing

```javascript
// src/exampleApi.spec.js
import { getExampleData, updateExampleData } from './exampleApi';
import api from 'utils/api';

// Mock the API
jest.mock('utils/api');

describe('exampleApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getExampleData', () => {
    it('calls the correct API endpoint', async () => {
      const mockResponse = { data: 'test' };
      api.call.mockResolvedValue(mockResponse);

      const result = await getExampleData();

      expect(api.call).toHaveBeenCalledWith('lime-example', 'get_data', {});
      expect(result).toEqual(mockResponse);
    });

    it('handles API errors', async () => {
      const mockError = new Error('API Error');
      api.call.mockRejectedValue(mockError);

      await expect(getExampleData()).rejects.toThrow('API Error');
    });
  });

  describe('updateExampleData', () => {
    it('sends correct parameters', async () => {
      const testData = { key: 'value' };
      api.call.mockResolvedValue(true);

      await updateExampleData(testData);

      expect(api.call).toHaveBeenCalledWith('lime-example', 'set_data', {
        data: testData
      });
    });
  });
});
```

### 2. Query Hook Testing

```javascript
// src/exampleQueries.spec.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExampleData } from './exampleQueries';
import { getExampleData } from './exampleApi';

jest.mock('./exampleApi');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useExampleData', () => {
  it('returns data when API call succeeds', async () => {
    const mockData = { data: 'test' };
    getExampleData.mockResolvedValue(mockData);

    const { result } = renderHook(() => useExampleData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });

  it('handles errors correctly', async () => {
    const mockError = new Error('API Error');
    getExampleData.mockRejectedValue(mockError);

    const { result } = renderHook(() => useExampleData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
```

### 3. Component Integration Testing

```javascript
// src/components/ExamplePage.spec.js
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExamplePage } from './ExamplePage';
import { getExampleData } from '../exampleApi';

jest.mock('../exampleApi');

const renderWithQuery = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ExamplePage', () => {
  it('displays loading state initially', () => {
    getExampleData.mockImplementation(() => new Promise(() => {}));
    
    renderWithQuery(<ExamplePage />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays data when loaded', async () => {
    const mockData = { message: 'Hello World' };
    getExampleData.mockResolvedValue(mockData);

    renderWithQuery(<ExamplePage />);

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });

  it('displays error message on failure', async () => {
    getExampleData.mockRejectedValue(new Error('API Error'));

    renderWithQuery(<ExamplePage />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

## Performance Optimization

### 1. Query Optimization

```javascript
// Efficient query configuration
export const useNodesData = () => {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: getNodesData,
    staleTime: 5 * 60 * 1000, // Don't refetch for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Disable refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    select: (data) => {
      // Transform data to reduce re-renders
      return data.nodes.map(node => ({
        id: node.id,
        name: node.hostname,
        status: node.status === 'online'
      }));
    },
  });
};
```

### 2. Batching API Calls

```javascript
// Batch multiple API calls efficiently
export const useDashboardData = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['system-info'],
        queryFn: getSystemInfo,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['network-status'],
        queryFn: getNetworkStatus,
        staleTime: 30 * 1000,
      },
      {
        queryKey: ['node-metrics'],
        queryFn: getNodeMetrics,
        staleTime: 60 * 1000,
      },
    ],
  });

  return {
    systemInfo: queries[0].data,
    networkStatus: queries[1].data,
    nodeMetrics: queries[2].data,
    isLoading: queries.some(q => q.isLoading),
    isError: queries.some(q => q.isError),
  };
};
```

### 3. Infinite Queries for Large Data

```javascript
// For paginated data
export const useInfiniteNodes = () => {
  return useInfiniteQuery({
    queryKey: ['nodes-infinite'],
    queryFn: ({ pageParam = 0 }) => getNodesPage(pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};
```

## Security Best Practices

### 1. Input Sanitization

```javascript
// Sanitize inputs before sending to API
import DOMPurify from 'dompurify';

export const setNodeNotes = (notes) => {
  // Sanitize HTML content
  const sanitizedNotes = DOMPurify.sanitize(notes);
  
  // Validate length
  if (sanitizedNotes.length > 1000) {
    throw new Error('Notes too long (max 1000 characters)');
  }
  
  return api.call('lime-utils', 'set_notes', {
    notes: sanitizedNotes
  });
};
```

### 2. Session Management

```javascript
// Secure session handling
export const useAuthenticatedApi = () => {
  const checkSession = async () => {
    try {
      const session = await api.call('session', 'access', {});
      return session['access-group']?.root === true;
    } catch (error) {
      return false;
    }
  };

  return { checkSession };
};
```

### 3. Rate Limiting

```javascript
// Client-side rate limiting
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.requests = [];
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async throttle(fn, ...args) {
    const now = Date.now();
    
    // Remove old requests
    this.requests = this.requests.filter(
      time => now - time < this.windowMs
    );
    
    if (this.requests.length >= this.maxRequests) {
      throw new Error('Rate limit exceeded');
    }
    
    this.requests.push(now);
    return fn(...args);
  }
}

const limiter = new RateLimiter(5, 60000); // 5 requests per minute

export const rateLimitedApiCall = (service, method, params) => {
  return limiter.throttle(api.call, service, method, params);
};
```

## Migration Patterns

### 1. Redux to TanStack Query Migration

```javascript
// Old Redux pattern (deprecated)
const mapStateToProps = (state) => ({
  notes: state.notes.data,
  loading: state.notes.loading,
  error: state.notes.error,
});

// New TanStack Query pattern
const NotesComponent = () => {
  const { data: notes, isLoading, error } = useNotes();
  
  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  
  return <div>{notes}</div>;
};
```

### 2. Promise to Async/Await Migration

```javascript
// Old Promise pattern
export const getDataOld = () => {
  return new Promise((resolve, reject) => {
    api.call('service', 'method', {})
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

// New async/await pattern
export const getDataNew = async () => {
  try {
    return await api.call('service', 'method', {});
  } catch (error) {
    throw error;
  }
};
```

## Development Workflow

### 1. Adding New API Endpoint

1. **Create API function** in `pluginApi.js`
2. **Add tests** in `pluginApi.spec.js`
3. **Create query hook** in `pluginQueries.js`
4. **Test query hook** in `pluginQueries.spec.js`
5. **Integrate in component** with proper error handling
6. **Add to this documentation**

### 2. API Development Checklist

- [ ] API function with proper error handling
- [ ] Input validation and sanitization
- [ ] Comprehensive unit tests
- [ ] TanStack Query integration
- [ ] Error boundary implementation
- [ ] Loading states handled
- [ ] Optimistic updates where appropriate
- [ ] Security considerations reviewed
- [ ] Performance optimization applied
- [ ] Documentation updated

### 3. Code Review Guidelines

**API Functions:**
- Clear function names and documentation
- Proper error handling with meaningful messages
- Input validation where needed
- Consistent return types

**Query Hooks:**
- Appropriate cache configuration
- Error handling strategy
- Loading states management
- Optimistic updates where beneficial

**Components:**
- Proper loading states
- Error boundaries
- Accessibility considerations
- Performance optimizations

---

This guide provides comprehensive patterns for building robust, performant, and secure API integrations in lime-app. Follow these patterns to ensure consistency and maintainability across the codebase.

**Last Updated**: July 2025  
**Version**: Based on lime-app v4-foundation