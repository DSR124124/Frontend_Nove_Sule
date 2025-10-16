export interface MovimientoInventario {
  id: number;
  productoId: number;
  producto: {
    id: number;
    nombre: string;
    codigo: string;
  };
  tipoMovimiento: TipoMovimiento;
  cantidad: number;
  precioUnitario: number;
  total: number;
  motivo: string;
  observaciones?: string;
  fechaMovimiento: string;
  usuarioId: number;
  usuario: {
    id: number;
    nombre: string;
    email: string;
  };
  ordenCompraId?: number;
  comprobanteVentaId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MovimientoInventarioRequest {
  productoId: number;
  tipoMovimiento: TipoMovimiento;
  cantidad: number;
  precioUnitario: number;
  motivo: string;
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
