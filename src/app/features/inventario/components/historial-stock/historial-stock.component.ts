import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
// import { CalendarModule } from 'primeng/calendar'; // Removed - using native date input
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { InventarioReportesService } from '../../services/inventario-reportes.service';
import { MovimientoInventario } from '../../models/movimiento-inventario.model';
import { HistorialStockRequest } from '../../models/historial-stock.model';

@Component({
  selector: 'app-historial-stock',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    // CalendarModule, // Removed
    FormsModule,
    ProgressSpinnerModule,
    AutoCompleteModule
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
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor seleccione un producto y las fechas de búsqueda'
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
    const request: HistorialStockRequest = {
      productoId: this.productoId,
      fechaInicio: this.fechaInicio.toISOString().split('T')[0],
      fechaFin: this.fechaFin.toISOString().split('T')[0]
    };

    this.inventarioReportesService.getHistorialStock(request).subscribe({
      next: (response) => {
        this.movimientos = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando historial:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar historial de stock'
        });
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
    this.messageService.add({
      severity: 'info',
      summary: 'Exportar',
      detail: 'Funcionalidad de exportación en desarrollo'
    });
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
    this.messageService.add({
      severity: 'info',
      summary: 'Exportar',
      detail: 'Funcionalidad de exportación en desarrollo'
    });
  }
}
