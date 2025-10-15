import { Routes } from '@angular/router';
import { LayoutMainComponent } from './layout/components/layout-main/layout-main.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta de login (pública)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
  },

  // Rutas públicas de autenticación
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },

  // Rutas protegidas con layout (requieren autenticación)
  {
    path: '',
    component: LayoutMainComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'catalogo',
        loadChildren: () =>
          import('./features/catalogo/catalogo.routes').then(m => m.CATALOGO_ROUTES),
      },
      {
        path: 'inventario',
        loadChildren: () =>
          import('./features/inventario/inventario.routes').then(m => m.INVENTARIO_ROUTES),
      },
      {
        path: 'compras',
        loadChildren: () =>
          import('./features/compras/compras.routes').then(m => m.COMPRAS_ROUTES),
      },
      {
        path: 'ventas',
        loadChildren: () =>
          import('./features/ventas/ventas.routes').then(m => m.VENTAS_ROUTES),
      },
      {
        path: 'contabilidad',
        loadChildren: () =>
          import('./features/contabilidad/contabilidad.routes').then(m => m.CONTABILIDAD_ROUTES),
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('./features/reportes/reportes.routes').then(m => m.REPORTES_ROUTES),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./features/usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES),
      },
    ],
  },

  // fallback - redirigir a login si no se encuentra la ruta
  { path: '**', redirectTo: 'login' },
];
