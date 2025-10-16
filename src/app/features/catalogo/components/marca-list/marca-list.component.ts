import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

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
    DropdownModule,
    TagModule,
    ProgressSpinnerModule,
    PanelModule,
    TableModule,
    TooltipModule
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
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarMarcas();
  }

  cargarMarcas(): void {
    this.loading = true;

    // Crear filtros limpios solo con valores válidos
    const filtrosLimpios: MarcaFiltros = {
      page: this.currentPage,
      size: this.pageSize
    };

    // Agregar filtros de búsqueda
    if (this.filtros.nombre && this.filtros.nombre.trim()) {
      filtrosLimpios.nombre = this.filtros.nombre.trim();
    }
    if (this.filtros.estado && this.filtros.estado.trim()) {
      filtrosLimpios.estado = this.filtros.estado;
    }

    this.marcaService.listar(filtrosLimpios).subscribe({
      next: (response: ApiResponse<PaginatedResponse<Marca>>) => {
        this.marcas = response.data.content;
        this.totalElements = response.data.totalElements;
        this.totalPages = response.data.totalPages;
        this.loading = false;

        // Mostrar mensaje de éxito con filtros
        const filtrosAplicados = Object.keys(filtrosLimpios).filter(key =>
          key !== 'page' && key !== 'size' && filtrosLimpios[key as keyof MarcaFiltros]
        );

        if (filtrosAplicados.length > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Búsqueda Exitosa',
            detail: `Se encontraron ${this.marcas.length} marcas con los filtros aplicados`
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Marcas Cargadas',
            detail: `Se cargaron ${this.marcas.length} marcas correctamente`
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las marcas'
        });
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

  onEliminar(marca: Marca): void {
    if (confirm(`¿Está seguro de que desea eliminar la marca "${marca.nombre}"?`)) {
      this.marcaService.eliminar(marca.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminación Exitosa',
            detail: 'Marca eliminada exitosamente'
          });
          this.cargarMarcas();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar la marca'
          });
        }
      });
    }
  }

  onCambiarEstado(marca: Marca): void {
    const nuevoEstado = marca.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const accion = nuevoEstado === 'ACTIVO' ? 'activar' : 'desactivar';

    if (confirm(`¿Está seguro de que desea ${accion} la marca "${marca.nombre}"?`)) {
      this.marcaService.cambiarEstado(marca.id, nuevoEstado).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Estado Actualizado',
            detail: `Marca ${accion}da exitosamente`
          });
          this.cargarMarcas();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cambiar el estado de la marca'
          });
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
