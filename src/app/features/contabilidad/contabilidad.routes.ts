import { Routes } from '@angular/router';

export const CONTABILIDAD_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'caja-diaria',
    pathMatch: 'full'
  },
  {
    path: 'caja-diaria',
    loadComponent: () => import('./components/caja-diaria/caja-diaria.component').then(m => m.CajaDiariaComponent)
  },
  {
    path: 'plan-cuentas',
    loadComponent: () => import('./components/plan-cuentas/plan-cuentas.component').then(m => m.PlanCuentasComponent)
  },
  {
    path: 'asientos',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/asiento-form/asiento-form.component').then(m => m.AsientoFormComponent)
      }
    ]
  },
  {
    path: 'conciliacion-bancaria',
    loadComponent: () => import('./components/conciliacion-bancaria/conciliacion-bancaria.component').then(m => m.ConciliacionBancariaComponent)
  }
];
