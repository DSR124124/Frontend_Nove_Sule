import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioListItem, UsuarioListFilters, UsuarioListResponse } from '../../models/usuario-list.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { MessageService } from '../../../../core/services/message.service';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { ToolbarModule } from 'primeng/toolbar';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    TableModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    CardModule,
    TagModule,
    PaginatorModule,
    ToolbarModule,
    SkeletonModule
  ],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css'
})
export class UsuarioListComponent implements OnInit {
  usuarios: UsuarioListItem[] = [];
  isLoading = false;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Filtros
  filters: UsuarioListFilters = {
    username: '',
    email: '',
    rol: '',
    estado: ''
  };

  // Opciones para filtros
  roles = ['ADMIN', 'GERENTE', 'VENDEDOR', 'CAJERO'];
  estados = ['ACTIVO', 'INACTIVO'];

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.isLoading = true;

    const filters: UsuarioListFilters = {
      ...this.filters,
      page: this.currentPage,
      size: this.pageSize
    };

    this.usuarioService.getUsuarios(filters).subscribe({
      next: (response) => {
        this.usuarios = response.content || [];
        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.error('Error cargando la lista de usuarios');
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadUsuarios();
  }

  onClearFilters(): void {
    this.filters = {
      username: '',
      email: '',
      rol: '',
      estado: ''
    };
    this.currentPage = 0;
    this.loadUsuarios();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.loadUsuarios();
  }


  getEstadoStyleClass(estado: string): string {
    return estado === 'ACTIVO' ? 'tag-success tag-sm' : 'tag-danger tag-sm';
  }

  getRolStyleClass(rol: string): string {
    switch (rol) {
      case 'ADMIN': return 'tag-danger tag-sm';
      case 'GERENTE': return 'tag-warning tag-sm';
      case 'VENDEDOR': return 'tag-info tag-sm';
      case 'CAJERO': return 'tag-secondary tag-sm';
      default: return 'tag-gray tag-sm';
    }
  }
}
