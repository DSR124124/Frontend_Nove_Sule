import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService, LoadingState } from '../../services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  // Propiedades de entrada (para uso manual)
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: 'primary' | 'secondary' | 'white' = 'primary';
  @Input() message: string = '';
  @Input() overlay: boolean = false;
  @Input() fullScreen: boolean = false;
  @Input() show: boolean = false;

  // Modo automático: se conecta al servicio global
  @Input() useGlobalService: boolean = true;

  // Estado interno del componente
  isVisible: boolean = false;
  currentState: LoadingState = { isLoading: false };

  private subscription?: Subscription;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    if (this.useGlobalService) {
      // Se conecta al servicio global
      this.subscription = this.loadingService.loading$.subscribe(
        (state: LoadingState) => {
          this.currentState = state;
          this.isVisible = state.isLoading;
          
          // Actualiza las propiedades con los valores del servicio
          if (state.isLoading) {
            this.size = state.size || this.size;
            this.color = state.color || this.color;
            this.message = state.message || this.message;
            this.overlay = state.overlay || this.overlay;
            this.fullScreen = state.fullScreen || this.fullScreen;
          }
        }
      );
    } else {
      // Modo manual: usa las propiedades de entrada
      this.isVisible = this.show;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Obtiene el estado de visibilidad final del spinner
   */
  get shouldShow(): boolean {
    return this.useGlobalService ? this.isVisible : this.show;
  }

  /**
   * Métodos de conveniencia para controlar el loading manualmente
   */
  showLoading(message?: string): void {
    if (this.useGlobalService) {
      this.loadingService.show({ message });
    } else {
      this.show = true;
      if (message) this.message = message;
    }
  }

  hideLoading(): void {
    if (this.useGlobalService) {
      this.loadingService.hide();
    } else {
      this.show = false;
    }
  }
}
