# API Documentation

> **Complete reference for ubus API endpoints and integration patterns in lime-app**

## Overview

This directory contains comprehensive documentation for working with LibreMesh ubus APIs in lime-app. The documentation is split into two main areas:

1. **[ubus API Reference](ubus-api-reference.md)** - Complete catalog of all available endpoints
2. **[API Patterns & Best Practices](api-patterns-best-practices.md)** - Development patterns and conventions

## Quick Navigation

### 🔍 Looking for specific information?

- **Finding an API endpoint** → [ubus API Reference](ubus-api-reference.md)
- **How to implement API calls** → [API Patterns & Best Practices](api-patterns-best-practices.md)
- **Error handling patterns** → [API Patterns - Error Handling](api-patterns-best-practices.md#error-handling-strategies)
- **Testing API functions** → [API Patterns - Testing](api-patterns-best-practices.md#testing-patterns)
- **TanStack Query integration** → [API Patterns - TanStack Query](api-patterns-best-practices.md#tanstack-query-integration)

### 📚 Documentation Structure

#### [ubus API Reference](ubus-api-reference.md)
Complete catalog of all ubus endpoints available in lime-packages, organized by service:

- **Core System Services** (session, system)
- **LibreMesh Core Services** (lime-utils, lime-utils-admin)
- **Plugin-Specific Services** (lime-fbw, lime-groundrouting, lime-location, lime-metrics)
- **Network Services** (iwinfo, wireless-service, wireless-service-admin)
- **Additional Services** (bat-hosts, check-internet, eupgrade, pirania, tmate)
- **CGI Endpoints** (file upload, hostname)

#### [API Patterns & Best Practices](api-patterns-best-practices.md)
Development patterns, conventions, and best practices for API integration:

- **Architecture Overview** - Request flow and layer responsibilities
- **File Structure Patterns** - Naming conventions and organization
- **API Implementation Patterns** - Modern vs legacy patterns
- **TanStack Query Integration** - Query hooks, mutations, optimistic updates
- **Error Handling Strategies** - Centralized error handling, graceful degradation
- **Testing Patterns** - Unit testing, integration testing, mocking
- **Performance Optimization** - Caching, batching, rate limiting
- **Security Best Practices** - Input sanitization, session management

## Common Use Cases

### 🔌 Adding a New API Endpoint

1. **Check if it exists** → [ubus API Reference](ubus-api-reference.md)
2. **Follow implementation pattern** → [API Patterns - Implementation](api-patterns-best-practices.md#api-implementation-patterns)
3. **Add TanStack Query hook** → [API Patterns - TanStack Query](api-patterns-best-practices.md#tanstack-query-integration)
4. **Write tests** → [API Patterns - Testing](api-patterns-best-practices.md#testing-patterns)
5. **Update documentation** → Add to [ubus API Reference](ubus-api-reference.md)

### 🐛 Debugging API Issues

1. **Check error patterns** → [API Patterns - Error Handling](api-patterns-best-practices.md#error-handling-strategies)
2. **Verify endpoint exists** → [ubus API Reference](ubus-api-reference.md)
3. **Check authentication** → [ubus API Reference - Authentication](ubus-api-reference.md#authentication)
4. **Test with mock data** → [API Patterns - Testing](api-patterns-best-practices.md#testing-patterns)

### 🚀 Optimizing API Performance

1. **Review caching strategy** → [API Patterns - Performance](api-patterns-best-practices.md#performance-optimization)
2. **Implement query optimization** → [API Patterns - TanStack Query](api-patterns-best-practices.md#tanstack-query-integration)
3. **Add error boundaries** → [API Patterns - Error Handling](api-patterns-best-practices.md#error-handling-strategies)
4. **Consider batching** → [API Patterns - Performance](api-patterns-best-practices.md#performance-optimization)

## Development Workflow

### 🛠️ Standard API Development Process

1. **Research** - Check existing endpoints in [ubus API Reference](ubus-api-reference.md)
2. **Design** - Follow patterns from [API Patterns & Best Practices](api-patterns-best-practices.md)
3. **Implement** - Create API function and query hook
4. **Test** - Unit tests and integration tests
5. **Document** - Update this documentation
6. **Review** - Follow code review guidelines

### 📋 API Development Checklist

- [ ] Endpoint documented in [ubus API Reference](ubus-api-reference.md)
- [ ] API function follows [implementation patterns](api-patterns-best-practices.md#api-implementation-patterns)
- [ ] TanStack Query hook implemented
- [ ] Error handling with fallbacks
- [ ] Comprehensive unit tests
- [ ] Integration tests where applicable
- [ ] Security considerations reviewed
- [ ] Performance optimizations applied
- [ ] Documentation updated

## Key Concepts

### 🌐 LibreMesh Architecture

- **ubus** - OpenWrt system bus for inter-process communication
- **JSON-RPC** - Remote procedure call protocol over HTTP
- **Session-based Auth** - Authentication using session tokens
- **Service-oriented** - Each service provides specific functionality

### 🔧 lime-app Integration

- **TanStack Query** - Modern data fetching and caching
- **Preact** - Lightweight React alternative
- **Plugin Architecture** - Modular service integration
- **Error Boundaries** - Graceful error handling

## Quick Reference

### 📡 Common API Patterns

```javascript
// Standard API function
export const getServiceData = () => {
  return api.call('service-name', 'method', {});
};

// TanStack Query hook
export const useServiceData = () => {
  return useQuery({
    queryKey: ['service-data'],
    queryFn: getServiceData,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation with optimistic updates
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateServiceData,
    onSuccess: () => {
      queryClient.invalidateQueries(['service-data']);
    },
  });
};
```

### 🔍 Error Handling

```javascript
// Robust error handling
export const getDataWithFallback = async () => {
  try {
    return await api.call('service', 'method', {});
  } catch (error) {
    if (error.message.includes('Method not found')) {
      return { available: false }; // Safe fallback
    }
    throw error;
  }
};
```

### 🧪 Testing

```javascript
// API function test
jest.mock('utils/api');
api.call.mockResolvedValue(mockData);

// Query hook test
const { result } = renderHook(() => useServiceData(), {
  wrapper: createQueryWrapper(),
});

await waitFor(() => {
  expect(result.current.isSuccess).toBe(true);
});
```

---

## See Also

- **[Development Setup](../00-quick-start/development-setup.md)** - Environment configuration
- **[Architecture Overview](../01-architecture/overview.md)** - System design
- **[Testing Strategy](../02-development/testing-strategy.md)** - Testing approaches
- **[Creating Plugins](../03-guides/creating-plugins.md)** - Plugin development

---

**Last Updated**: July 2025  
**Maintainer**: Development Team  
**Status**: ✅ Current