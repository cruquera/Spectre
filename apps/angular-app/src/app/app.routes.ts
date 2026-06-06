import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { onboardingGuard } from './core/guards/onboarding.guard';

export const routes: Routes = [
  {
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    path: 'auth',
  },
  {
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/onboarding/onboarding-wizard.component').then((m) => m.OnboardingWizardComponent),
    path: 'onboarding',
  },
  {
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        path: 'dashboard',
      },
      {
        canActivate: [onboardingGuard],
        loadComponent: () =>
          import('./features/accounts/accounts-list.component').then((m) => m.AccountsListComponent),
        path: 'accounts',
      },
      {
        canActivate: [onboardingGuard],
        loadComponent: () =>
          import('./features/portfolio-templates/portfolio-templates-list.component').then((m) => m.PortfolioTemplatesListComponent),
        path: 'portfolio-templates',
      },
      {
        canActivate: [onboardingGuard],
        loadComponent: () =>
          import('./features/investment-portfolio/investment-portfolio.component').then((m) => m.InvestmentPortfolioComponent),
        path: 'investment-portfolio/:templateId',
      },
    ],
    loadComponent: () => import('./core/layout/shell.component').then((m) => m.ShellComponent),
    path: '',
  },
  { path: '**', redirectTo: 'auth' },
];
