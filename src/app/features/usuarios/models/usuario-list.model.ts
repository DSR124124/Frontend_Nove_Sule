export interface UsuarioListItem {
  id: number;
  username: string;
  email: string;
  nombreCompleto: string;
  rol: string;
  estado: string;
  fechaCreacion: string;
  ultimoAcceso?: string;
}

export interface UsuarioListFilters {
  username?: string;
  email?: string;
  rol?: string;
  estado?: string;
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface UsuarioListResponse {
  content: UsuarioListItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
