import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { PrimeNgModule } from '../../../../prime-ng/prime-ng.module';

import { InventarioReportesService } from '../../services/inventario-reportes.service';
import { ResumenInventario, ResumenGeneralInventario } from '../../models/resumen-inventario.model';

@Component({
  selector: 'app-resumen-inventario',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule
  ],
  templateUrl: './resumen-inventario.component.html',
  styleUrls: ['./resumen-inventario.component.css']
})
export class ResumenInventarioComponent implements OnInit {
  resumenGeneral: ResumenGeneralInventario | null = null;
  resumenes: ResumenInventario[] = [];
  loading = false;
  fechaSeleccionada: Date = new Date();
  fechaInput: string = new Date().toISOString().split('T')[0];
  valorTotalInventario = 0;
  totalProductos = 0;
  productosConStockBajo = 0;

  constructor(
    private inventarioReportesService: InventarioReportesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarResumenGeneral();
    this.cargarValorTotalInventario();
  }

  cargarResumenGeneral(): void {
    this.loading = true;
    const fecha = this.fechaSeleccionada.toISOString().split('T')[0];

    this.inventarioReportesService.getResumenGeneral(fecha).subscribe({
      next: (response) => {
        this.resumenGeneral = response.data;
        this.totalProductos = this.resumenGeneral.totalProductos;
        this.productosConStockBajo = this.resumenGeneral.productosConStockBajo;
        this.valorTotalInventario = this.resumenGeneral.valorTotalInventario;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando resumen general:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar resumen general del inventario'
        });
        this.loading = false;
      }
    });
  }

  cargarValorTotalInventario(): void {
    this.inventarioReportesService.getValorTotalInventario().subscribe({
      next: (response) => {
        this.valorTotalInventario = response.data;
      },
      error: (error) => {
        console.error('Error cargando valor total:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar valor total del inventario'
        });
      }
    });
  }

  onFechaChange(): void {
    if (this.fechaInput) {
      this.fechaSeleccionada = new Date(this.fechaInput);
      this.cargarResumenGeneral();
    }
  }

  onFilterGlobal(event: any, dt: any): void {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverityClass(estado: string): string {
    switch (estado) {
      case 'BAJO':
        return 'p-tag tag-sm tag-error';
      case 'SOBRE_STOCK':
        return 'p-tag tag-sm tag-warning';
      case 'NORMAL':
        return 'p-tag tag-sm tag-success';
      default:
        return 'p-tag tag-sm tag-info';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-PE');
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
