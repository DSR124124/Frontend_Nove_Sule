import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Producto, ProductoRequest, ProductoFiltros, ProductoBusqueda, ProductoStockUpdate, ProductoEstadoUpdate, ProductoVerificacion, ProductoMasVendido, ProductoStockBajo } from '../models/producto.model';
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
   * Buscar producto por código SKU
   */
  buscarPorCodigo(codigo: string): Observable<ApiResponse<Producto>> {
    return this.http.get<ApiResponse<Producto>>(`${this.baseUrl}/codigo/${codigo}`);
  }

  /**
   * Buscar producto por código de barras
   */
  buscarPorCodigoBarras(codigoBarras: string): Observable<ApiResponse<Producto>> {
    return this.http.get<ApiResponse<Producto>>(`${this.baseUrl}/codigo-barras/${codigoBarras}`);
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

  /**
   * Buscar productos por texto (nombre o descripción)
   */
  buscarPorTexto(texto: string): Observable<ApiResponse<Producto[]>> {
    const params = new HttpParams().set('texto', texto);
    return this.http.get<ApiResponse<Producto[]>>(`${this.baseUrl}/buscar`, { params });
  }

  /**
   * Buscar productos por rango de precios
   */
  buscarPorRangoPrecio(precioMin?: number, precioMax?: number): Observable<ApiResponse<Producto[]>> {
    let params = new HttpParams();
    if (precioMin !== undefined) params = params.set('precioMin', precioMin.toString());
    if (precioMax !== undefined) params = params.set('precioMax', precioMax.toString());

    return this.http.get<ApiResponse<Producto[]>>(`${this.baseUrl}/precio-rango`, { params });
  }

  // ===== FILTROS POR CATEGORÍAS =====

  /**
   * Listar productos por categoría
   */
  listarPorCategoria(categoriaId: number): Observable<ApiResponse<Producto[]>> {
    return this.http.get<ApiResponse<Producto[]>>(`${this.baseUrl}/categoria/${categoriaId}`);
  }

  /**
   * Listar productos por marca
   */
  listarPorMarca(marcaId: number): Observable<ApiResponse<Producto[]>> {
    return this.http.get<ApiResponse<Producto[]>>(`${this.baseUrl}/marca/${marcaId}`);
  }

  /**
   * Listar productos por proveedor
   */
  listarPorProveedor(proveedorId: number): Observable<ApiResponse<Producto[]>> {
    return this.http.get<ApiResponse<Producto[]>>(`${this.baseUrl}/proveedor/${proveedorId}`);
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

  // ===== OPERACIONES ESPECÍFICAS =====

  /**
   * Actualizar stock de un producto
   */
  actualizarStock(id: number, nuevoStock: number): Observable<ApiResponse<Producto>> {
    const params = new HttpParams().set('nuevoStock', nuevoStock.toString());
    return this.http.patch<ApiResponse<Producto>>(`${this.baseUrl}/${id}/stock`, null, { params });
  }

  /**
   * Cambiar estado de un producto
   */
  cambiarEstado(id: number, estado: string): Observable<ApiResponse<Producto>> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<ApiResponse<Producto>>(`${this.baseUrl}/${id}/estado`, null, { params });
  }

  // ===== VALIDACIONES =====

  /**
   * Verificar si un código ya existe
   */
  verificarCodigo(codigo: string): Observable<ApiResponse<boolean>> {
    const params = new HttpParams().set('codigo', codigo);
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/verificar-codigo`, { params });
  }

  /**
   * Verificar si un código de barras ya existe
   */
  verificarCodigoBarras(codigoBarras: string): Observable<ApiResponse<boolean>> {
    const params = new HttpParams().set('codigoBarras', codigoBarras);
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/verificar-codigo-barras`, { params });
  }
}
