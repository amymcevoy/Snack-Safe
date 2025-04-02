import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth/auth.page';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path:'auth',
    component: AuthPage
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'scan',
    loadComponent: () => import('./pages/scan/scan.page').then( m => m.ScanPage)
  }
];
