export interface MovimientoInventario {
  id: number;
  productoId: number;
  productoCodigo: string;
  productoNombre: string;
  tipoMovimiento: TipoMovimiento;
  cantidad: number;
  precioUnitario: number;
  concepto: string;
  observaciones?: string;
  usuarioNombre: string;
  ordenCompraId?: number;
  ordenCompraNumero?: string;
  comprobanteVentaId?: number;
  comprobanteVentaNumero?: string;
  fechaMovimiento: string;
  stockAnterior: number;
  stockNuevo: number;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface MovimientoInventarioRequest {
  productoId: number;
  tipoMovimiento: TipoMovimiento;
  cantidad: number;
  precioUnitario: number;
  concepto: string;
  observaciones?: string;
  ordenCompraId?: number;
  comprobanteVentaId?: number;
}

export interface MovimientoInventarioFiltros {
  productoId?: number;
  tipoMovimiento?: TipoMovimiento;
  fechaInicio?: string;
  fechaFin?: string;
  page?: number;
  size?: number;
}

export enum TipoMovimiento {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
  AJUSTE = 'AJUSTE',
  TRANSFERENCIA = 'TRANSFERENCIA'
}

export interface MovimientoInventarioBusqueda {
  productoId?: number;
  tipoMovimiento?: TipoMovimiento;
  fechaInicio?: string;
  fechaFin?: string;
  limite?: number;
}
