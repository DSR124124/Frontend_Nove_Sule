import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from '../../../../core/services/message.service';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
// import { CalendarModule } from 'primeng/calendar'; // Removed - using native date input
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { MovimientoInventario, MovimientoInventarioFiltros, TipoMovimiento } from '../../models/movimiento-inventario.model';
import { MovimientoInventarioService } from '../../services/movimiento-inventario.service';
import { ApiResponse, PaginatedResponse } from '../../../catalogo/models/api-response.model';

@Component({
  selector: 'app-movimiento-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    ProgressSpinnerModule,
    PanelModule,
    TableModule,
    TooltipModule,
    // CalendarModule, // Removed
    ConfirmDialogModule
  ],
  templateUrl: './movimiento-list.component.html',
  styleUrl: './movimiento-list.component.css'
})
export class MovimientoListComponent implements OnInit {
  movimientos: MovimientoInventario[] = [];
  loading = false;

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
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarMovimientosSilencioso();
  }

  cargarMovimientos(): void {
    this.loading = true;

    const filtrosLimpios: MovimientoInventarioFiltros = {
      page: this.currentPage,
      size: this.pageSize,
      productoId: this.filtros.productoId || undefined,
      tipoMovimiento: this.filtros.tipoMovimiento || undefined,
      fechaInicio: this.filtros.fechaInicio || undefined,
      fechaFin: this.filtros.fechaFin || undefined
    };

    this.movimientoService.buscarConFiltros(filtrosLimpios).subscribe({
      next: (response: ApiResponse<PaginatedResponse<MovimientoInventario>>) => {
        this.movimientos = response.data?.content || [];
        this.totalElements = response.data?.totalElements || 0;
        this.totalPages = response.data?.totalPages || 0;
        this.loading = false;

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
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  private cargarMovimientosSilencioso(): void {
    this.loading = true;

    const filtrosLimpios: MovimientoInventarioFiltros = {
      page: this.currentPage,
      size: this.pageSize,
      productoId: this.filtros.productoId || undefined,
      tipoMovimiento: this.filtros.tipoMovimiento || undefined,
      fechaInicio: this.filtros.fechaInicio || undefined,
      fechaFin: this.filtros.fechaFin || undefined
    };

    this.movimientoService.buscarConFiltros(filtrosLimpios).subscribe({
      next: (response: ApiResponse<PaginatedResponse<MovimientoInventario>>) => {
        this.movimientos = response.data?.content || [];
        this.totalElements = response.data?.totalElements || 0;
        this.totalPages = response.data?.totalPages || 0;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.cargarMovimientos();
  }

  onClearSearch(): void {
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

    // Mostrar feedback al usuario
    this.messageService.info(
      'Filtros limpiados. Aplicar nuevos criterios para filtrar movimientos.',
      'Filtros Limpiados'
    );

    this.cargarMovimientos();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.cargarMovimientosSilencioso();
  }

  onRefresh(): void {
    this.cargarMovimientos();
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
