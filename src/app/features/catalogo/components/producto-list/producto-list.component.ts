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
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ProductoDetailDialogComponent } from '../../dialogs/producto-detail-dialog/producto-detail-dialog.component';

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
    SelectModule,
    TagModule,
    MessageModule,
    ProgressSpinnerModule,
    PaginatorModule,
    PanelModule,
    TableModule,
    TooltipModule,
    ProductoDetailDialogComponent
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


  // Búsqueda actual
  busquedaActual: ProductoBusqueda = {
    texto: '',
    precioMin: undefined,
    precioMax: undefined,
    categoriaId: undefined,
    marcaId: undefined,
    proveedorId: undefined
  };


  // Diálogo de detalles
  showDetailsDialog = false;
  selectedProducto: Producto | null = null;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;

    // Crear filtros limpios
    const filtrosLimpios: ProductoFiltros = {
      page: this.currentPage,
      size: this.pageSize,
      nombre: this.busquedaActual.texto?.trim() || undefined,
      precioMin: this.busquedaActual.precioMin || undefined,
      precioMax: this.busquedaActual.precioMax || undefined,
      categoriaId: this.busquedaActual.categoriaId || undefined,
      marcaId: this.busquedaActual.marcaId || undefined,
      proveedorId: this.busquedaActual.proveedorId || undefined
    };

    this.productoService.listar(filtrosLimpios).subscribe({
      next: (response: ApiResponse<PaginatedResponse<Producto>>) => {
        this.productos = response.data?.content || [];
        this.totalElements = response.data?.totalElements || 0;
        this.totalPages = response.data?.totalPages || 0;
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
    this.cargarProductos();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.cargarProductos();
  }

  onRefresh(): void {
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


  // Método para ver detalles del producto
  onVerDetalles(producto: Producto): void {
    this.selectedProducto = producto;
    this.showDetailsDialog = true;
  }

  // Método para cerrar el diálogo
  onCerrarDetalles(): void {
    this.showDetailsDialog = false;
    this.selectedProducto = null;
  }

  // Método para editar producto desde el diálogo
  onEditProducto(producto: Producto): void {
    this.showDetailsDialog = false;
    this.selectedProducto = null;
    // La navegación se maneja en el diálogo con routerLink
  }
}

