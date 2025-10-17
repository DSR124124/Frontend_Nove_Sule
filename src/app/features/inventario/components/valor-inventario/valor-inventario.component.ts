import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from '../../../../core/services/message.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TagModule } from 'primeng/tag';

import { InventarioReportesService } from '../../services/inventario-reportes.service';
import { ValorInventarioResponse, ValorInventarioProductoResponse } from '../../models/valor-inventario.model';

@Component({
  selector: 'app-valor-inventario',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    ProgressSpinnerModule,
    AutoCompleteModule,
    TagModule
  ],
  templateUrl: './valor-inventario.component.html',
  styleUrls: ['./valor-inventario.component.css']
})
export class ValorInventarioComponent implements OnInit {
  valorTotal: number = 0;
  valorProducto: number = 0;
  loading = false;
  productoId: number | null = null;
  productoSeleccionado: any = null;
  productos: any[] = [];
  mostrarDetalleProducto = false;

  constructor(
    private inventarioReportesService: InventarioReportesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarValorTotalSilencioso();
    this.cargarProductos();
  }

  cargarValorTotal(): void {
    this.loading = true;
    this.inventarioReportesService.getValorTotalInventario().subscribe({
      next: (response) => {
        this.valorTotal = response.data;
        this.loading = false;

        // Mostrar mensaje de éxito
        this.messageService.success(
          `Valor total del inventario: ${this.formatCurrency(this.valorTotal)}`,
          'Valor Cargado'
        );
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  private cargarValorTotalSilencioso(): void {
    this.loading = true;
    this.inventarioReportesService.getValorTotalInventario().subscribe({
      next: (response) => {
        this.valorTotal = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  cargarProductos(): void {
    // TODO: Implementar carga de productos desde el servicio
    this.productos = [
      { id: 1, nombre: 'Producto 1', codigo: 'PROD001' },
      { id: 2, nombre: 'Producto 2', codigo: 'PROD002' },
      { id: 3, nombre: 'Producto 3', codigo: 'PROD003' }
    ];
  }

  consultarValorProducto(): void {
    if (!this.productoId) {
      this.messageService.warn(
        'Por favor seleccione un producto',
        'Advertencia'
      );
      return;
    }

    this.loading = true;
    this.inventarioReportesService.getValorInventarioProducto(this.productoId).subscribe({
      next: (response) => {
        this.valorProducto = response.data;
        this.mostrarDetalleProducto = true;
        this.loading = false;

        // Mostrar mensaje de éxito con información del producto
        this.messageService.success(
          `Valor del producto "${this.productoSeleccionado?.nombre}": ${this.formatCurrency(this.valorProducto)}`,
          'Consulta Exitosa'
        );
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  onProductoSelect(event: any): void {
    this.productoId = event.value?.id || null;
    this.mostrarDetalleProducto = false;
  }

  limpiarConsulta(): void {
    this.productoId = null;
    this.productoSeleccionado = null;
    this.valorProducto = 0;
    this.mostrarDetalleProducto = false;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }

  exportarPDF(): void {
    // TODO: Implementar exportación a PDF
    this.messageService.info(
      'Funcionalidad de exportación a PDF en desarrollo',
      'Exportar PDF'
    );
  }
}
