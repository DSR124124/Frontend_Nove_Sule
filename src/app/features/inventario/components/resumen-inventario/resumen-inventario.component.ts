import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PrimeNgModule } from '../../../../prime-ng/prime-ng.module';
import { MessageService } from '../../../../core/services/message.service';

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
    this.cargarResumenGeneralSilencioso();
    this.cargarValorTotalInventarioSilencioso();
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

        // Mostrar mensaje de éxito
        const fechaFormateada = new Date(fecha).toLocaleDateString('es-PE');
        this.messageService.success(
          `Resumen del inventario cargado para ${fechaFormateada}. Total productos: ${this.totalProductos}, Stock bajo: ${this.productosConStockBajo}`,
          'Resumen Cargado'
        );
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  private cargarResumenGeneralSilencioso(): void {
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
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  cargarValorTotalInventario(): void {
    this.inventarioReportesService.getValorTotalInventario().subscribe({
      next: (response) => {
        this.valorTotalInventario = response.data;

        // Mostrar mensaje de éxito
        this.messageService.success(
          `Valor total del inventario actualizado: ${this.formatCurrency(this.valorTotalInventario)}`,
          'Valor Actualizado'
        );
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
      }
    });
  }

  private cargarValorTotalInventarioSilencioso(): void {
    this.inventarioReportesService.getValorTotalInventario().subscribe({
      next: (response) => {
        this.valorTotalInventario = response.data;
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
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

  actualizarDatos(): void {
    this.cargarResumenGeneral();
    this.cargarValorTotalInventario();
  }

  limpiarFiltros(): void {
    this.fechaSeleccionada = new Date();
    this.fechaInput = new Date().toISOString().split('T')[0];
    this.cargarResumenGeneral();
    this.messageService.info('Filtros de fecha restablecidos', 'Filtros');
  }
}
