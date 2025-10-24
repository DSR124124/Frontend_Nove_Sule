import { Routes } from '@angular/router';

export const INVENTARIO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'resumen-general',
    pathMatch: 'full'
  },
  // Reportes y Resúmenes
  {
    path: 'resumen-general',
    loadComponent: () => import('./components/resumen-general/resumen-general.component').then(m => m.ResumenGeneralComponent)
  },
  {
    path: 'stock-bajo',
    loadComponent: () => import('./components/stock-bajo/stock-bajo.component').then(m => m.StockBajoComponent)
  },
  {
    path: 'valor-inventario',
    loadComponent: () => import('./components/valor-inventario/valor-inventario.component').then(m => m.ValorInventarioComponent)
  },
  {
    path: 'productos-proximos-vencer',
    loadComponent: () => import('./components/productos-proximos-vencer/productos-proximos-vencer.component').then(m => m.ProductosProximosVencerComponent)
  },
  {
    path: 'reporte-movimientos',
    loadComponent: () => import('./components/reporte-movimientos/reporte-movimientos.component').then(m => m.ReporteMovimientosComponent)
  },
  {
    path: 'historial-stock',
    loadComponent: () => import('./components/historial-stock/historial-stock.component').then(m => m.HistorialStockComponent)
  },
  {
    path: 'resumen-inventario',
    loadComponent: () => import('./components/resumen-inventario/resumen-inventario.component').then(m => m.ResumenInventarioComponent)
  },
  // Gestión de Movimientos
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
  // Movimientos Relacionados - Nuevos componentes implementados
  {
    path: 'movimientos-orden-compra',
    loadComponent: () => import('./components/movimientos-orden-compra/movimientos-orden-compra.component').then(m => m.MovimientosOrdenCompraComponent)
  },
  {
    path: 'movimientos-orden-compra/:ordenCompraId',
    loadComponent: () => import('./components/movimientos-orden-compra/movimientos-orden-compra.component').then(m => m.MovimientosOrdenCompraComponent)
  },
  {
    path: 'movimientos-comprobante-venta',
    loadComponent: () => import('./components/movimientos-comprobante-venta/movimientos-comprobante-venta.component').then(m => m.MovimientosComprobanteVentaComponent)
  },
  {
    path: 'movimientos-comprobante-venta/:comprobanteVentaId',
    loadComponent: () => import('./components/movimientos-comprobante-venta/movimientos-comprobante-venta.component').then(m => m.MovimientosComprobanteVentaComponent)
  },
  {
    path: 'ultimo-movimiento-producto',
    loadComponent: () => import('./components/ultimo-movimiento-producto/ultimo-movimiento-producto.component').then(m => m.UltimoMovimientoProductoComponent)
  },
  {
    path: 'ultimo-movimiento-producto/:productoId',
    loadComponent: () => import('./components/ultimo-movimiento-producto/ultimo-movimiento-producto.component').then(m => m.UltimoMovimientoProductoComponent)
  },
];
