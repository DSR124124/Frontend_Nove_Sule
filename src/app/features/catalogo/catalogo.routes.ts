import { Routes } from '@angular/router';

export const CATALOGO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path: 'productos',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/producto-list/producto-list.component').then(m => m.ProductoListComponent)
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./components/producto-form/producto-form.component').then(m => m.ProductoFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./components/producto-form/producto-form.component').then(m => m.ProductoFormComponent)
      }
    ]
  },
  {
    path: 'categorias',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/categoria-list/categoria-list.component').then(m => m.CategoriaListComponent)
      }
    ]
  },
  {
    path: 'proveedores',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/proveedor-list/proveedor-list.component').then(m => m.ProveedorListComponent)
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./components/proveedor-form/proveedor-form.component').then(m => m.ProveedorFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./components/proveedor-form/proveedor-form.component').then(m => m.ProveedorFormComponent)
      }
    ]
  }
];
