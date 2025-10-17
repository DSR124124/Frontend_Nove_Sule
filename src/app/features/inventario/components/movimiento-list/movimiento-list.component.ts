import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from '../../../../core/services/message.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { MovimientoInventario, MovimientoInventarioFiltros, TipoMovimiento } from '../../models/movimiento-inventario.model';
import { MovimientoInventarioService } from '../../services/movimiento-inventario.service';
import { ApiResponse, PaginatedResponse } from '../../../catalogo/models/api-response.model';
import { PrimeNgModule } from '../../../../prime-ng/prime-ng.module';

@Component({
  selector: 'app-movimiento-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PrimeNgModule
  ],
  templateUrl: './movimiento-list.component.html',
  styleUrl: './movimiento-list.component.css'
})
export class MovimientoListComponent implements OnInit {
  movimientos: MovimientoInventario[] = [];

  // Paginación
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Filtros
  filtros: MovimientoInventarioFiltros = {
    productoId: undefined,
    tipoMovimiento: undefined,
    fechaInicio: undefined,
    fechaFin: undefined,
    page: 0,
    size: 10
  };

  // Opciones para dropdowns
  tipoMovimientoOptions = [
    { label: 'Todos', value: undefined },
    { label: 'Entrada', value: TipoMovimiento.ENTRADA },
    { label: 'Salida', value: TipoMovimiento.SALIDA },
    { label: 'Ajuste', value: TipoMovimiento.AJUSTE },
    { label: 'Transferencia', value: TipoMovimiento.TRANSFERENCIA }
  ];

  fechaInicioInput: string = '';
  fechaFinInput: string = '';

  constructor(
    private movimientoService: MovimientoInventarioService,
    private messageService: MessageService,
    private loadingService: LoadingService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.cargarMovimientosIniciales();
  }

  // Método para carga inicial con loading y mensaje de éxito
  private async cargarMovimientosIniciales(): Promise<void> {
    const filtrosLimpios: MovimientoInventarioFiltros = {
      page: this.currentPage,
      size: this.pageSize,
      productoId: this.filtros.productoId || undefined,
      tipoMovimiento: this.filtros.tipoMovimiento || undefined,
      fechaInicio: this.filtros.fechaInicio || undefined,
      fechaFin: this.filtros.fechaFin || undefined
    };

    try {
      const response = await this.loadingService.withLoading(
        () => firstValueFrom(this.movimientoService.buscarConFiltros(filtrosLimpios)),
        {
          id: 'carga-inicial',
          message: 'Cargando movimientos de inventario...',
          size: 'medium',
          overlay: true
        }
      );

      this.movimientos = response?.data?.content || [];
      this.totalElements = response?.data?.totalElements || 0;
      this.totalPages = response?.data?.totalPages || 0;

      // Mensaje de carga exitosa
      if (this.movimientos.length > 0) {
        this.messageService.success(
          `Se cargaron ${this.movimientos.length} movimientos correctamente`,
          'Carga Exitosa'
        );
      } else {
        this.messageService.info(
          'No se encontraron movimientos registrados',
          'Sin Resultados'
        );
      }
    } catch (error) {
      this.messageService.handleHttpError(error);
    }
  }

  async cargarMovimientos(): Promise<void> {
    const filtrosLimpios: MovimientoInventarioFiltros = {
      page: this.currentPage,
      size: this.pageSize,
      productoId: this.filtros.productoId || undefined,
      tipoMovimiento: this.filtros.tipoMovimiento || undefined,
      fechaInicio: this.filtros.fechaInicio || undefined,
      fechaFin: this.filtros.fechaFin || undefined
    };

    try {
      const response = await this.loadingService.withLoading(
        () => firstValueFrom(this.movimientoService.buscarConFiltros(filtrosLimpios)),
        {
          id: 'cargar-movimientos',
          message: 'Cargando movimientos...',
          size: 'medium',
          overlay: true
        }
      );

      this.movimientos = response?.data?.content || [];
      this.totalElements = response?.data?.totalElements || 0;
      this.totalPages = response?.data?.totalPages || 0;

      // Mostrar mensaje de éxito con filtros
      const filtrosAplicados = Object.keys(filtrosLimpios).filter(key =>
        key !== 'page' && key !== 'size' && filtrosLimpios[key as keyof MovimientoInventarioFiltros]
      );

      if (filtrosAplicados.length > 0) {
        this.messageService.success(
          `Se encontraron ${this.movimientos.length} movimientos con los filtros aplicados`,
          'Búsqueda Exitosa'
        );
      } else {
        this.messageService.success(
          `Se cargaron ${this.movimientos.length} movimientos correctamente`,
          'Movimientos Cargados'
        );
      }
    } catch (error) {
      this.messageService.handleHttpError(error);
    }
  }

  private async cargarMovimientosSilencioso(): Promise<void> {
    const filtrosLimpios: MovimientoInventarioFiltros = {
      page: this.currentPage,
      size: this.pageSize,
      productoId: this.filtros.productoId || undefined,
      tipoMovimiento: this.filtros.tipoMovimiento || undefined,
      fechaInicio: this.filtros.fechaInicio || undefined,
      fechaFin: this.filtros.fechaFin || undefined
    };

    try {
      const response = await this.loadingService.withLoading(
        () => firstValueFrom(this.movimientoService.buscarConFiltros(filtrosLimpios)),
        {
          id: 'paginacion',
          message: 'Actualizando página...',
          size: 'small'
        }
      );

      this.movimientos = response?.data?.content || [];
      this.totalElements = response?.data?.totalElements || 0;
      this.totalPages = response?.data?.totalPages || 0;

      // Sin mensaje de éxito para paginación (mantiene UX limpia)
    } catch (error) {
      this.messageService.handleHttpError(error);
    }
  }

  // Getter para verificar si está cargando
  get isLoading(): boolean {
    return this.loadingService.isLoading;
  }

  async onSearch(): Promise<void> {
    this.currentPage = 0;
    await this.cargarMovimientos();
  }

  async onClearSearch(): Promise<void> {
    // Limpiar filtros
    this.filtros = {
      productoId: undefined,
      tipoMovimiento: undefined,
      fechaInicio: undefined,
      fechaFin: undefined,
      page: 0,
      size: 10
    };
    this.fechaInicioInput = '';
    this.fechaFinInput = '';
    this.currentPage = 0;

    // Mostrar mensaje informativo
    this.messageService.info(
      'Filtros limpiados, cargando todos los movimientos...',
      'Filtros Limpiados'
    );

    // Cargar todos los movimientos con loading
    await this.cargarMovimientos();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.cargarMovimientosSilencioso();
  }

  async onRefresh(): Promise<void> {
    this.messageService.info(
      'Actualizando lista de movimientos...',
      'Actualizando'
    );

    await this.cargarMovimientos();
  }

  getTipoMovimientoStyleClass(tipo: TipoMovimiento): string {
    switch (tipo) {
      case TipoMovimiento.ENTRADA:
        return 'p-tag tag-success tag-sm';
      case TipoMovimiento.SALIDA:
        return 'p-tag tag-danger tag-sm';
      case TipoMovimiento.AJUSTE:
        return 'p-tag tag-warning tag-sm';
      case TipoMovimiento.TRANSFERENCIA:
        return 'p-tag tag-info tag-sm';
      default:
        return 'p-tag tag-gray tag-sm';
    }
  }

  getTipoMovimientoText(tipo: TipoMovimiento): string {
    switch (tipo) {
      case TipoMovimiento.ENTRADA:
        return 'Entrada';
      case TipoMovimiento.SALIDA:
        return 'Salida';
      case TipoMovimiento.AJUSTE:
        return 'Ajuste';
      case TipoMovimiento.TRANSFERENCIA:
        return 'Transferencia';
      default:
        return tipo;
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }

  onFechaInicioChange(): void {
    if (this.fechaInicioInput) {
      this.filtros.fechaInicio = this.fechaInicioInput;
    }
  }

  onFechaFinChange(): void {
    if (this.fechaFinInput) {
      this.filtros.fechaFin = this.fechaFinInput;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
