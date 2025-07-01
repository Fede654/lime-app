# Testing Guide

LimeApp uses a comprehensive testing strategy to ensure reliability and maintainability.

## Testing Stack

- **Jest**: Testing framework
- **Testing Library**: DOM testing utilities
- **Preact Testing Library**: Preact-specific helpers

## Test Types

### 1. Component Tests
Test user interactions and UI behavior by mocking API endpoints.

**Location**: `plugins/lime-plugin-<name>/<name>.spec.js`

**Example**:
```javascript
import { fireEvent, cleanup, act, screen } from '@testing-library/preact';
import '@testing-library/jest-dom';
import { render } from 'utils/test_utils';
import RemoteSupportPage from './src/remoteSupportPage';
import { getSession, openSession, closeSession } from './src/remoteSupportApi';

jest.mock('./src/remoteSupportApi');

describe('Remote Support Page', () => {
  beforeEach(() => {
    getSession.mockImplementation(async () => ({
      rw_ssh: 'ssh -p2222 test_token@test_host'
    }));
    openSession.mockImplementation(async () => null);
    closeSession.mockImplementation(async () => null);
  });

  afterEach(() => {
    cleanup();
    act(() => queryCache.clear());
  });

  it('shows create session button when no session exists', async () => {
    getSession.mockImplementation(async () => null);
    render(<RemoteSupportPage />);
    expect(await screen.findByRole('button', {name: /create session/i})).toBeEnabled();
  });
});
```

### 2. API Tests
Test backend communication and data transformations.

**Location**: `plugins/lime-plugin-<name>/src/<name>Api.spec.js`

**Example**:
```javascript
import api from 'utils/uhttpd.service';
import { getSession, openSession, closeSession } from './remoteSupportApi';

jest.mock('utils/uhttpd.service');

beforeEach(() => {
  api.call.mockClear();
  api.call.mockImplementation(async () => ({ status: 'ok' }));
});

describe('getSession', () => {
  it('calls the expected endpoint', async () => {
    await getSession();
    expect(api.call).toBeCalledWith('tmate', 'get_session', {});
  });

  it('resolves to session when connected', async () => {
    const sessionData = { rw_ssh: 'ssh -p2222 token@host' };
    api.call.mockImplementation(async () => ({
      status: 'ok',
      session: sessionData
    }));
    const session = await getSession();
    expect(session).toEqual(sessionData);
  });
});
```

## Running Tests

### All Tests
```bash
npm test                        # Run all tests
npm test -- --watch            # Run tests in watch mode
npm test -- --coverage         # Run tests with coverage report
```

### Specific Tests
```bash
npm run test plugins/lime-plugin-remotesupport/remoteSupport.spec.js
npm run test plugins/lime-plugin-remotesupport/src/remoteSupportApi.spec.js
```

### Test Utilities
```bash
npm run clear-jest              # Clear Jest cache
```

## Test Development Workflow

### 1. Test-Driven Development (TDD)
1. **Write failing test**: Define expected behavior
2. **Implement minimum code**: Make test pass
3. **Refactor**: Improve code while tests pass
4. **Repeat**: Add more tests and features

### 2. Component Testing Pattern
1. **Mock API endpoints**: Define empty functions first
2. **Write component tests**: Test user interactions
3. **Implement component**: Make tests pass
4. **Write API tests**: Test backend calls
5. **Implement API**: Make API tests pass

### 3. Progressive Test Enabling
Use `it.skip()` to mark tests as pending:
```javascript
it.skip('shows error when API fails', async () => {
  // Test implementation
});
```

Gradually enable tests from simple to complex as you implement features.

## Testing Best Practices

### Component Tests
- **Test user behavior**: Focus on what users do and see
- **Mock external dependencies**: API calls, services
- **Use semantic queries**: `getByRole`, `getByText`, `getByLabelText`
- **Test error states**: Network failures, validation errors
- **Clean up**: Clear query cache between tests

### API Tests
- **Test endpoint calls**: Verify correct service/method/params
- **Test data transformations**: Input → Output mapping
- **Test error handling**: Network failures, API errors
- **Mock uhttpd service**: Don't make real backend calls

### General Guidelines
- **Descriptive test names**: Clearly state what is being tested
- **Arrange-Act-Assert pattern**: Setup → Action → Verification
- **Independent tests**: Each test should work in isolation
- **Fast execution**: Mock slow operations

## Mocking Strategies

### API Mocking
```javascript
// Mock the entire API module
jest.mock('./src/remoteSupportApi');

// Mock specific functions
import { getSession } from './src/remoteSupportApi';
getSession.mockImplementation(async () => mockData);
```

### uHTTPd Service Mocking
```javascript
import api from 'utils/uhttpd.service';
jest.mock('utils/uhttpd.service');

api.call.mockImplementation(async (service, method, params) => {
  return { status: 'ok', data: mockResponse };
});
```

### Query Cache Management
```javascript
import { act } from '@testing-library/preact';
import queryCache from 'utils/queryCache';

afterEach(() => {
  cleanup();
  act(() => queryCache.clear()); // Important: Clear cache between tests
});
```

## Test Configuration

### Jest Configuration
Located in `jest.config.js`:
- Path mapping for imports
- Test environment setup
- Coverage configuration
- Mock setup

### Test Utilities
`utils/test_utils.js` provides:
- `render()`: Renders components with React Query context
- Mock providers for testing
- Common test setup functions

## Common Testing Patterns

### Testing Loading States
```javascript
it('shows loading indicator while fetching data', async () => {
  getSession.mockImplementation(() => new Promise(() => {})); // Never resolves
  render(<RemoteSupportPage />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

### Testing Error States
```javascript
it('shows error message when API fails', async () => {
  getSession.mockImplementation(async () => {
    throw new Error('Network error');
  });
  render(<RemoteSupportPage />);
  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
```

### Testing Form Interactions
```javascript
it('submits form with correct data', async () => {
  render(<ConfigForm />);
  
  fireEvent.change(screen.getByLabelText(/hostname/i), {
    target: { value: 'new-hostname' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /save/i }));
  
  expect(updateHostname).toHaveBeenCalledWith('new-hostname');
});
```

### Testing Async Updates
```javascript
it('updates UI after successful API call', async () => {
  render(<RemoteSupportPage />);
  
  fireEvent.click(screen.getByRole('button', { name: /create session/i }));
  
  expect(await screen.findByText(/session created/i)).toBeInTheDocument();
});
```

## Debugging Tests

### Common Issues
1. **Query cache not cleared**: Tests affect each other
2. **Async operations not awaited**: Use `findBy*` queries
3. **Mocks not reset**: Use `mockClear()` in `beforeEach`
4. **Real API calls**: Ensure all external services are mocked

### Debugging Tools
```javascript
// Debug rendered output
import { screen } from '@testing-library/preact';
screen.debug(); // Prints current DOM

// Debug queries
screen.getByRole('button'); // Throws if not found
screen.queryByRole('button'); // Returns null if not found
screen.findByRole('button'); // Waits for element to appear
```

### Async Testing Tips
- Use `findBy*` for elements that appear after async operations
- Use `waitFor()` for complex async conditions
- Always `await` async operations in tests
- Use `act()` for React state updates

## Coverage Goals

Current testing approach focuses on:
- Critical user workflows
- Error handling
- API integration points
- Component rendering logic

Target coverage areas:
- Plugin components: High priority
- API endpoints: High priority  
- Utility functions: Medium priority
- Legacy Redux code: Low priority (being phased out)