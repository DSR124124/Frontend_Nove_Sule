import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Marca, MarcaRequest, MarcaBasica } from '../models/marca.model';
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
  listar(filtros: any = {}): Observable<ApiResponse<PaginatedResponse<Marca>>> {
    let params = new HttpParams();

    if (filtros.nombre) params = params.set('nombre', filtros.nombre);
    if (filtros.estado) params = params.set('estado', filtros.estado);
    if (filtros.page !== undefined) params = params.set('page', filtros.page.toString());
    if (filtros.size !== undefined) params = params.set('size', filtros.size.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Marca>>>(this.baseUrl, { params });
  }

  /**
   * Listar marcas activas
   */
  listarActivas(): Observable<ApiResponse<MarcaBasica[]>> {
    return this.http.get<ApiResponse<MarcaBasica[]>>(`${this.baseUrl}/activas`);
  }

  /**
   * Listar todas las marcas (sin paginación)
   */
  listarTodas(): Observable<ApiResponse<Marca[]>> {
    return this.http.get<ApiResponse<Marca[]>>(`${this.baseUrl}/todas`);
  }

  // ===== OPERACIONES ESPECÍFICAS =====

  /**
   * Cambiar estado de una marca
   */
  cambiarEstado(id: number, estado: string): Observable<ApiResponse<Marca>> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<ApiResponse<Marca>>(`${this.baseUrl}/${id}/estado`, null, { params });
  }

  /**
   * Verificar si un nombre de marca ya existe
   */
  verificarNombre(nombre: string): Observable<ApiResponse<boolean>> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/verificar-nombre`, { params });
  }

  // ===== MÉTODOS DE UTILIDAD =====

  /**
   * Obtener marcas para select/dropdown
   */
  obtenerParaSelect(): Observable<MarcaBasica[]> {
    return this.http.get<MarcaBasica[]>(`${this.baseUrl}/select`);
  }

  /**
   * Buscar marcas por texto
   */
  buscarPorTexto(texto: string): Observable<ApiResponse<Marca[]>> {
    const params = new HttpParams().set('texto', texto);
    return this.http.get<ApiResponse<Marca[]>>(`${this.baseUrl}/buscar`, { params });
  }
}
