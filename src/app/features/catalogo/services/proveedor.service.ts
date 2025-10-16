import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Proveedor, ProveedorRequest, ProveedorBasico, ProveedorFiltros } from '../models/proveedor.model';
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
   * Listar proveedores con filtros y paginación
   */
  listar(filtros: ProveedorFiltros = {}): Observable<ApiResponse<PaginatedResponse<Proveedor>>> {
    let params = new HttpParams();

    // Solo agregar parámetros que no sean undefined, null o vacíos
    if (filtros.nombre && filtros.nombre.trim()) {
      params = params.set('nombre', filtros.nombre.trim());
    }
    if (filtros.ruc && filtros.ruc.trim()) {
      params = params.set('ruc', filtros.ruc.trim());
    }
    if (filtros.email && filtros.email.trim()) {
      params = params.set('email', filtros.email.trim());
    }
    if (filtros.estado && filtros.estado.trim()) {
      params = params.set('estado', filtros.estado.trim());
    }

    // Parámetros de paginación con valores por defecto
    const page = filtros.page !== undefined ? filtros.page : 0;
    const size = filtros.size !== undefined ? filtros.size : 10;
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Proveedor>>>(this.baseUrl, { params });
  }

  /**
   * Listar proveedores activos
   */
  listarActivos(): Observable<ApiResponse<ProveedorBasico[]>> {
    return this.http.get<ApiResponse<ProveedorBasico[]>>(`${this.baseUrl}/activos`);
  }

  /**
   * Cambiar estado de un proveedor
   */
  cambiarEstado(id: number, estado: string): Observable<ApiResponse<Proveedor>> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<ApiResponse<Proveedor>>(`${this.baseUrl}/${id}/estado`, null, { params });
  }
}
