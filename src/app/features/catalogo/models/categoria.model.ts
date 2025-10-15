export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: Estado;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface CategoriaRequest {
  nombre: string;
  descripcion?: string;
}

export interface CategoriaBasica {
  id: number;
  nombre: string;
  descripcion?: string;
}

export enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  ELIMINADO = 'ELIMINADO'
}
