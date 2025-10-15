import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-reports.component.html',
  styleUrl: './producto-reports.component.css'
})
export class ProductoReportsComponent implements OnInit {
  productosMasVendidos: Producto[] = [];
  productosStockBajo: Producto[] = [];
  loading = false;
  error: string | null = null;

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.loading = true;
    this.error = null;

    // Cargar productos más vendidos
    this.productoService.listarMasVendidos(10).subscribe({
      next: (response) => {
        this.productosMasVendidos = response.data;
      },
      error: (error) => {
        console.error('Error cargando productos más vendidos:', error);
        this.error = 'Error cargando productos más vendidos';
      }
    });

    // Cargar productos con stock bajo
    this.productoService.listarConStockBajo().subscribe({
      next: (response) => {
        this.productosStockBajo = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando productos con stock bajo:', error);
        this.error = 'Error cargando productos con stock bajo';
        this.loading = false;
      }
    });
  }

  onRefresh(): void {
    this.cargarReportes();
  }

  exportarCSV(): void {
    // Función de exportación CSV - pendiente de implementar en el backend
    console.log('Función de exportación CSV pendiente de implementar');
    this.error = 'Función de exportación CSV no disponible aún';
  }
}
