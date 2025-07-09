# Custom Hooks Documentation

## Overview

This module provides lightweight replacements for commonly used hooks from the `react-use` library, specifically optimized for the lime-app project. These hooks maintain identical APIs while reducing bundle size.

## Migration from react-use

As part of the bundle size optimization initiative (July 2025), the project migrated from `react-use` to custom implementations to reduce the dependency footprint.

### Before (react-use):
```javascript
import { useToggle, useInterval } from "react-use";
```

### After (custom hooks):
```javascript
import { useToggle, useInterval } from "utils/hooks";
```

## Available Hooks

### useToggle

A hook for managing boolean state with toggle functionality.

```typescript
function useToggle(initialState: boolean = false): [boolean, () => void, (value: boolean) => void]
```

**Parameters:**
- `initialState` (optional): Initial boolean value, defaults to `false`

**Returns:**
- `[state, toggle, setToggle]`: Array containing current state, toggle function, and setter function

**Example:**
```javascript
import { useToggle } from "utils/hooks";

const MyComponent = () => {
    const [isOpen, toggle, setOpen] = useToggle(false);
    
    return (
        <div>
            <button onClick={toggle}>Toggle</button>
            <button onClick={() => setOpen(true)}>Open</button>
            {isOpen && <div>Content is visible</div>}
        </div>
    );
};
```

### useInterval

A hook for running effects at regular intervals.

```typescript
function useInterval(callback: () => void, delay: number | null): void
```

**Parameters:**
- `callback`: Function to execute at each interval
- `delay`: Interval delay in milliseconds, or `null` to pause

**Example:**
```javascript
import { useInterval } from "utils/hooks";

const Timer = () => {
    const [count, setCount] = useState(0);
    
    useInterval(() => {
        setCount(count + 1);
    }, 1000);
    
    return <div>Count: {count}</div>;
};
```

## Implementation Details

### useToggle Implementation

```typescript
export function useToggle(initialState: boolean = false) {
    const [state, setState] = useState(initialState);
    
    const toggle = useCallback(() => setState(prev => !prev), []);
    const setToggle = useCallback((value: boolean) => setState(value), []);
    
    return [state, toggle, setToggle] as const;
}
```

**Key Features:**
- Memoized callbacks to prevent unnecessary re-renders
- TypeScript support with proper return type inference
- Identical API to react-use's useToggle

### useInterval Implementation

```typescript
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);
    
    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    
    // Set up the interval
    useEffect(() => {
        if (delay !== null) {
            const id = setInterval(() => savedCallback.current(), delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
```

**Key Features:**
- Proper cleanup of intervals on unmount
- Callback ref pattern to avoid stale closures
- Support for pausing via `null` delay
- Identical API to react-use's useInterval

## Migration Guide

### Files Updated

The following files were migrated from react-use to custom hooks:

1. **src/components/collapsible/index.js**
   - `useToggle` for collapse/expand state

2. **src/components/list-material/list.tsx**
   - `useToggle` for list item expansion

3. **src/components/help/help.js**
   - `useToggle` for help dialog state

4. **plugins/lime-plugin-fbw/src/containers/Setting.js**
   - `useInterval` for progress updates

5. **plugins/lime-plugin-align/src/components/signalSpeech.js**
   - `useInterval` for speech synthesis timing

6. **plugins/lime-plugin-align/src/components/secondsAgo.js**
   - `useInterval` for time display updates

### Benefits of Migration

1. **Reduced Bundle Size**: Eliminated 2.3MB react-use dependency
2. **Fewer Dependencies**: Removed 23 packages from node_modules
3. **Better Tree Shaking**: Custom hooks are optimally bundled
4. **Maintenance Control**: Full control over hook implementation
5. **Performance**: Lightweight implementations without extra features

### Testing

All hooks maintain identical behavior to their react-use counterparts:

```bash
# Run tests to verify functionality
npm test

# Specific test patterns for hook usage
npm test -- --testPathPattern="(collapsible|list-material|help|Setting|signalSpeech|secondsAgo)"
```

## Future Enhancements

Potential additions to the custom hooks library:

1. **useDebounce**: For input debouncing
2. **useLocalStorage**: For persistent state
3. **useMediaQuery**: For responsive behavior
4. **usePrevious**: For tracking previous values

## Performance Considerations

- All callbacks are memoized with `useCallback`
- Interval cleanup is handled automatically
- No memory leaks from uncleaned intervals
- Minimal re-render impact

## Browser Support

These hooks support all browsers that support:
- ES6 modules
- React Hooks (React 16.8+)
- Modern JavaScript features used by Preact

Compatible with the project's target browsers for LibreRouter-OS deployment.