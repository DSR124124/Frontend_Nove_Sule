export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioCompra: number;
  stock: number;
  stockMinimo: number;
  stockMaximo?: number;
  codigoBarras?: string;
  estado: Estado;
  categoria: CategoriaBasica;
  marca: MarcaBasica;
  proveedor: ProveedorBasico;
  fechaCreacion: string;
  fechaModificacion: string;
  imagenUrl?: string;
}

export interface ProductoRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioCompra: number;
  stock: number;
  stockMinimo: number;
  stockMaximo?: number;
  codigoBarras?: string;
  categoriaId: number;
  marcaId: number;
  proveedorId: number;
  imagenUrl?: string;
}

export interface ProductoFiltros {
  nombre?: string;
  codigo?: string;
  categoriaId?: number;
  marcaId?: number;
  proveedorId?: number;
  estado?: Estado;
  page?: number;
  size?: number;
}

export interface ProductoBusqueda {
  texto?: string;
  precioMin?: number;
  precioMax?: number;
  categoriaId?: number;
  marcaId?: number;
  proveedorId?: number;
}

export enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  ELIMINADO = 'ELIMINADO'
}

export interface CategoriaBasica {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface MarcaBasica {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface ProveedorBasico {
  id: number;
  nombre: string;
  ruc: string;
  email?: string;
  telefono?: string;
}

export interface ProductoStockUpdate {
  nuevoStock: number;
}

export interface ProductoEstadoUpdate {
  estado: Estado;
}

export interface ProductoVerificacion {
  codigo?: string;
  codigoBarras?: string;
}

export interface ProductoMasVendido {
  id: number;
  nombre: string;
  codigo: string;
  cantidadVendida: number;
  totalVentas: number;
}

export interface ProductoStockBajo {
  id: number;
  nombre: string;
  codigo: string;
  stock: number;
  stockMinimo: number;
  diferencia: number;
}
