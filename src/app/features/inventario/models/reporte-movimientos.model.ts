import { MovimientoInventario } from './movimiento-inventario.model';

export interface ReporteMovimientosResponse {
  success: boolean;
  message: string;
  data: MovimientoInventario[];
}

export interface ReporteMovimientosRequest {
  productoId?: number;
  tipoMovimiento?: string;
  fechaInicio?: string;
  fechaFin?: string;
}
