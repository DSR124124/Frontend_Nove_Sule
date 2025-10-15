import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'listado',
    pathMatch: 'full'
  },
  {
    path: 'listado',
    loadComponent: () =>
      import('./components/usuario-list/usuario-list.component').then(c => c.UsuarioListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./components/usuario-form/usuario-form.component').then(c => c.UsuarioFormComponent)
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./components/usuario-form/usuario-form.component').then(c => c.UsuarioFormComponent)
  },
  {
    path: 'perfil/:id',
    loadComponent: () =>
      import('./components/usuario-form/usuario-form.component').then(c => c.UsuarioFormComponent)
  },
  {
    path: 'mi-perfil',
    loadComponent: () =>
      import('./components/usuario-form/usuario-form.component').then(c => c.UsuarioFormComponent)
  }
];
