import { MovimientoInventario } from './movimiento-inventario.model';

export interface HistorialStockResponse {
  success: boolean;
  message: string;
  data: MovimientoInventario[];
}

export interface HistorialStockRequest {
  productoId: number;
  fechaInicio: string;
  fechaFin: string;
}
