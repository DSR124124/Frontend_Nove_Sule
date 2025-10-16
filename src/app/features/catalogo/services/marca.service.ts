import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Marca, MarcaRequest, MarcaBasica, MarcaFiltros } from '../models/marca.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private readonly baseUrl = `${environment.apiUrl}/marcas`;

  constructor(private http: HttpClient) { }

  // ===== CRUD BÁSICO =====

  /**
   * Crear una nueva marca
   */
  crear(marca: MarcaRequest): Observable<ApiResponse<Marca>> {
    return this.http.post<ApiResponse<Marca>>(this.baseUrl, marca);
  }

  /**
   * Actualizar una marca existente
   */
  actualizar(id: number, marca: MarcaRequest): Observable<ApiResponse<Marca>> {
    return this.http.put<ApiResponse<Marca>>(`${this.baseUrl}/${id}`, marca);
  }

  /**
   * Eliminar una marca (soft delete)
   */
  eliminar(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }

  // ===== BÚSQUEDAS =====

  /**
   * Buscar marca por ID
   */
  buscarPorId(id: number): Observable<ApiResponse<Marca>> {
    return this.http.get<ApiResponse<Marca>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Listar marcas con filtros y paginación
   */
  listar(filtros: MarcaFiltros = {}): Observable<ApiResponse<PaginatedResponse<Marca>>> {
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

    return this.http.get<ApiResponse<PaginatedResponse<Marca>>>(this.baseUrl, { params });
  }

  /**
   * Listar marcas activas
   */
  listarActivas(): Observable<ApiResponse<MarcaBasica[]>> {
    return this.http.get<ApiResponse<MarcaBasica[]>>(`${this.baseUrl}/activas`);
  }

  /**
   * Cambiar estado de una marca
   */
  cambiarEstado(id: number, estado: string): Observable<ApiResponse<Marca>> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<ApiResponse<Marca>>(`${this.baseUrl}/${id}/estado`, null, { params });
  }
}
