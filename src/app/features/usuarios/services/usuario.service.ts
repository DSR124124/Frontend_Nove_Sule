import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { UsuarioPerfil, UsuarioPerfilRequest, CambioPasswordRequest } from '../models/usuario-perfil.model';
import { UsuarioListItem, UsuarioListFilters, UsuarioListResponse } from '../models/usuario-list.model';
import { LoginResponse } from '../../auth/models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseHttpService {

  private readonly ENDPOINTS = {
    PROFILE: '/auth/profile',
    LIST: '/usuarios'
  };

  /**
   * Obtiene el perfil completo del usuario autenticado
   */
  getProfile(): Observable<LoginResponse> {
    return this.get<LoginResponse>(this.ENDPOINTS.PROFILE);
  }

  /**
   * Obtiene la lista de usuarios con filtros y paginación
   */
  getUsuarios(filters: UsuarioListFilters = {}): Observable<UsuarioListResponse> {
    const params = this.buildQueryParams(filters);
    return this.get<UsuarioListResponse>(`${this.ENDPOINTS.LIST}?${params}`);
  }

  /**
   * Construye parámetros de consulta para filtros
   */
  private buildQueryParams(filters: UsuarioListFilters): string {
    const params = new URLSearchParams();

    if (filters.username) params.append('username', filters.username);
    if (filters.email) params.append('email', filters.email);
    if (filters.rol) params.append('rol', filters.rol);
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.direction) params.append('direction', filters.direction);

    return params.toString();
  }
}
