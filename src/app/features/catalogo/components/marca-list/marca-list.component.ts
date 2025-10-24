import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { MessageService as CoreMessageService } from '../../../../core/services/message.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationDialogService } from '../../../../shared/services/confirmation-dialog.service';

import { Marca, MarcaFiltros, Estado } from '../../models/marca.model';
import { MarcaService } from '../../services/marca.service';
import { ApiResponse, PaginatedResponse } from '../../models/api-response.model';

@Component({
  selector: 'app-marca-list',
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
  templateUrl: './marca-list.component.html',
  styleUrl: './marca-list.component.css'
})
export class MarcaListComponent implements OnInit {
  marcas: Marca[] = [];
  loading = false;
  filtrosCollapsed = true;

  // Paginación
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Filtros
  filtros: MarcaFiltros = {
    nombre: '',
    estado: undefined
  };

  // Opciones para dropdowns
  estadoOptions = [
    { label: 'Todos', value: undefined },
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' }
  ];

  constructor(
    private marcaService: MarcaService,
    private messageService: MessageService,
    private coreMessageService: CoreMessageService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit(): void {
    this.cargarMarcas();
  }

  cargarMarcas(): void {
    this.loading = true;

    // Crear filtros limpios
    const filtrosLimpios: MarcaFiltros = {
      page: this.currentPage,
      size: this.pageSize,
      nombre: this.filtros.nombre?.trim() || undefined,
      estado: this.filtros.estado
    };

    this.marcaService.listar(filtrosLimpios).subscribe({
      next: (response: ApiResponse<PaginatedResponse<Marca>>) => {
        this.marcas = response.data?.content || [];
        this.totalElements = response.data?.totalElements || 0;
        this.totalPages = response.data?.totalPages || 0;
        this.loading = false;

        // Mostrar mensaje de éxito con filtros
        const filtrosAplicados = Object.keys(filtrosLimpios).filter(key =>
          key !== 'page' && key !== 'size' && filtrosLimpios[key as keyof MarcaFiltros]
        );

        if (filtrosAplicados.length > 0) {
          this.coreMessageService.success(
            `Se encontraron ${this.marcas.length} marcas con los filtros aplicados`,
            'Búsqueda Exitosa'
          );
        } else {
          this.coreMessageService.success(
            `Se cargaron ${this.marcas.length} marcas correctamente`,
            'Marcas Cargadas'
          );
        }
      },
      error: (error) => {
        this.coreMessageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.cargarMarcas();
  }

  onClearSearch(): void {
    this.filtros = {
      nombre: '',
      estado: undefined
    };
    this.currentPage = 0;
    this.cargarMarcas();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.cargarMarcas();
  }

  onRefresh(): void {
    this.cargarMarcas();
  }

  async onEliminar(marca: Marca): Promise<void> {
    const confirmed = await this.confirmationDialogService.showDeleteConfirmation(
      marca.nombre,
      'marca'
    );

    if (confirmed) {
      this.marcaService.eliminar(marca.id).subscribe({
        next: () => {
          this.coreMessageService.success('Marca eliminada exitosamente', 'Eliminación Exitosa');
          this.cargarMarcas();
        },
        error: (error) => {
          this.coreMessageService.handleHttpError(error);
        }
      });
    }
  }

  async onCambiarEstado(marca: Marca): Promise<void> {
    const nuevoEstado = marca.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const accion = nuevoEstado === 'ACTIVO' ? 'activar' : 'desactivar';

    const confirmed = await this.confirmationDialogService.showStatusChangeConfirmation(
      marca.nombre,
      accion,
      'marca'
    );

    if (confirmed) {
      this.marcaService.cambiarEstado(marca.id, nuevoEstado).subscribe({
        next: () => {
          this.coreMessageService.success(`Marca ${accion}da exitosamente`, 'Estado Actualizado');
          this.cargarMarcas();
        },
        error: (error) => {
          this.coreMessageService.handleHttpError(error);
        }
      });
    }
  }

  getEstadoStyleClass(estado: string): string {
    switch (estado) {
      case 'ACTIVO':
        return 'success-tag';
      case 'INACTIVO':
        return 'danger-tag';
      default:
        return 'secondary-tag';
    }
  }

  getEstadoText(estado: string): string {
    switch (estado) {
      case 'ACTIVO':
        return 'Activo';
      case 'INACTIVO':
        return 'Inactivo';
      default:
        return estado;
    }
  }
}
