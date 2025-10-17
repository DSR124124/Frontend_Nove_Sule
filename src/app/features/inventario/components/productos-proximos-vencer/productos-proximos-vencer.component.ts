import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from '../../../../core/services/message.service';

import { InventarioReportesService } from '../../services/inventario-reportes.service';
import { ResumenInventario } from '../../models/resumen-inventario.model';
import { ProductosProximosVencerRequest } from '../../models/productos-proximos-vencer.model';
import { PrimeNgModule } from '../../../../prime-ng/prime-ng.module';

@Component({
  selector: 'app-productos-proximos-vencer',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    PrimeNgModule
  ],
  templateUrl: './productos-proximos-vencer.component.html',
  styleUrls: ['./productos-proximos-vencer.component.css']
})
export class ProductosProximosVencerComponent implements OnInit {
  productos: ResumenInventario[] = [];
  loading = false;
  dias = 30;

  constructor(
    private inventarioReportesService: InventarioReportesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarProductosProximosVencerSilencioso();
  }

  cargarProductosProximosVencer(): void {
    this.loading = true;
    const request: ProductosProximosVencerRequest = {
      dias: this.dias
    };

    this.inventarioReportesService.getProductosProximosVencer(request).subscribe({
      next: (response) => {
        this.productos = response.data;
        this.loading = false;

        // Mostrar mensaje de éxito
        this.messageService.success(
          `Se encontraron ${this.productos.length} productos próximos a vencer en ${this.dias} días`,
          'Consulta Exitosa'
        );
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  private cargarProductosProximosVencerSilencioso(): void {
    this.loading = true;
    const request: ProductosProximosVencerRequest = {
      dias: this.dias
    };

    this.inventarioReportesService.getProductosProximosVencer(request).subscribe({
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

  onDiasChange(): void {
    this.cargarProductosProximosVencer();
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
}
