export interface Marca {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: Estado;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface MarcaRequest {
  nombre: string;
  descripcion?: string;
}

export interface MarcaBasica {
  id: number;
  nombre: string;
  descripcion?: string;
}

export enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  ELIMINADO = 'ELIMINADO'
}
