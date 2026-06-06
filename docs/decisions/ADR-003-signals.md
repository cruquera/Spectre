# ADR-003: Angular Signals as Primary State

## Status

Accepted

## Context

Angular 16+ introduced Signals as a new reactivity primitive. The project uses Angular 21.

## Decision

Use Angular Signals for all reactive state management. No NgRx, no external state libraries.

## Consequences

- Simpler state management
- Better integration with Angular change detection
- No additional dependencies
- More verbose for complex state transformations
- Signals API still evolving in Angular
