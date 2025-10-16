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
    path: 'home-supervisor',
    loadComponent: () => import('./pages/home-supervisor/home-supervisor.page').then( m => m.HomeSupervisorPage),
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
  },


  {
    path: 'reservas-supervisor',
    loadComponent: () => import('./pages/reservas-supervisor/reservas-supervisor.page').then( m => m.ReservasSupervisorPage),
    canActivate: [authGuard]
  },
  {
    path: 'controle-sala',
    loadComponent: () => import('./pages/controle-sala/controle-sala.page').then( m => m.ControleSalaPage),
    canActivate: [authGuard]
  },
  {
    path: 'historico-supervisor',
    loadComponent: () => import('./pages/historico-supervisor/historico-supervisor.page').then( m => m.HistoricoSupervisorPage),
    canActivate: [authGuard]
  },
  {
    path: 'detalhes-scan',
    loadComponent: () => import('./pages/detalhes-scan/detalhes-scan.page').then( m => m.DetalhesScanPage),
    canActivate: [authGuard]
  }
];