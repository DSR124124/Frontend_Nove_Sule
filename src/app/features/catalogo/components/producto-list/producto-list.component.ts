import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto, ProductoFiltros, ProductoBusqueda } from '../../models/producto.model';
import { ApiResponse, PaginatedResponse } from '../../models/api-response.model';
import { MessageService } from '../../../../core/services/message.service';
import { ProductoSearchComponent } from '../producto-search/producto-search.component';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductoSearchComponent,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    MessageModule,
    ProgressSpinnerModule,
    PaginatorModule,
    PanelModule,
    TableModule,
    TooltipModule
  ],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.css'
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];
  loading = false;

  // Paginación
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Opciones para el componente de búsqueda
  categoriaOptions: any[] = [];
  marcaOptions: any[] = [];
  proveedorOptions: any[] = [];

  // Búsqueda actual
  busquedaActual: ProductoBusqueda = {
    texto: '',
    precioMin: undefined,
    precioMax: undefined,
    categoriaId: undefined,
    marcaId: undefined,
    proveedorId: undefined
  };

  // Estado del panel de filtros
  filtrosCollapsed = true;

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
        // Usar MessageService para mostrar el error como toast
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  cargarProductos(): void {
    this.loading = true;

    // Crear filtros limpios solo con valores válidos
    const filtrosLimpios: ProductoFiltros = {
      page: this.currentPage,
      size: this.pageSize
    };

    // Agregar filtros de búsqueda
    if (this.busquedaActual.texto && this.busquedaActual.texto.trim()) {
      filtrosLimpios.nombre = this.busquedaActual.texto.trim();
    }
    if (this.busquedaActual.precioMin !== undefined && this.busquedaActual.precioMin > 0) {
      filtrosLimpios.precioMin = this.busquedaActual.precioMin;
    }
    if (this.busquedaActual.precioMax !== undefined && this.busquedaActual.precioMax > 0) {
      filtrosLimpios.precioMax = this.busquedaActual.precioMax;
    }
    if (this.busquedaActual.categoriaId && this.busquedaActual.categoriaId > 0) {
      filtrosLimpios.categoriaId = this.busquedaActual.categoriaId;
    }
    if (this.busquedaActual.marcaId && this.busquedaActual.marcaId > 0) {
      filtrosLimpios.marcaId = this.busquedaActual.marcaId;
    }
    if (this.busquedaActual.proveedorId && this.busquedaActual.proveedorId > 0) {
      filtrosLimpios.proveedorId = this.busquedaActual.proveedorId;
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
        // Usar MessageService para mostrar el error como toast
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  onSearch(busqueda: ProductoBusqueda): void {
    this.busquedaActual = busqueda;
    this.currentPage = 0; // Reset a la primera página
    this.cargarProductos();
  }

  onClearSearch(): void {
    this.busquedaActual = {
      texto: '',
      precioMin: undefined,
      precioMax: undefined,
      categoriaId: undefined,
      marcaId: undefined,
      proveedorId: undefined
    };
    this.currentPage = 0;
    this.messageService.info('Limpiando búsqueda y cargando todos los productos...', 'Limpiando Búsqueda');
    this.cargarProductos();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.cargarProductos();
  }

  onRefresh(): void {
    this.messageService.info('Actualizando lista de productos...', 'Actualizando');
    this.cargarProductos();
  }

  getEstadoStyleClass(estado: string): string {
    switch (estado) {
      case 'ACTIVO': return 'p-tag tag-success tag-sm';
      case 'INACTIVO': return 'p-tag tag-warning tag-sm';
      case 'ELIMINADO': return 'p-tag tag-danger tag-sm';
      default: return 'p-tag tag-gray tag-sm';
    }
  }

  getStockStyleClass(stock: number, stockMinimo: number): string {
    if (stock === 0) return 'p-tag tag-danger tag-sm';
    if (stock <= stockMinimo) return 'p-tag tag-warning tag-sm';
    return 'p-tag tag-success tag-sm';
  }

  getStockTextClass(stock: number, stockMinimo: number): string {
    if (stock === 0) return 'text-error';
    if (stock <= stockMinimo) return 'text-warning';
    return 'text-success';
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

