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
        path: 'listado',
        loadComponent: () => import('./components/producto-list/producto-list.component').then(m => m.ProductoListComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./components/producto-form/producto-form.component').then(m => m.ProductoFormComponent)
      },
      {
        path: 'buscar',
        loadComponent: () => import('./components/producto-search/producto-search.component').then(m => m.ProductoSearchComponent)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./components/producto-reports/producto-reports.component').then(m => m.ProductoReportsComponent)
      },
    ]
  },
  {
    path: 'categorias',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/categoria-list/categoria-list.component').then(m => m.CategoriaListComponent)
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./components/categoria-form/categoria-form.component').then(m => m.CategoriaFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./components/categoria-form/categoria-form.component').then(m => m.CategoriaFormComponent)
      }
    ]
  },
      {
        path: 'marcas',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/marca-list/marca-list.component').then(m => m.MarcaListComponent)
          },
          {
            path: 'nuevo',
            loadComponent: () => import('./components/marca-form/marca-form.component').then(m => m.MarcaFormComponent)
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('./components/marca-form/marca-form.component').then(m => m.MarcaFormComponent)
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
