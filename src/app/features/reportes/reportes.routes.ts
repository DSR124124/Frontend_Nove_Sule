import { Routes } from '@angular/router';

export const REPORTES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'ventas-por-dia',
    pathMatch: 'full'
  },
  {
    path: 'ventas-por-dia',
    loadComponent: () => import('./components/ventas-por-dia/ventas-por-dia.component').then(m => m.VentasPorDiaComponent)
  },
  {
    path: 'margen-por-producto',
    loadComponent: () => import('./components/margen-por-producto/margen-por-producto.component').then(m => m.MargenPorProductoComponent)
  },
  {
    path: 'rotacion-inventario',
    loadComponent: () => import('./components/rotacion-inventario/rotacion-inventario.component').then(m => m.RotacionInventarioComponent)
  },
  {
    path: 'flujo-caja',
    loadComponent: () => import('./components/flujo-caja/flujo-caja.component').then(m => m.FlujoCajaComponent)
  }
];
