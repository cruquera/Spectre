# Sprint 2 Changelog

## Created

- `docs/changelog/sprint-02.md`
- `docs/sprints/sprint-02.md`

## Refactored

- `prisma/user-schema.prisma` — added `onboardingCurrentStep` to UserProfile
- `backend/src/modules/onboarding/application/onboarding-service.ts` — persists currentStep, proper state transitions
- `backend/src/shared/database/migrate.ts` — detects onboardingCurrentStep column
- `backend/src/shared/database/sql/user-init.sql` — added onboardingCurrentStep column
- `apps/angular-app/src/app/features/onboarding/onboarding-wizard.component.ts` — step 2 functional with 17 asset classes, percentage validation, template creation
- `apps/angular-app/src/app/features/onboarding/onboarding-wizard.component.html` — step 2 form with asset class selector, percentage input, validation feedback
- `apps/angular-app/src/app/features/accounts/accounts-list.component.ts` — inline account creation form, delete functionality
- `apps/angular-app/src/app/features/accounts/accounts-list.component.html` — redesigned with create form, account list with avatars, remove button
- `apps/angular-app/src/app/core/layout/shell.component.html` — sidebar hidden until onboarding completes

## Removed

- Unused `Injectable` import from `onboarding.guard.ts`
- Unused `PortfolioAssetTarget` import from `portfolio-template-repository.ts`
- `RouterLink` import from `accounts-list.component.ts`

## Known Issues

- Step 3 (First Contribution) is still a placeholder
- No GBP in pre-existing accounts component
- Pre-existing lint errors in profile-select, account-repository modules
