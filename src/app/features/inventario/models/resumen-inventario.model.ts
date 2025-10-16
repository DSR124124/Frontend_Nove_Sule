export interface ResumenInventario {
  productoId: number;
  productoNombre: string;
  productoCodigo: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  valorInventario: number;
  totalEntradas: number;
  totalSalidas: number;
  fechaUltimoMovimiento: string;
  ultimoMovimiento: string;
  estadoStock: 'NORMAL' | 'BAJO' | 'SOBRE_STOCK';
  precioPromedio: number;
  movimientosMes: number;
}

export interface ResumenInventarioResponse {
  success: boolean;
  message: string;
  data: ResumenInventario[];
}

export interface ResumenInventarioSingleResponse {
  success: boolean;
  message: string;
  data: ResumenInventario;
}

export interface ResumenGeneralInventario {
  totalProductos: number;
  productosConStockBajo: number;
  productosProximosVencer: number;
  valorTotalInventario: number;
  totalEntradasMes: number;
  totalSalidasMes: number;
  productosSinMovimientos: number;
  ultimaActualizacion: string;
}

export interface ResumenGeneralResponse {
  success: boolean;
  message: string;
  data: ResumenGeneralInventario;
}
