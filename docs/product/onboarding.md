# Onboarding Flow

## States

- `NOT_STARTED` — first access
- `IN_PROGRESS` — wizard active
- `ABANDONED` — user exited mid-flow
- `COMPLETED` — all steps done

## Steps

1. **Account Registration** — create financial accounts (Banco Inter, Nubank, etc.)
2. **Portfolio Template** — define target allocation
3. **First Contribution** — optional initial investment
4. **Completion** — redirect to dashboard

## Behavior

- Progress is persisted locally
- Closing the app: resume from saved step
- Abandoning: reset progress
- Before completion: sidebar is hidden
- After completion: only Dashboard, Accounts, and Portfolio Templates are available
