export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  rol: string;
  nombreCompleto: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
