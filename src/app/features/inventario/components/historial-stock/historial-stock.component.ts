import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../../../core/services/message.service';

import { InventarioReportesService } from '../../services/inventario-reportes.service';
import { MovimientoInventario } from '../../models/movimiento-inventario.model';
import { HistorialStockRequest } from '../../models/historial-stock.model';
import { PrimeNgModule } from '../../../../prime-ng/prime-ng.module';

@Component({
  selector: 'app-historial-stock',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  templateUrl: './historial-stock.component.html',
  styleUrls: ['./historial-stock.component.css']
})
export class HistorialStockComponent implements OnInit {
  movimientos: MovimientoInventario[] = [];
  loading = false;
  productoId: number | null = null;
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  fechaInicioInput: string = '';
  fechaFinInput: string = '';
  productos: any[] = []; // Lista de productos para autocompletado
  productoSeleccionado: any = null;

  constructor(
    private inventarioReportesService: InventarioReportesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
    // Initialize date inputs
    const today = new Date().toISOString().split('T')[0];
    this.fechaInicioInput = today;
    this.fechaFinInput = today;
    this.fechaInicio = new Date();
    this.fechaFin = new Date();
  }

  cargarProductos(): void {
    // TODO: Implementar carga de productos desde el servicio
    this.productos = [
      { id: 1, nombre: 'Producto 1', codigo: 'PROD001' },
      { id: 2, nombre: 'Producto 2', codigo: 'PROD002' },
      { id: 3, nombre: 'Producto 3', codigo: 'PROD003' }
    ];
  }

  buscarHistorial(): void {
    if (!this.productoId || !this.fechaInicio || !this.fechaFin) {
      this.messageService.warn(
        'Por favor seleccione un producto y las fechas de búsqueda',
        'Advertencia'
      );
      return;
    }

    if (this.fechaInicio > this.fechaFin) {
      this.messageService.warn(
        'La fecha de inicio debe ser anterior a la fecha de fin',
        'Advertencia'
      );
      return;
    }

    this.loading = true;
    const request: HistorialStockRequest = {
      productoId: this.productoId,
      fechaInicio: this.fechaInicio.toISOString().split('T')[0],
      fechaFin: this.fechaFin.toISOString().split('T')[0]
    };

    this.inventarioReportesService.getHistorialStock(request).subscribe({
      next: (response) => {
        this.movimientos = response.data;
        this.loading = false;

        // Mostrar mensaje de éxito con información del historial
        const periodo = `${this.fechaInicio?.toLocaleDateString('es-PE')} - ${this.fechaFin?.toLocaleDateString('es-PE')}`;
        const productoNombre = this.productoSeleccionado?.nombre || 'Producto seleccionado';

        this.messageService.success(
          `Se encontraron ${this.movimientos.length} movimientos para "${productoNombre}" en el período ${periodo}`,
          'Historial Cargado'
        );
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  onProductoSelect(event: any): void {
    this.productoId = event.value?.id || null;
  }

  onFilterGlobal(event: any, dt: any): void {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverityClass(tipoMovimiento: string): string {
    switch (tipoMovimiento) {
      case 'ENTRADA':
        return 'p-tag tag-sm tag-success';
      case 'SALIDA':
        return 'p-tag tag-sm tag-error';
      case 'AJUSTE':
        return 'p-tag tag-sm tag-warning';
      case 'TRANSFERENCIA':
        return 'p-tag tag-sm tag-info';
      default:
        return 'p-tag tag-sm tag-secondary';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-PE');
  }

  exportarExcel(): void {
    // TODO: Implementar exportación a Excel
    this.messageService.info(
      'Funcionalidad de exportación a Excel en desarrollo',
      'Exportar Excel'
    );
  }

  onFechaInicioChange(): void {
    if (this.fechaInicioInput) {
      this.fechaInicio = new Date(this.fechaInicioInput);
    }
  }

  onFechaFinChange(): void {
    if (this.fechaFinInput) {
      this.fechaFin = new Date(this.fechaFinInput);
    }
  }

  exportarPDF(): void {
    // TODO: Implementar exportación a PDF
    this.messageService.info(
      'Funcionalidad de exportación a PDF en desarrollo',
      'Exportar PDF'
    );
  }

  limpiarFiltros(): void {
    this.productoId = null;
    this.productoSeleccionado = null;
    this.fechaInicio = null;
    this.fechaFin = null;
    this.fechaInicioInput = '';
    this.fechaFinInput = '';
    this.movimientos = [];

    // Mostrar feedback al usuario
    this.messageService.info(
      'Filtros limpiados. Selecciona un producto y fechas para buscar el historial.',
      'Filtros Limpiados'
    );
  }
}
