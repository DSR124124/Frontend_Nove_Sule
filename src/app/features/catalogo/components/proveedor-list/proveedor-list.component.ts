import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { MessageService as CoreMessageService } from '../../../../core/services/message.service';
import { ConfirmationDialogService } from '../../../../shared/services/confirmation-dialog.service';

// Servicios y modelos
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor, ProveedorFiltros, Estado } from '../../models/proveedor.model';
import { ApiResponse, PaginatedResponse } from '../../models/api-response.model';

@Component({
  selector: 'app-proveedor-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule,
    SelectModule, TagModule, ProgressSpinnerModule, PanelModule, TableModule,
    TooltipModule, ToastModule, ConfirmDialogModule
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
    private coreMessageService: CoreMessageService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService
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
        this.proveedores = response.data?.content || [];
        this.totalRecords = response.data?.totalElements || 0;
        this.first = (response.data?.number || 0) * (response.data?.size || 10);
        this.rows = response.data?.size || 10;
        this.loading = false;
      },
      error: (error) => {
        this.coreMessageService.handleHttpError(error);
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
    return {
      page: this.filtros.page,
      size: this.filtros.size,
      nombre: this.filtros.nombre?.trim() || undefined,
      ruc: this.filtros.ruc?.trim() || undefined,
      email: this.filtros.email?.trim() || undefined,
      estado: this.filtros.estado
    };
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

  async onEliminar(proveedor: Proveedor): Promise<void> {
    const confirmed = await this.confirmationDialogService.showDeleteConfirmation(
      proveedor.nombre,
      'proveedor'
    );

    if (confirmed) {
      this.proveedorService.eliminar(proveedor.id).subscribe({
        next: (response: ApiResponse<string>) => {
          this.coreMessageService.success('Proveedor eliminado exitosamente', 'Eliminación Exitosa');
          this.cargarProveedores();
        },
        error: (error) => {
          this.coreMessageService.handleHttpError(error);
        }
      });
    }
  }

  async onCambiarEstado(proveedor: Proveedor): Promise<void> {
    const nuevoEstado = proveedor.estado === Estado.ACTIVO ? Estado.INACTIVO : Estado.ACTIVO;
    const accion = nuevoEstado === Estado.ACTIVO ? 'activar' : 'desactivar';

    const confirmed = await this.confirmationDialogService.showStatusChangeConfirmation(
      proveedor.nombre,
      accion,
      'proveedor'
    );

    if (confirmed) {
      this.proveedorService.cambiarEstado(proveedor.id, nuevoEstado).subscribe({
        next: (response: ApiResponse<Proveedor>) => {
          this.coreMessageService.success(`Proveedor ${accion}do exitosamente`, 'Estado Actualizado');
          this.cargarProveedores();
        },
        error: (error) => {
          this.coreMessageService.handleHttpError(error);
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
