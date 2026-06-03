import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    path: 'auth',
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
        loadComponent: () =>
          import('./features/institutions/institutions.component').then((m) => m.InstitutionsComponent),
        path: 'institutions',
      },
      {
        loadComponent: () =>
          import('./features/accounts/accounts.component').then((m) => m.AccountsComponent),
        path: 'accounts',
      },
      {
        loadComponent: () =>
          import('./features/assets/assets.component').then((m) => m.AssetsComponent),
        path: 'assets',
      },
      {
        loadComponent: () =>
          import('./features/portfolio/portfolio.component').then((m) => m.PortfolioComponent),
        path: 'portfolio',
      },
      {
        loadComponent: () =>
          import('./features/allocation/allocation.component').then((m) => m.AllocationComponent),
        path: 'allocation',
      },
      {
        loadComponent: () =>
          import('./features/contributions/contributions.component').then((m) => m.ContributionsComponent),
        path: 'contributions',
      },
      {
        loadComponent: () =>
          import('./features/rebalancing/rebalancing.component').then((m) => m.RebalancingComponent),
        path: 'rebalancing',
      },
      {
        loadComponent: () =>
          import('./features/brokerage-notes/brokerage-notes.component').then(
            (m) => m.BrokerageNotesComponent,
          ),
        path: 'brokerage-notes',
      },
      {
        loadComponent: () =>
          import('./features/patrimony/patrimony.component').then((m) => m.PatrimonyComponent),
        path: 'patrimony',
      },
      {
        loadComponent: () =>
          import('./features/analytics/analytics.component').then((m) => m.AnalyticsComponent),
        path: 'analytics',
      },
      {
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
        path: 'settings',
      },
    ],
    loadComponent: () => import('./core/layout/shell.component').then((m) => m.ShellComponent),
    path: '',
  },
  { path: '**', redirectTo: 'auth' },
];
