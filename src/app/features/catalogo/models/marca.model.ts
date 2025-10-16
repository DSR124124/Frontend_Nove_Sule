export interface Marca {
  id: number;
  nombre: string;
  descripcion?: string;
  logo?: string;
  sitioWeb?: string;
  contacto?: string;
  email?: string;
  telefono?: string;
  estado: Estado;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface MarcaRequest {
  nombre: string;
  descripcion?: string;
  logo?: string;
  sitioWeb?: string;
  contacto?: string;
  email?: string;
  telefono?: string;
}

export interface MarcaBasica {
  id: number;
  nombre: string;
  descripcion?: string;
  logo?: string;
}

export interface MarcaFiltros {
  nombre?: string;
  estado?: Estado;
  page?: number;
  size?: number;
}

export enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO'
}
