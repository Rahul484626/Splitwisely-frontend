import type { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'activity',
    canActivate: [authGuard],
    loadComponent: () => import('./features/activity/activity.page').then((m) => m.ActivityPage),
  },
  {
    path: 'groups',
    canActivate: [authGuard],
    loadComponent: () => import('./features/groups/groups.page').then((m) => m.GroupsPage),
  },
  {
    path: 'groups/:groupId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/groups/group-detail.page').then((m) => m.GroupDetailPage),
  },
  {
    path: 'groups/:groupId/expenses/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/expenses/add-expense.page').then((m) => m.AddExpensePage),
  },
  {
    path: 'groups/:groupId/settle',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/settlements/settle-up.page').then((m) => m.SettleUpPage),
  },
  {
    path: 'home',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
