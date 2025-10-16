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
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputNumberModule } from 'primeng/inputnumber';

import { InventarioReportesService } from '../../services/inventario-reportes.service';
import { ResumenInventario } from '../../models/resumen-inventario.model';
import { ProductosProximosVencerRequest } from '../../models/productos-proximos-vencer.model';

@Component({
  selector: 'app-productos-proximos-vencer',
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
    ToastModule,
    ProgressSpinnerModule,
    InputNumberModule
  ],
  providers: [MessageService],
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
    this.cargarProductosProximosVencer();
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
      },
      error: (error) => {
        console.error('Error cargando productos próximos a vencer:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar productos próximos a vencer'
        });
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
