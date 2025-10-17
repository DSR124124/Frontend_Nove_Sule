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
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { InventarioReportesService } from '../../services/inventario-reportes.service';
import { StockBajo } from '../../models/stock-bajo.model';
import { MessageService } from '../../../../core/services/message.service';
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
    this.cargarProductosConStockBajoSilencioso();
  }

  cargarProductosConStockBajo(): void {
    this.loading = true;
    this.inventarioReportesService.getProductosConStockBajo().subscribe({
      next: (response) => {
        this.productos = response.data;
        this.loading = false;

        // Mostrar mensaje de éxito
        this.messageService.success(
          `Se encontraron ${this.productos.length} productos con stock bajo`,
          'Stock Bajo Cargado'
        );
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  private cargarProductosConStockBajoSilencioso(): void {
    this.loading = true;
    this.inventarioReportesService.getProductosConStockBajo().subscribe({
      next: (response) => {
        this.productos = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
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
    this.messageService.info(
      'Funcionalidad de exportación a Excel en desarrollo',
      'Exportar Excel'
    );
  }

  exportarPDF(): void {
    // TODO: Implementar exportación a PDF
    this.messageService.info(
      'Funcionalidad de exportación a PDF en desarrollo',
      'Exportar PDF'
    );
  }
}
