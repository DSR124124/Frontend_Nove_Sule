import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { PrimeNgModule } from '../../../../prime-ng/prime-ng.module';
import { MessageService } from '../../../../core/services/message.service';
import { LoadingService } from '../../../../shared/services/loading.service';

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
  fechaSeleccionada: Date = new Date();
  fechaInput: string = new Date().toISOString().split('T')[0];
  valorTotalInventario = 0;
  totalProductos = 0;
  productosConStockBajo = 0;

  constructor(
    private inventarioReportesService: InventarioReportesService,
    private messageService: MessageService,
    private loadingService: LoadingService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.cargarResumenGeneral(true);
  }

  async cargarResumenGeneral(mostrarMensajeExito: boolean = true): Promise<void> {
    const fecha = this.fechaSeleccionada.toISOString().split('T')[0];

    try {
      await this.loadingService.withLoading(
        async () => {
          const [resumenResponse, valorResponse] = await Promise.all([
            firstValueFrom(this.inventarioReportesService.getResumenGeneral(fecha)),
            firstValueFrom(this.inventarioReportesService.getValorTotalInventario())
          ]);

          this.resumenGeneral = resumenResponse.data;
          this.totalProductos = this.resumenGeneral.totalProductos;
          this.productosConStockBajo = this.resumenGeneral.productosConStockBajo;
          this.valorTotalInventario = valorResponse.data || this.resumenGeneral.valorTotalInventario;

          return { resumenResponse, valorResponse };
        },
        {
          id: 'resumen-inventario',
          message: 'Cargando resumen del inventario...',
          size: 'medium',
          overlay: true
        }
      );

      if (mostrarMensajeExito) {
        const fechaFormateada = new Date(fecha).toLocaleDateString('es-PE');
        this.messageService.success(
          `Resumen cargado para ${fechaFormateada}. Total: ${this.totalProductos} productos, Stock bajo: ${this.productosConStockBajo}`,
          'Resumen Actualizado'
        );
      }

    } catch (error) {
      this.messageService.handleHttpError(error);
    }
  }

  async onFechaChange(): Promise<void> {
    if (this.fechaInput) {
      this.fechaSeleccionada = new Date(this.fechaInput);
      await this.cargarResumenGeneral();
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

  async actualizarDatos(): Promise<void> {
    await this.cargarResumenGeneral(true);
  }

  async limpiarFiltros(): Promise<void> {
    this.fechaSeleccionada = new Date();
    this.fechaInput = new Date().toISOString().split('T')[0];
    await this.cargarResumenGeneral(true);
  }

  // Getter para verificar si está cargando
  get isLoading(): boolean {
    return this.loadingService.isLoading;
  }
}
