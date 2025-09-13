import { Routes } from '@angular/router';

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
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'agenda',
    loadComponent: () => import('./pages/agenda/agenda.page').then( m => m.AgendaPage)
  },  {
    path: 'horarios',
    loadComponent: () => import('./pages/horarios/horarios.page').then( m => m.HorariosPage)
  },
  {
    path: 'horarios',
    loadComponent: () => import('./pages/horarios/horarios.page').then( m => m.HorariosPage)
  },
  {
    path: 'sua-reserva',
    loadComponent: () => import('./pages/sua-reserva/sua-reserva.page').then( m => m.SuaReservaPage)
  },



];
