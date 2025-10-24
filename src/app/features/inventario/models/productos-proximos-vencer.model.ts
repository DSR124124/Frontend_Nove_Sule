import { ResumenInventario } from './resumen-inventario.model';

export interface ProductosProximosVencerResponse {
  success: boolean;
  message: string;
  data: ResumenInventario[];
}

export interface ProductosProximosVencerRequest {
  dias?: number;
}
