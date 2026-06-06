# Signals State Architecture

## Core Principle

Use Angular Signals for all reactive state. No NgRx, no RxJS subjects for state.

## Current Signals

### IpcService (root)
- `session` — `signal<{displayName, username} | null>`

### Component-local signals
- Loading states
- Lists (accounts, templates, etc.)
- Form state

## Pattern

```
Backend → IPC → IpcService (signal update) → Components (signal read)
```

## Future

All dashboard data, portfolio calculations, and rebalancer results should use signals.
