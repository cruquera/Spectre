import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'institutions',
        loadComponent: () =>
          import('./features/institutions/institutions.component').then((m) => m.InstitutionsComponent),
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./features/accounts/accounts.component').then((m) => m.AccountsComponent),
      },
      {
        path: 'assets',
        loadComponent: () =>
          import('./features/assets/assets.component').then((m) => m.AssetsComponent),
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import('./features/portfolio/portfolio.component').then((m) => m.PortfolioComponent),
      },
      {
        path: 'allocation',
        loadComponent: () =>
          import('./features/allocation/allocation.component').then((m) => m.AllocationComponent),
      },
      {
        path: 'contributions',
        loadComponent: () =>
          import('./features/contributions/contributions.component').then((m) => m.ContributionsComponent),
      },
      {
        path: 'rebalancing',
        loadComponent: () =>
          import('./features/rebalancing/rebalancing.component').then((m) => m.RebalancingComponent),
      },
      {
        path: 'brokerage-notes',
        loadComponent: () =>
          import('./features/brokerage-notes/brokerage-notes.component').then(
            (m) => m.BrokerageNotesComponent,
          ),
      },
      {
        path: 'patrimony',
        loadComponent: () =>
          import('./features/patrimony/patrimony.component').then((m) => m.PatrimonyComponent),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/analytics/analytics.component').then((m) => m.AnalyticsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'auth' },
];
