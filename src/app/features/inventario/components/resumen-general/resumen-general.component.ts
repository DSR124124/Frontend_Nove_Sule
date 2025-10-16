import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Module
import { MessageService } from 'primeng/api';
import { PrimeNgModule } from '../../../../prime-ng/prime-ng.module';

import { InventarioReportesService } from '../../services/inventario-reportes.service';
import { ResumenGeneralInventario } from '../../models/resumen-inventario.model';

@Component({
  selector: 'app-resumen-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule
  ],
  providers: [MessageService],
  templateUrl: './resumen-general.component.html',
  styleUrls: ['./resumen-general.component.css']
})
export class ResumenGeneralComponent implements OnInit {
  resumenGeneral: ResumenGeneralInventario | null = null;
  loading = false;
  fechaSeleccionada: Date = new Date();
  fechaInput: string = new Date().toISOString().split('T')[0];

  constructor(
    private inventarioReportesService: InventarioReportesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarResumenGeneral();
  }

  cargarResumenGeneral(): void {
    this.loading = true;
    const fecha = this.fechaSeleccionada.toISOString().split('T')[0];

    this.inventarioReportesService.getResumenGeneral(fecha).subscribe({
      next: (response) => {
        this.resumenGeneral = response.data;
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

  onFechaChange(): void {
    if (this.fechaInput) {
      this.fechaSeleccionada = new Date(this.fechaInput);
      this.cargarResumenGeneral();
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
    return new Date(dateString).toLocaleString('es-PE');
  }

  getSeverityText(porcentaje: number): string {
    if (porcentaje > 20) return 'CRÍTICO';
    if (porcentaje > 10) return 'ALTO';
    return 'NORMAL';
  }

  getSeverityClass(porcentaje: number): string {
    if (porcentaje > 20) return 'p-tag-danger p-tag-rounded';
    if (porcentaje > 10) return 'p-tag-warning p-tag-rounded';
    return 'p-tag-success p-tag-rounded';
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
