import { Routes } from '@angular/router';

export const INVENTARIO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'stock-list',
    pathMatch: 'full'
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
    path: 'traslado-form',
    loadComponent: () => import('./components/traslado-form/traslado-form.component').then(m => m.TrasladoFormComponent)
  },
  {
    path: 'kardex-view',
    loadComponent: () => import('./components/kardex-view/kardex-view.component').then(m => m.KardexViewComponent)
  }
];
