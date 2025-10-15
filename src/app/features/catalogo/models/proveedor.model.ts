export interface Proveedor {
  id: number;
  nombre: string;
  ruc: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  contacto?: string;
  estado: Estado;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface ProveedorRequest {
  nombre: string;
  ruc: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  contacto?: string;
}

export interface ProveedorBasico {
  id: number;
  nombre: string;
  ruc: string;
  email?: string;
  telefono?: string;
}

export enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  ELIMINADO = 'ELIMINADO'
}
