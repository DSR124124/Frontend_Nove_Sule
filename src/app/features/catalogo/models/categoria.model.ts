export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  color?: string;
  orden?: number;
  estado: Estado;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface CategoriaRequest {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  color?: string;
  orden?: number;
  estado?: Estado;
}

export interface CategoriaBasica {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  color?: string;
  orden?: number;
}

export interface CategoriaFiltros {
  nombre?: string;
  estado?: Estado;
  page?: number;
  size?: number;
}

export enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  ELIMINADO = 'ELIMINADO'
}
