import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Proveedor, ProveedorRequest, ProveedorBasico } from '../models/proveedor.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private readonly baseUrl = `${environment.apiUrl}/proveedores`;

  constructor(private http: HttpClient) { }

  // ===== CRUD BÁSICO =====

  /**
   * Crear un nuevo proveedor
   */
  crear(proveedor: ProveedorRequest): Observable<ApiResponse<Proveedor>> {
    return this.http.post<ApiResponse<Proveedor>>(this.baseUrl, proveedor);
  }

  /**
   * Actualizar un proveedor existente
   */
  actualizar(id: number, proveedor: ProveedorRequest): Observable<ApiResponse<Proveedor>> {
    return this.http.put<ApiResponse<Proveedor>>(`${this.baseUrl}/${id}`, proveedor);
  }

  /**
   * Eliminar un proveedor (soft delete)
   */
  eliminar(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }

  // ===== BÚSQUEDAS =====

  /**
   * Buscar proveedor por ID
   */
  buscarPorId(id: number): Observable<ApiResponse<Proveedor>> {
    return this.http.get<ApiResponse<Proveedor>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Buscar proveedor por RUC
   */
  buscarPorRuc(ruc: string): Observable<ApiResponse<Proveedor>> {
    return this.http.get<ApiResponse<Proveedor>>(`${this.baseUrl}/ruc/${ruc}`);
  }

  /**
   * Listar proveedores con filtros y paginación
   */
  listar(filtros: any = {}): Observable<ApiResponse<PaginatedResponse<Proveedor>>> {
    let params = new HttpParams();

    if (filtros.nombre) params = params.set('nombre', filtros.nombre);
    if (filtros.ruc) params = params.set('ruc', filtros.ruc);
    if (filtros.estado) params = params.set('estado', filtros.estado);
    if (filtros.page !== undefined) params = params.set('page', filtros.page.toString());
    if (filtros.size !== undefined) params = params.set('size', filtros.size.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Proveedor>>>(this.baseUrl, { params });
  }

  /**
   * Listar proveedores activos
   */
  listarActivos(): Observable<ApiResponse<ProveedorBasico[]>> {
    return this.http.get<ApiResponse<ProveedorBasico[]>>(`${this.baseUrl}/activos`);
  }

  /**
   * Listar todos los proveedores (sin paginación)
   */
  listarTodos(): Observable<ApiResponse<Proveedor[]>> {
    return this.http.get<ApiResponse<Proveedor[]>>(`${this.baseUrl}/todos`);
  }

  // ===== OPERACIONES ESPECÍFICAS =====

  /**
   * Cambiar estado de un proveedor
   */
  cambiarEstado(id: number, estado: string): Observable<ApiResponse<Proveedor>> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<ApiResponse<Proveedor>>(`${this.baseUrl}/${id}/estado`, null, { params });
  }

  /**
   * Verificar si un RUC ya existe
   */
  verificarRuc(ruc: string): Observable<ApiResponse<boolean>> {
    const params = new HttpParams().set('ruc', ruc);
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/verificar-ruc`, { params });
  }

  /**
   * Verificar si un nombre ya existe
   */
  verificarNombre(nombre: string): Observable<ApiResponse<boolean>> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/verificar-nombre`, { params });
  }

  // ===== MÉTODOS DE UTILIDAD =====

  /**
   * Obtener proveedores para select/dropdown
   */
  obtenerParaSelect(): Observable<ProveedorBasico[]> {
    return this.http.get<ProveedorBasico[]>(`${this.baseUrl}/select`);
  }

  /**
   * Buscar proveedores por texto
   */
  buscarPorTexto(texto: string): Observable<ApiResponse<Proveedor[]>> {
    const params = new HttpParams().set('texto', texto);
    return this.http.get<ApiResponse<Proveedor[]>>(`${this.baseUrl}/buscar`, { params });
  }

  /**
   * Obtener estadísticas de proveedores
   */
  obtenerEstadisticas(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/estadisticas`);
  }
}
