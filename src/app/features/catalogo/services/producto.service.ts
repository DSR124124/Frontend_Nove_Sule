import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Producto, ProductoRequest, ProductoFiltros } from '../models/producto.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly baseUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) { }

  // ===== CRUD BÁSICO =====

  /**
   * Crear un nuevo producto
   */
  crear(producto: ProductoRequest): Observable<ApiResponse<Producto>> {
    return this.http.post<ApiResponse<Producto>>(this.baseUrl, producto);
  }

  /**
   * Actualizar un producto existente
   */
  actualizar(id: number, producto: ProductoRequest): Observable<ApiResponse<Producto>> {
    return this.http.put<ApiResponse<Producto>>(`${this.baseUrl}/${id}`, producto);
  }

  /**
   * Eliminar un producto (soft delete)
   */
  eliminar(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }

  // ===== BÚSQUEDAS =====

  /**
   * Buscar producto por ID
   */
  buscarPorId(id: number): Observable<ApiResponse<Producto>> {
    return this.http.get<ApiResponse<Producto>>(`${this.baseUrl}/${id}`);
  }


  /**
   * Listar productos con filtros y paginación
   */
  listar(filtros: ProductoFiltros = {}): Observable<ApiResponse<PaginatedResponse<Producto>>> {
    let params = new HttpParams();

    // Solo agregar parámetros que no sean undefined, null o vacíos
    if (filtros.nombre && filtros.nombre.trim()) {
      params = params.set('nombre', filtros.nombre.trim());
    }
    if (filtros.codigo && filtros.codigo.trim()) {
      params = params.set('codigo', filtros.codigo.trim());
    }
    if (filtros.categoriaId && filtros.categoriaId > 0) {
      params = params.set('categoriaId', filtros.categoriaId.toString());
    }
    if (filtros.marcaId && filtros.marcaId > 0) {
      params = params.set('marcaId', filtros.marcaId.toString());
    }
    if (filtros.proveedorId && filtros.proveedorId > 0) {
      params = params.set('proveedorId', filtros.proveedorId.toString());
    }
    if (filtros.estado && filtros.estado.trim()) {
      params = params.set('estado', filtros.estado.trim());
    }

    // Parámetros de paginación con valores por defecto
    const page = filtros.page !== undefined ? filtros.page : 0;
    const size = filtros.size !== undefined ? filtros.size : 10;
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Producto>>>(this.baseUrl, { params });
  }



  // ===== REPORTES Y ESTADÍSTICAS =====

  /**
   * Listar productos con stock bajo
   */
  listarConStockBajo(): Observable<ApiResponse<Producto[]>> {
    return this.http.get<ApiResponse<Producto[]>>(`${this.baseUrl}/stock-bajo`);
  }

  /**
   * Listar productos más vendidos
   */
  listarMasVendidos(limite: number = 10): Observable<ApiResponse<Producto[]>> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<ApiResponse<Producto[]>>(`${this.baseUrl}/mas-vendidos`, { params });
  }

}
