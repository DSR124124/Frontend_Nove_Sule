import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../catalogo/models/api-response.model';
import { MovimientoInventario, MovimientoInventarioRequest, MovimientoInventarioFiltros, TipoMovimiento } from '../models/movimiento-inventario.model';

@Injectable({
  providedIn: 'root'
})
export class MovimientoInventarioService {
  private readonly baseUrl = `${environment.apiUrl}/inventario`;

  constructor(private http: HttpClient) { }

  // POST /api/inventario/movimientos
  registrarMovimiento(movimiento: MovimientoInventarioRequest): Observable<ApiResponse<MovimientoInventario>> {
    return this.http.post<ApiResponse<MovimientoInventario>>(`${this.baseUrl}/movimientos`, movimiento);
  }

  // GET /api/inventario/movimientos/{id}
  buscarPorId(id: number): Observable<ApiResponse<MovimientoInventario>> {
    return this.http.get<ApiResponse<MovimientoInventario>>(`${this.baseUrl}/movimientos/${id}`);
  }

  // GET /api/inventario/productos/{productoId}/movimientos
  listarPorProducto(productoId: number): Observable<ApiResponse<MovimientoInventario[]>> {
    return this.http.get<ApiResponse<MovimientoInventario[]>>(`${this.baseUrl}/productos/${productoId}/movimientos`);
  }

  // GET /api/inventario/movimientos/tipo/{tipoMovimiento}
  listarPorTipo(tipoMovimiento: TipoMovimiento): Observable<ApiResponse<MovimientoInventario[]>> {
    return this.http.get<ApiResponse<MovimientoInventario[]>>(`${this.baseUrl}/movimientos/tipo/${tipoMovimiento}`);
  }

  // GET /api/inventario/movimientos/buscar
  buscarConFiltros(filtros: MovimientoInventarioFiltros): Observable<ApiResponse<PaginatedResponse<MovimientoInventario>>> {
    let params = new HttpParams();

    if (filtros.productoId) {
      params = params.set('productoId', filtros.productoId.toString());
    }
    if (filtros.tipoMovimiento) {
      params = params.set('tipoMovimiento', filtros.tipoMovimiento);
    }
    if (filtros.fechaInicio) {
      // Convertir a formato ISO string con timezone
      const fechaInicio = new Date(filtros.fechaInicio);
      params = params.set('fechaInicio', fechaInicio.toISOString());
    }
    if (filtros.fechaFin) {
      // Convertir a formato ISO string con timezone
      const fechaFin = new Date(filtros.fechaFin);
      params = params.set('fechaFin', fechaFin.toISOString());
    }
    if (filtros.page !== undefined) {
      params = params.set('page', filtros.page.toString());
    }
    if (filtros.size !== undefined) {
      params = params.set('size', filtros.size.toString());
    }

    return this.http.get<ApiResponse<PaginatedResponse<MovimientoInventario>>>(`${this.baseUrl}/movimientos/buscar`, { params });
  }

  // GET /api/inventario/movimientos/fecha
  listarPorFecha(fechaInicio: string, fechaFin: string): Observable<ApiResponse<MovimientoInventario[]>> {
    const params = new HttpParams()
      .set('fechaInicio', new Date(fechaInicio).toISOString())
      .set('fechaFin', new Date(fechaFin).toISOString());

    return this.http.get<ApiResponse<MovimientoInventario[]>>(`${this.baseUrl}/movimientos/fecha`, { params });
  }

  // GET /api/inventario/movimientos/recientes
  listarRecientes(limite: number = 10): Observable<ApiResponse<MovimientoInventario[]>> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<ApiResponse<MovimientoInventario[]>>(`${this.baseUrl}/movimientos/recientes`, { params });
  }

  // ===== MOVIMIENTOS RELACIONADOS =====

  // GET /api/inventario/ordenes-compra/{ordenCompraId}/movimientos
  listarMovimientosOrdenCompra(ordenCompraId: number): Observable<ApiResponse<MovimientoInventario[]>> {
    return this.http.get<ApiResponse<MovimientoInventario[]>>(`${this.baseUrl}/ordenes-compra/${ordenCompraId}/movimientos`);
  }

  // GET /api/inventario/comprobantes-venta/{comprobanteVentaId}/movimientos
  listarMovimientosComprobanteVenta(comprobanteVentaId: number): Observable<ApiResponse<MovimientoInventario[]>> {
    return this.http.get<ApiResponse<MovimientoInventario[]>>(`${this.baseUrl}/comprobantes-venta/${comprobanteVentaId}/movimientos`);
  }

  // GET /api/inventario/productos/{productoId}/ultimo-movimiento
  obtenerUltimoMovimientoProducto(productoId: number): Observable<ApiResponse<MovimientoInventario | null>> {
    return this.http.get<ApiResponse<MovimientoInventario | null>>(`${this.baseUrl}/productos/${productoId}/ultimo-movimiento`);
  }
}
