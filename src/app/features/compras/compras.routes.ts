import { Routes } from '@angular/router';

export const COMPRAS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'ordenes',
    pathMatch: 'full'
  },
  {
    path: 'ordenes',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/orden-compra-list/orden-compra-list.component').then(m => m.OrdenCompraListComponent)
      },
      {
        path: 'nueva',
        loadComponent: () => import('./components/orden-compra-form/orden-compra-form.component').then(m => m.OrdenCompraFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./components/orden-compra-form/orden-compra-form.component').then(m => m.OrdenCompraFormComponent)
      }
    ]
  },
  {
    path: 'recepciones',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/recepcion-form/recepcion-form.component').then(m => m.RecepcionFormComponent)
      }
    ]
  },
  {
    path: 'facturas',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/factura-compra-form/factura-compra-form.component').then(m => m.FacturaCompraFormComponent)
      }
    ]
  }
];
