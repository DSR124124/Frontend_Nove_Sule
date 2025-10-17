import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria, CategoriaFiltros } from '../../models/categoria.model';
import { ApiResponse, PaginatedResponse } from '../../models/api-response.model';
import { MessageService } from '../../../../core/services/message.service';
import { ConfirmationDialogService } from '../../../../shared/services/confirmation-dialog.service';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    ProgressSpinnerModule,
    PanelModule,
    TableModule,
    TooltipModule,
    ConfirmDialogModule
  ],
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.css'
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;

  // Paginación
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Filtros
  filtros: CategoriaFiltros = {
    nombre: '',
    estado: undefined,
    page: 0,
    size: 10
  };

  // Opciones para dropdowns
  estadoOptions = [
    { label: 'Todos', value: undefined },
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' },
    { label: 'Eliminado', value: 'ELIMINADO' }
  ];


  constructor(
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.loading = true;

    // Crear filtros limpios
    const filtrosLimpios: CategoriaFiltros = {
      page: this.currentPage,
      size: this.pageSize,
      nombre: this.filtros.nombre?.trim() || undefined,
      estado: this.filtros.estado
    };

    this.categoriaService.listar(filtrosLimpios).subscribe({
      next: (response: ApiResponse<PaginatedResponse<Categoria>>) => {
        this.categorias = response.data?.content || [];
        this.totalElements = response.data?.totalElements || 0;
        this.totalPages = response.data?.totalPages || 0;
        this.loading = false;

        // Mostrar mensaje de éxito con filtros
        const filtrosAplicados = Object.keys(filtrosLimpios).filter(key =>
          key !== 'page' && key !== 'size' && filtrosLimpios[key as keyof CategoriaFiltros]
        );

        if (filtrosAplicados.length > 0) {
          this.messageService.success(
            `Se encontraron ${this.categorias.length} categorías con los filtros aplicados`,
            'Búsqueda Exitosa'
          );
        } else {
          this.messageService.success(
            `Se cargaron ${this.categorias.length} categorías correctamente`,
            'Categorías Cargadas'
          );
        }
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0; // Reset a la primera página
    this.cargarCategorias();
  }

  onClearSearch(): void {
    this.filtros = {
      nombre: '',
      estado: undefined,
      page: 0,
      size: 10
    };
    this.currentPage = 0;
    this.cargarCategorias();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.cargarCategorias();
  }

  onRefresh(): void {
    this.cargarCategorias();
  }

  async onEliminar(categoria: Categoria): Promise<void> {
    const confirmed = await this.confirmationDialogService.showDeleteConfirmation(
      categoria.nombre,
      'categoría'
    );

    if (confirmed) {
      this.categoriaService.eliminar(categoria.id).subscribe({
        next: () => {
          this.messageService.success('Categoría eliminada exitosamente', 'Eliminación Exitosa');
          this.cargarCategorias();
        },
        error: (error) => {
          this.messageService.handleHttpError(error);
        }
      });
    }
  }

  async onCambiarEstado(categoria: Categoria): Promise<void> {
    const nuevoEstado = categoria.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const accion = nuevoEstado === 'ACTIVO' ? 'activar' : 'desactivar';

    const confirmed = await this.confirmationDialogService.showStatusChangeConfirmation(
      categoria.nombre,
      accion,
      'categoría'
    );

    if (confirmed) {
      this.categoriaService.cambiarEstado(categoria.id, nuevoEstado).subscribe({
        next: () => {
          this.messageService.success(`Categoría ${accion}da exitosamente`, 'Estado Actualizado');
          this.cargarCategorias();
        },
        error: (error) => {
          this.messageService.handleHttpError(error);
        }
      });
    }
  }

  getEstadoStyleClass(estado: string): string {
    switch (estado) {
      case 'ACTIVO': return 'p-tag tag-success tag-sm';
      case 'INACTIVO': return 'p-tag tag-warning tag-sm';
      case 'ELIMINADO': return 'p-tag tag-danger tag-sm';
      default: return 'p-tag tag-gray tag-sm';
    }
  }

  getEstadoText(estado: string): string {
    switch (estado) {
      case 'ACTIVO': return 'Activo';
      case 'INACTIVO': return 'Inactivo';
      case 'ELIMINADO': return 'Eliminado';
      default: return 'Desconocido';
    }
  }

}
