import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Categoria, CategoriaRequest, CategoriaBasica } from '../models/categoria.model';
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
  listar(filtros: any = {}): Observable<ApiResponse<PaginatedResponse<Categoria>>> {
    let params = new HttpParams();

    if (filtros.nombre) params = params.set('nombre', filtros.nombre);
    if (filtros.estado) params = params.set('estado', filtros.estado);
    if (filtros.page !== undefined) params = params.set('page', filtros.page.toString());
    if (filtros.size !== undefined) params = params.set('size', filtros.size.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Categoria>>>(this.baseUrl, { params });
  }

  /**
   * Listar categorías activas
   */
  listarActivas(): Observable<ApiResponse<CategoriaBasica[]>> {
    return this.http.get<ApiResponse<CategoriaBasica[]>>(`${this.baseUrl}/activas`);
  }

  /**
   * Listar todas las categorías (sin paginación)
   */
  listarTodas(): Observable<ApiResponse<Categoria[]>> {
    return this.http.get<ApiResponse<Categoria[]>>(`${this.baseUrl}/todas`);
  }

  // ===== OPERACIONES ESPECÍFICAS =====

  /**
   * Cambiar estado de una categoría
   */
  cambiarEstado(id: number, estado: string): Observable<ApiResponse<Categoria>> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<ApiResponse<Categoria>>(`${this.baseUrl}/${id}/estado`, null, { params });
  }

  /**
   * Verificar si un nombre de categoría ya existe
   */
  verificarNombre(nombre: string): Observable<ApiResponse<boolean>> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/verificar-nombre`, { params });
  }

  // ===== MÉTODOS DE UTILIDAD =====

  /**
   * Obtener categorías para select/dropdown
   */
  obtenerParaSelect(): Observable<CategoriaBasica[]> {
    return this.http.get<CategoriaBasica[]>(`${this.baseUrl}/select`);
  }

  /**
   * Buscar categorías por texto
   */
  buscarPorTexto(texto: string): Observable<ApiResponse<Categoria[]>> {
    const params = new HttpParams().set('texto', texto);
    return this.http.get<ApiResponse<Categoria[]>>(`${this.baseUrl}/buscar`, { params });
  }
}
