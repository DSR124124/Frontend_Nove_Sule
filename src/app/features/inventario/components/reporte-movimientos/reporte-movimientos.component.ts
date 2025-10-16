import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

import { InventarioReportesService } from '../../services/inventario-reportes.service';
import { MovimientoInventario } from '../../models/movimiento-inventario.model';
import { ReporteMovimientosRequest } from '../../models/reporte-movimientos.model';
import { PrimeNgModule } from '../../../../prime-ng/prime-ng.module';

@Component({
  selector: 'app-reporte-movimientos',
  standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      PrimeNgModule
    ],
  providers: [MessageService],
  templateUrl: './reporte-movimientos.component.html',
  styleUrls: ['./reporte-movimientos.component.css']
})
export class ReporteMovimientosComponent implements OnInit {
  movimientos: MovimientoInventario[] = [];
  loading = false;
  productoId: number | null = null;
  tipoMovimiento: string | null = null;
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  fechaInicioInput: string = '';
  fechaFinInput: string = '';
  productos: any[] = []; // Lista de productos para autocompletado
  productoSeleccionado: any = null;
  tiposMovimiento = [
    { label: 'Entrada', value: 'ENTRADA' },
    { label: 'Salida', value: 'SALIDA' },
    { label: 'Ajuste', value: 'AJUSTE' },
    { label: 'Transferencia', value: 'TRANSFERENCIA' }
  ];

  constructor(
    private inventarioReportesService: InventarioReportesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
    // Initialize date inputs with current date
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

  generarReporte(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor seleccione las fechas de búsqueda'
      });
      return;
    }

    if (this.fechaInicio > this.fechaFin) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La fecha de inicio debe ser anterior a la fecha de fin'
      });
      return;
    }

    this.loading = true;
    const request: ReporteMovimientosRequest = {
      productoId: this.productoId || undefined,
      tipoMovimiento: this.tipoMovimiento || undefined,
      fechaInicio: this.fechaInicio.toISOString(),
      fechaFin: this.fechaFin.toISOString()
    };

    this.inventarioReportesService.getReporteMovimientos(request).subscribe({
      next: (response) => {
        this.movimientos = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error generando reporte:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al generar reporte de movimientos'
        });
        this.loading = false;
      }
    });
  }

  onProductoSelect(event: any): void {
    this.productoId = event.value?.id || null;
  }

  limpiarFiltros(): void {
    this.productoId = null;
    this.productoSeleccionado = null;
    this.tipoMovimiento = null;
    this.fechaInicio = null;
    this.fechaFin = null;
    this.movimientos = [];
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

  exportarExcel(): void {
    // TODO: Implementar exportación a Excel
    this.messageService.add({
      severity: 'info',
      summary: 'Exportar',
      detail: 'Funcionalidad de exportación en desarrollo'
    });
  }

  exportarPDF(): void {
    // TODO: Implementar exportación a PDF
    this.messageService.add({
      severity: 'info',
      summary: 'Exportar',
      detail: 'Funcionalidad de exportación en desarrollo'
    });
  }
}
