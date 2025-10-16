import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import {
  ResumenInventarioSingleResponse,
  ResumenGeneralResponse,
  ResumenInventarioResponse
} from '../models/resumen-inventario.model';
import {
  ValorInventarioProductoResponse,
  ValorInventarioResponse
} from '../models/valor-inventario.model';
import {
  HistorialStockResponse,
  HistorialStockRequest
} from '../models/historial-stock.model';
import {
  ProductosProximosVencerResponse,
  ProductosProximosVencerRequest
} from '../models/productos-proximos-vencer.model';
import {
  ReporteMovimientosResponse,
  ReporteMovimientosRequest
} from '../models/reporte-movimientos.model';
import { StockBajoResponse } from '../models/stock-bajo.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioReportesService {
  private readonly baseUrl = `${environment.apiUrl}/api/inventario`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene productos con stock bajo
   */
  getProductosConStockBajo(): Observable<StockBajoResponse> {
    return this.http.get<StockBajoResponse>(`${this.baseUrl}/stock-bajo`);
  }

  /**
   * Obtiene resumen de un producto específico
   */
  getResumenProducto(productoId: number, fecha: string): Observable<ResumenInventarioSingleResponse> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<ResumenInventarioSingleResponse>(`${this.baseUrl}/productos/${productoId}/resumen`, { params });
  }

  /**
   * Obtiene resumen general del inventario
   */
  getResumenGeneral(fecha: string): Observable<ResumenGeneralResponse> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<ResumenGeneralResponse>(`${this.baseUrl}/resumen-general`, { params });
  }

  /**
   * Calcula el valor total del inventario
   */
  getValorTotalInventario(): Observable<ValorInventarioResponse> {
    return this.http.get<ValorInventarioResponse>(`${this.baseUrl}/valor-total`);
  }

  /**
   * Calcula el valor del inventario de un producto específico
   */
  getValorInventarioProducto(productoId: number): Observable<ValorInventarioProductoResponse> {
    return this.http.get<ValorInventarioProductoResponse>(`${this.baseUrl}/productos/${productoId}/valor`);
  }

  /**
   * Obtiene el historial de stock de un producto
   */
  getHistorialStock(request: HistorialStockRequest): Observable<HistorialStockResponse> {
    const params = new HttpParams()
      .set('fechaInicio', request.fechaInicio)
      .set('fechaFin', request.fechaFin);

    return this.http.get<HistorialStockResponse>(`${this.baseUrl}/productos/${request.productoId}/historial`, { params });
  }

  /**
   * Obtiene productos próximos a vencer
   */
  getProductosProximosVencer(request: ProductosProximosVencerRequest = {}): Observable<ProductosProximosVencerResponse> {
    let params = new HttpParams();
    if (request.dias) {
      params = params.set('dias', request.dias.toString());
    }

    return this.http.get<ProductosProximosVencerResponse>(`${this.baseUrl}/productos-proximos-vencer`, { params });
  }

  /**
   * Genera reporte de movimientos con filtros
   */
  getReporteMovimientos(request: ReporteMovimientosRequest): Observable<ReporteMovimientosResponse> {
    let params = new HttpParams();

    if (request.productoId) {
      params = params.set('productoId', request.productoId.toString());
    }
    if (request.tipoMovimiento) {
      params = params.set('tipoMovimiento', request.tipoMovimiento);
    }
    if (request.fechaInicio) {
      params = params.set('fechaInicio', request.fechaInicio);
    }
    if (request.fechaFin) {
      params = params.set('fechaFin', request.fechaFin);
    }

    return this.http.get<ReporteMovimientosResponse>(`${this.baseUrl}/reportes/movimientos`, { params });
  }
}
