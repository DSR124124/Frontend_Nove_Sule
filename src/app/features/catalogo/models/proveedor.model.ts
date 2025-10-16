export interface Proveedor {
  id: number;
  nombre: string;
  razonSocial?: string;
  ruc: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  codigoPostal?: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
  contacto: string;
  cargo?: string;
  banco?: string;
  numeroCuenta?: string;
  tipoCuenta?: string;
  plazoPago?: number;
  descuento?: number;
  limiteCredito?: number;
  observaciones?: string;
  estado: Estado;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface ProveedorRequest {
  nombre: string;
  razonSocial?: string;
  ruc: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  codigoPostal?: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
  contacto: string;
  cargo?: string;
  banco?: string;
  numeroCuenta?: string;
  tipoCuenta?: string;
  plazoPago?: number;
  descuento?: number;
  limiteCredito?: number;
  observaciones?: string;
}

export interface ProveedorBasico {
  id: number;
  nombre: string;
  razonSocial?: string;
  ruc: string;
  telefono: string;
  email: string;
}

export interface ProveedorFiltros {
  nombre?: string;
  ruc?: string;
  email?: string;
  estado?: Estado;
  page?: number;
  size?: number;
}

export enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO'
}
