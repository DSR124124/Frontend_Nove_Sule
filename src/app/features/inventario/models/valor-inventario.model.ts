export interface ValorInventario {
  valorTotal: number;
  moneda: string;
}

export interface ValorInventarioResponse {
  success: boolean;
  message: string;
  data: number;
}

export interface ValorInventarioProductoResponse {
  success: boolean;
  message: string;
  data: number;
}
