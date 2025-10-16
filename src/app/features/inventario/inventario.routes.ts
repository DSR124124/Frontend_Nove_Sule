import { Routes } from '@angular/router';

export const INVENTARIO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'movimientos',
    pathMatch: 'full'
  },
  {
    path: 'movimientos',
    loadComponent: () => import('./components/movimiento-list/movimiento-list.component').then(m => m.MovimientoListComponent)
  },
  {
    path: 'movimientos/nuevo',
    loadComponent: () => import('./components/movimiento-form/movimiento-form.component').then(m => m.MovimientoFormComponent)
  },
  {
    path: 'movimientos/editar/:id',
    loadComponent: () => import('./components/movimiento-form/movimiento-form.component').then(m => m.MovimientoFormComponent)
  },
  {
    path: 'stock-list',
    loadComponent: () => import('./components/stock-list/stock-list.component').then(m => m.StockListComponent)
  },
  {
    path: 'ajuste-form',
    loadComponent: () => import('./components/ajuste-form/ajuste-form.component').then(m => m.AjusteFormComponent)
  },

  {
    path: 'kardex-view',
    loadComponent: () => import('./components/kardex-view/kardex-view.component').then(m => m.KardexViewComponent)
  }
];
