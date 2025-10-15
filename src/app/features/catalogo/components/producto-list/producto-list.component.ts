import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto, ProductoFiltros } from '../../models/producto.model';
import { ApiResponse, PaginatedResponse } from '../../models/api-response.model';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.css'
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];
  loading = false;
  error: string | null = null;

  // Paginación
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Filtros
  filtros: ProductoFiltros = {
    nombre: '',
    codigo: '',
    categoriaId: undefined,
    marcaId: undefined,
    proveedorId: undefined,
    estado: undefined,
    page: 0,
    size: 10
  };

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Cargar productos con mensajes
    this.cargarProductos();
  }

  cargarProductosSimple(): void {
    this.loading = true;
    this.error = null;


    // Llamada simple sin filtros
    this.productoService.listar({}).subscribe({
      next: (response: ApiResponse<PaginatedResponse<Producto>>) => {
        this.productos = response.data.content;
        this.totalElements = response.data.totalElements;
        this.totalPages = response.data.totalPages;
        this.loading = false;

        // Mostrar mensaje de éxito
        this.messageService.success(
          `Se cargaron ${this.productos.length} productos correctamente`,
          'Productos Cargados'
        );
      },
      error: (error) => {

        // Usar MessageService para mostrar el error
        this.messageService.handleHttpError(error);

        let errorMessage = 'Error cargando productos';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.error = errorMessage;
        this.loading = false;
      }
    });
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = null;

    // Crear filtros limpios solo con valores válidos
    const filtrosLimpios: ProductoFiltros = {
      page: this.currentPage,
      size: this.pageSize
    };

    // Solo agregar filtros que tengan valores válidos
    if (this.filtros.nombre && this.filtros.nombre.trim()) {
      filtrosLimpios.nombre = this.filtros.nombre.trim();
    }
    if (this.filtros.codigo && this.filtros.codigo.trim()) {
      filtrosLimpios.codigo = this.filtros.codigo.trim();
    }
    if (this.filtros.categoriaId && this.filtros.categoriaId > 0) {
      filtrosLimpios.categoriaId = this.filtros.categoriaId;
    }
    if (this.filtros.marcaId && this.filtros.marcaId > 0) {
      filtrosLimpios.marcaId = this.filtros.marcaId;
    }
    if (this.filtros.proveedorId && this.filtros.proveedorId > 0) {
      filtrosLimpios.proveedorId = this.filtros.proveedorId;
    }
    if (this.filtros.estado && this.filtros.estado.trim()) {
      filtrosLimpios.estado = this.filtros.estado as any;
    }


    this.productoService.listar(filtrosLimpios).subscribe({
      next: (response: ApiResponse<PaginatedResponse<Producto>>) => {
        this.productos = response.data.content;
        this.totalElements = response.data.totalElements;
        this.totalPages = response.data.totalPages;
        this.loading = false;

        // Mostrar mensaje de éxito con filtros
        const filtrosAplicados = Object.keys(filtrosLimpios).filter(key =>
          key !== 'page' && key !== 'size' && filtrosLimpios[key as keyof ProductoFiltros]
        );

        if (filtrosAplicados.length > 0) {
          this.messageService.success(
            `Se encontraron ${this.productos.length} productos con los filtros aplicados`,
            'Búsqueda Exitosa'
          );
        } else {
          this.messageService.success(
            `Se cargaron ${this.productos.length} productos correctamente`,
            'Productos Cargados'
          );
        }
      },
      error: (error) => {

        // Usar MessageService para mostrar el error
        this.messageService.handleHttpError(error);

        let errorMessage = 'Error cargando productos';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.error = errorMessage;
        this.loading = false;
      }
    });
  }

  onFiltrar(): void {
    this.currentPage = 0; // Reset a la primera página
    this.cargarProductos();
  }

  onLimpiarFiltros(): void {
    this.filtros = {
      nombre: '',
      codigo: '',
      categoriaId: undefined,
      marcaId: undefined,
      proveedorId: undefined,
      estado: undefined,
      page: 0,
      size: 10
    };
    this.currentPage = 0;
    this.messageService.info('Limpiando filtros y cargando todos los productos...', 'Limpiando Filtros');
    this.cargarProductos();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarProductos();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.cargarProductos();
  }

  onRefresh(): void {
    this.messageService.info('Actualizando lista de productos...', 'Actualizando');
    this.cargarProductos();
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'ACTIVO': return 'estado-activo';
      case 'INACTIVO': return 'estado-inactivo';
      case 'ELIMINADO': return 'estado-eliminado';
      default: return 'estado-desconocido';
    }
  }

  getStockClass(stock: number, stockMinimo: number): string {
    if (stock === 0) return 'stock-sin';
    if (stock <= stockMinimo) return 'stock-bajo';
    return 'stock-normal';
  }

  getStockText(stock: number, stockMinimo: number): string {
    if (stock === 0) return 'Sin Stock';
    if (stock <= stockMinimo) return 'Stock Bajo';
    return 'Stock Normal';
  }

  // Métodos para paginación
  get pages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  // Exponer Math para usar en el template
  Math = Math;
}
