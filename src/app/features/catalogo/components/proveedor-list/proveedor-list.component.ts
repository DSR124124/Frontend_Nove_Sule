import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Servicios y modelos
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor, ProveedorFiltros, Estado } from '../../models/proveedor.model';
import { ApiResponse, PaginatedResponse } from '../../models/api-response.model';

@Component({
  selector: 'app-proveedor-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule,
    DropdownModule, TagModule, ProgressSpinnerModule, PanelModule, TableModule,
    TooltipModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './proveedor-list.component.html',
  styleUrl: './proveedor-list.component.css'
})
export class ProveedorListComponent implements OnInit {
  // ===== PROPIEDADES =====
  proveedores: Proveedor[] = [];
  loading = false;
  totalRecords = 0;
  first = 0;
  rows = 10;

  // Filtros
  filtros: ProveedorFiltros = {
    nombre: '',
    ruc: '',
    email: '',
    estado: undefined,
    page: 0,
    size: 10
  };

  // Opciones para dropdowns
  opcionesEstado = [
    { label: 'Todos', value: undefined },
    { label: 'Activo', value: Estado.ACTIVO },
    { label: 'Inactivo', value: Estado.INACTIVO }
  ];

  // Panel de filtros
  filtrosVisible = false;

  constructor(
    private proveedorService: ProveedorService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  // ===== MÉTODOS DE CARGA =====

  cargarProveedores(): void {
    this.loading = true;
    const filtrosLimpios = this.limpiarFiltros();

    this.proveedorService.listar(filtrosLimpios).subscribe({
      next: (response: ApiResponse<PaginatedResponse<Proveedor>>) => {
        if (response.success && response.data) {
          this.proveedores = response.data.content || [];
          this.totalRecords = response.data.totalElements || 0;
          this.first = (response.data.number || 0) * (response.data.size || 10);
          this.rows = response.data.size || 10;

          // Mostrar mensaje de éxito
          const filtrosAplicados = this.obtenerFiltrosAplicados();
          if (filtrosAplicados.length > 0) {
            this.messageService.add({
              severity: 'success', summary: 'Búsqueda Exitosa',
              detail: `Se encontraron ${this.proveedores.length} proveedores con los filtros aplicados`
            });
          } else {
            this.messageService.add({
              severity: 'success', summary: 'Proveedores Cargados',
              detail: `Se cargaron ${this.proveedores.length} proveedores correctamente`
            });
          }
        } else {
          this.proveedores = [];
          this.totalRecords = 0;
          this.messageService.add({
            severity: 'warn', summary: 'Sin Datos',
            detail: 'No se encontraron proveedores'
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar proveedores:', error);
        this.messageService.add({
          severity: 'error', summary: 'Error',
          detail: 'Error al cargar los proveedores'
        });
        this.loading = false;
      }
    });
  }

  // ===== MÉTODOS DE FILTROS =====

  onSearch(): void {
    this.filtros.page = 0;
    this.first = 0;
    this.cargarProveedores();
  }

  onClearSearch(): void {
    this.filtros = {
      nombre: '',
      ruc: '',
      email: '',
      estado: undefined,
      page: 0,
      size: 10
    };
    this.first = 0;
    this.cargarProveedores();
  }

  limpiarFiltros(): ProveedorFiltros {
    const filtrosLimpios: ProveedorFiltros = {
      page: this.filtros.page,
      size: this.filtros.size
    };

    if (this.filtros.nombre && this.filtros.nombre.trim()) {
      filtrosLimpios.nombre = this.filtros.nombre.trim();
    }
    if (this.filtros.ruc && this.filtros.ruc.trim()) {
      filtrosLimpios.ruc = this.filtros.ruc.trim();
    }
    if (this.filtros.email && this.filtros.email.trim()) {
      filtrosLimpios.email = this.filtros.email.trim();
    }
    if (this.filtros.estado) {
      filtrosLimpios.estado = this.filtros.estado;
    }

    return filtrosLimpios;
  }

  obtenerFiltrosAplicados(): string[] {
    const filtros: string[] = [];
    if (this.filtros.nombre && this.filtros.nombre.trim()) {
      filtros.push(`Nombre: ${this.filtros.nombre.trim()}`);
    }
    if (this.filtros.ruc && this.filtros.ruc.trim()) {
      filtros.push(`RUC: ${this.filtros.ruc.trim()}`);
    }
    if (this.filtros.email && this.filtros.email.trim()) {
      filtros.push(`Email: ${this.filtros.email.trim()}`);
    }
    if (this.filtros.estado) {
      filtros.push(`Estado: ${this.filtros.estado}`);
    }
    return filtros;
  }

  // ===== MÉTODOS DE PAGINACIÓN =====

  onPageChange(event: any): void {
    this.filtros.page = event.page;
    this.filtros.size = event.rows;
    this.first = event.first;
    this.rows = event.rows;
    this.cargarProveedores();
  }

  onRefresh(): void {
    this.cargarProveedores();
  }

  // ===== MÉTODOS DE ACCIONES =====

  onEliminar(proveedor: Proveedor): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el proveedor "${proveedor.nombre}"?`)) {
      this.proveedorService.eliminar(proveedor.id).subscribe({
        next: (response: ApiResponse<string>) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success', summary: 'Eliminado',
              detail: 'Proveedor eliminado exitosamente'
            });
            this.cargarProveedores();
          } else {
            this.messageService.add({
              severity: 'error', summary: 'Error',
              detail: response.message || 'Error al eliminar el proveedor'
            });
          }
        },
        error: (error) => {
          console.error('Error al eliminar proveedor:', error);
          this.messageService.add({
            severity: 'error', summary: 'Error',
            detail: 'Error al eliminar el proveedor'
          });
        }
      });
    }
  }

  onCambiarEstado(proveedor: Proveedor): void {
    const nuevoEstado = proveedor.estado === Estado.ACTIVO ? Estado.INACTIVO : Estado.ACTIVO;
    const accion = nuevoEstado === Estado.ACTIVO ? 'activar' : 'desactivar';

    if (confirm(`¿Estás seguro de que deseas ${accion} el proveedor "${proveedor.nombre}"?`)) {
      this.proveedorService.cambiarEstado(proveedor.id, nuevoEstado).subscribe({
        next: (response: ApiResponse<Proveedor>) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success', summary: 'Estado Actualizado',
              detail: `Proveedor ${accion}do exitosamente`
            });
            this.cargarProveedores();
          } else {
            this.messageService.add({
              severity: 'error', summary: 'Error',
              detail: response.message || 'Error al cambiar el estado del proveedor'
            });
          }
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          this.messageService.add({
            severity: 'error', summary: 'Error',
            detail: 'Error al cambiar el estado del proveedor'
          });
        }
      });
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====

  getEstadoStyleClass(estado: Estado): string {
    return estado === Estado.ACTIVO ? 'estado-activo' : 'estado-inactivo';
  }

  getEstadoText(estado: Estado): string {
    return estado === Estado.ACTIVO ? 'Activo' : 'Inactivo';
  }

  toggleFiltros(): void {
    this.filtrosVisible = !this.filtrosVisible;
  }
}
