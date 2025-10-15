import { Routes } from '@angular/router';

export const VENTAS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'pos-terminal',
    pathMatch: 'full'
  },
  {
    path: 'pos-terminal',
    loadComponent: () => import('./components/pos-terminal/pos-terminal.component').then(m => m.PosTerminalComponent)
  },
  {
    path: 'comprobantes',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/comprobante-list/comprobante-list.component').then(m => m.ComprobanteListComponent)
      }
    ]
  },
  {
    path: 'carrito',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/carrito-resumen/carrito-resumen.component').then(m => m.CarritoResumenComponent)
      }
    ]
  },
  {
    path: 'pago',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/pago-form/pago-form.component').then(m => m.PagoFormComponent)
      }
    ]
  }
];
