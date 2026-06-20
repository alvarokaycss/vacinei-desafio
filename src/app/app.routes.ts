import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'campanhas',
    loadComponent: () => import('./campanhas/campanhas.page').then( m => m.CampanhasPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./cadastro/cadastro.page').then( m => m.CadastroPage)
  },
  {
    path: 'perfil/:id',
    loadComponent: () => import('./perfil/perfil.page').then( m => m.PerfilPage)
  },
];
