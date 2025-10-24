export interface UsuarioPerfil {
  id: number;
  username: string;
  email: string;
  nombreCompleto: string;
  rol: string;
  estado: string;
  fechaCreacion: string;
  ultimoAcceso?: string;
  telefono?: string;
  direccion?: string;
}

export interface UsuarioPerfilRequest {
  nombreCompleto?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export interface CambioPasswordRequest {
  passwordActual: string;
  nuevaPassword: string;
  confirmarPassword: string;
}
