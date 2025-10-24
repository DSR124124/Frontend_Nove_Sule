import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { AuthService } from '../../../features/auth/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, LoadingSpinnerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isSidebarCollapsed = false;
  currentTime = new Date();
  isLoggingOut = false;

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to sidebar collapse state
    this.sidebarService.sidebarCollapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(collapsed => {
        this.isSidebarCollapsed = collapsed;
      });

    // Update time every minute
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }


  getFormattedTime(): string {
    return this.currentTime.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getFormattedDate(): string {
    return this.currentTime.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  logout(): void {
    this.isLoggingOut = true;

    // Simular un pequeño delay para mostrar el spinner
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      this.isLoggingOut = false;
    }, 1000);
  }

  goToProfile(): void {
    this.router.navigate(['/usuarios/mi-perfil']);
  }
}
