import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { LoginResponse } from '../../../auth/models/login-response.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-usuario-perfil',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './usuario-perfil.component.html',
  styleUrl: './usuario-perfil.component.css'
})
export class UsuarioPerfilComponent implements OnInit {
  currentUser: LoginResponse | null = null;
  isLoading = false;

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;

    this.usuarioService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isLoading = false;
        this.messageService.success('Perfil cargado exitosamente', 'Perfil');
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.error('No se pudo cargar el perfil del usuario');
      }
    });
  }
}
