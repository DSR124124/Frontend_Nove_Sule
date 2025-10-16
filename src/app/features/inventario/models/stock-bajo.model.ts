export interface StockBajo {
  productoId: number;
  productoNombre: string;
  productoCodigo: string;
  stockActual: number;
  stockMinimo: number;
  diferencia: number;
  precioCompra: number;
  valorReposicion: number;
  proveedorNombre: string;
  categoriaNombre: string;
  ubicacion: string;
}

export interface StockBajoResponse {
  success: boolean;
  message: string;
  data: StockBajo[];
}
