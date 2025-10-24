import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { MessageService } from '../../../../core/services/message.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { InventarioReportesService } from '../../services/inventario-reportes.service';
import { ResumenInventario } from '../../models/resumen-inventario.model';
import { ProductosProximosVencerRequest } from '../../models/productos-proximos-vencer.model';
import { PrimeNgModule } from '../../../../prime-ng/prime-ng.module';

@Component({
  selector: 'app-productos-proximos-vencer',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  templateUrl: './productos-proximos-vencer.component.html',
  styleUrls: ['./productos-proximos-vencer.component.css']
})
export class ProductosProximosVencerComponent implements OnInit {
  productos: ResumenInventario[] = [];
  dias = 30;

  constructor(
    private inventarioReportesService: InventarioReportesService,
    private messageService: MessageService,
    private loadingService: LoadingService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.cargarProductosIniciales();
  }

  async cargarProductosProximosVencer(): Promise<void> {
    const request: ProductosProximosVencerRequest = {
      dias: this.dias
    };

    try {
      await this.loadingService.withLoading(
        async () => {
          const response = await firstValueFrom(
            this.inventarioReportesService.getProductosProximosVencer(request)
          );
          this.productos = response.data;
          return response;
        },
        {
          id: 'consulta-productos-vencer',
          message: `Consultando productos próximos a vencer...`,
          size: 'medium',
          overlay: true
        }
      );

      // Mostrar mensaje de éxito
      this.messageService.success(
        `Se encontraron ${this.productos.length} productos próximos a vencer en ${this.dias} días`,
        'Consulta Exitosa'
      );
    } catch (error) {
      this.messageService.handleHttpError(error);
    }
  }

  private async cargarProductosIniciales(): Promise<void> {
    const request: ProductosProximosVencerRequest = {
      dias: this.dias
    };

    try {
      await this.loadingService.withLoading(
        async () => {
          const response = await firstValueFrom(
            this.inventarioReportesService.getProductosProximosVencer(request)
          );
          this.productos = response.data;
          return response;
        },
        {
          id: 'carga-inicial-productos-vencer',
          message: 'Cargando productos próximos a vencer...',
          size: 'medium',
          overlay: true
        }
      );

      // Mensaje de carga exitosa
      if (this.productos.length > 0) {
        this.messageService.success(
          `Se cargaron ${this.productos.length} productos próximos a vencer en ${this.dias} días`,
          'Carga Exitosa'
        );
      } else {
        this.messageService.info(
          'No se encontraron productos próximos a vencer',
          'Sin Resultados'
        );
      }
    } catch (error) {
      this.messageService.handleHttpError(error);
    }
  }

  async onDiasChange(): Promise<void> {
    await this.cargarProductosProximosVencer();
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

  // Getter para verificar si está cargando
  get isLoading(): boolean {
    return this.loadingService.isLoading;
  }
}
