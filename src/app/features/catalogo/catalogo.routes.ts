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
        path: 'stock',
        loadComponent: () => import('./components/producto-stock/producto-stock.component').then(m => m.ProductoStockComponent)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./components/producto-reports/producto-reports.component').then(m => m.ProductoReportsComponent)
      },
      {
        path: 'mas-vendidos',
        loadComponent: () => import('./components/producto-reports/producto-reports.component').then(m => m.ProductoReportsComponent)
      },
      {
        path: 'stock-bajo',
        loadComponent: () => import('./components/producto-stock/producto-stock.component').then(m => m.ProductoStockComponent)
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
