import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'agenda',
    loadComponent: () => import('./pages/agenda/agenda.page').then( m => m.AgendaPage),
    canActivate: [authGuard]
  },
  {
    path: 'horarios',
    loadComponent: () => import('./pages/horarios/horarios.page').then( m => m.HorariosPage),
    canActivate: [authGuard]
  },
  {
    path: 'sua-reserva',
    loadComponent: () => import('./pages/sua-reserva/sua-reserva.page').then( m => m.SuaReservaPage),
    canActivate: [authGuard]
  }
];