import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
// import { CalendarModule } from 'primeng/calendar'; // Removed - using native date input
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { InventarioReportesService } from '../../services/inventario-reportes.service';
import { StockBajo } from '../../models/stock-bajo.model';
import { PrimeNgModule } from '../../../../prime-ng/prime-ng.module';
@Component({
  selector: 'app-stock-bajo',
  standalone: true,
  imports: [
    CommonModule,

    PrimeNgModule,
    ProgressSpinnerModule
  ],
  templateUrl: './stock-bajo.component.html',
  styleUrls: ['./stock-bajo.component.css']
})
export class StockBajoComponent implements OnInit {
  productos: StockBajo[] = [];
  loading = false;
  selectedProductos: StockBajo[] = [];

  constructor(
    private inventarioReportesService: InventarioReportesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarProductosConStockBajo();
  }

  cargarProductosConStockBajo(): void {
    this.loading = true;
    this.inventarioReportesService.getProductosConStockBajo().subscribe({
      next: (response) => {
        this.productos = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando productos con stock bajo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar productos con stock bajo'
        });
        this.loading = false;
      }
    });
  }

  onFilterGlobal(event: any, dt: any): void {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverityClass(diferencia: number): string {
    if (diferencia < 0) {
      return 'p-tag tag-sm tag-error';
    } else if (diferencia === 0) {
      return 'p-tag tag-sm tag-warning';
    }
    return 'p-tag tag-sm tag-info';
  }

  getEstadoText(diferencia: number): string {
    if (diferencia < 0) {
      return 'CRÍTICO';
    } else if (diferencia === 0) {
      return 'BAJO';
    }
    return 'NORMAL';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
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
