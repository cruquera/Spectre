import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { tourGuard } from './core/guards/tour.guard';

export const routes: Routes = [
  {
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    path: 'auth',
  },
  {
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tour/tour-wizard.component').then((m) => m.TourWizardComponent),
    path: 'tour',
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
        canActivate: [tourGuard],
        loadComponent: () =>
          import('./features/accounts/accounts-list.component').then((m) => m.AccountsListComponent),
        path: 'accounts',
      },
      {
        canActivate: [tourGuard],
        loadComponent: () =>
          import('./features/projects/projects-list.component').then((m) => m.ProjectsListComponent),
        path: 'projects',
      },
      {
        canActivate: [tourGuard],
        loadComponent: () =>
          import('./features/real-portfolio/real-portfolio.component').then((m) => m.RealPortfolioComponent),
        path: 'real-portfolio/:projectId',
      },
    ],
    loadComponent: () => import('./core/layout/shell.component').then((m) => m.ShellComponent),
    path: '',
  },
  { path: '**', redirectTo: 'auth' },
];
