import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Categoria, CategoriaRequest, CategoriaBasica, CategoriaFiltros } from '../models/categoria.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly baseUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) { }

  // ===== CRUD BÁSICO =====

  /**
   * Crear una nueva categoría
   */
  crear(categoria: CategoriaRequest): Observable<ApiResponse<Categoria>> {
    return this.http.post<ApiResponse<Categoria>>(this.baseUrl, categoria);
  }

  /**
   * Actualizar una categoría existente
   */
  actualizar(id: number, categoria: CategoriaRequest): Observable<ApiResponse<Categoria>> {
    return this.http.put<ApiResponse<Categoria>>(`${this.baseUrl}/${id}`, categoria);
  }

  /**
   * Eliminar una categoría (soft delete)
   */
  eliminar(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }

  // ===== BÚSQUEDAS =====

  /**
   * Buscar categoría por ID
   */
  buscarPorId(id: number): Observable<ApiResponse<Categoria>> {
    return this.http.get<ApiResponse<Categoria>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Listar categorías con filtros y paginación
   */
  listar(filtros: CategoriaFiltros = {}): Observable<ApiResponse<PaginatedResponse<Categoria>>> {
    let params = new HttpParams();

    // Solo agregar parámetros que no sean undefined, null o vacíos
    if (filtros.nombre && filtros.nombre.trim()) {
      params = params.set('nombre', filtros.nombre.trim());
    }
    if (filtros.estado && filtros.estado.trim()) {
      params = params.set('estado', filtros.estado.trim());
    }

    // Parámetros de paginación con valores por defecto
    const page = filtros.page !== undefined ? filtros.page : 0;
    const size = filtros.size !== undefined ? filtros.size : 10;
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Categoria>>>(this.baseUrl, { params });
  }

  /**
   * Cambiar estado de una categoría
   */
  cambiarEstado(id: number, estado: string): Observable<ApiResponse<Categoria>> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<ApiResponse<Categoria>>(`${this.baseUrl}/${id}/estado`, null, { params });
  }
}
