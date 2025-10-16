import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { PrimeNgModule } from '../../../../prime-ng/prime-ng.module';

// Services & Models
import { InventarioReportesService } from '../../services/inventario-reportes.service';
import { ResumenGeneralInventario } from '../../models/resumen-inventario.model';
import { MessageService } from '../../../../core/services/message.service';
/**
 * Niveles de alerta para el stock
 */
interface AlertLevel {
  readonly CRITICAL_THRESHOLD: number;
  readonly HIGH_THRESHOLD: number;
}

/**
 * Configuración de severidad para alertas
 */
interface SeverityConfig {
  readonly text: string;
  readonly class: string;
}

@Component({
  selector: 'app-resumen-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule
  ],
  templateUrl: './resumen-general.component.html',
  styleUrls: ['./resumen-general.component.css']
})
export class ResumenGeneralComponent implements OnInit {

  // ===============================
  // CONSTANTES
  // ===============================
  private readonly ALERT_LEVELS: AlertLevel = {
    CRITICAL_THRESHOLD: 20,
    HIGH_THRESHOLD: 10
  };

  private readonly SEVERITY_CONFIG = {
    CRITICAL: { text: 'CRÍTICO', class: 'p-tag-danger p-tag-rounded' },
    HIGH: { text: 'ALTO', class: 'p-tag-warning p-tag-rounded' },
    NORMAL: { text: 'NORMAL', class: 'p-tag-success p-tag-rounded' }
  } as const;

  // ===============================
  // PROPIEDADES DEL COMPONENTE
  // ===============================
  resumenGeneral: ResumenGeneralInventario | null = null;
  loading = false;
  fechaSeleccionada: Date = new Date();
  fechaInput: string = new Date().toISOString().split('T')[0];

  // ===============================
  // CONSTRUCTOR & LIFECYCLE
  // ===============================
  constructor(
    private readonly inventarioReportesService: InventarioReportesService,
    private readonly messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarResumenGeneral();
  }

  // ===============================
  // MÉTODOS PÚBLICOS (EVENTOS)
  // ===============================

  /**
   * Maneja el cambio de fecha seleccionada
   */
  onFechaChange(): void {
    if (this.fechaInput) {
      this.fechaSeleccionada = new Date(this.fechaInput);
      this.cargarResumenGeneral();
    }
  }

  /**
   * Exporta el resumen a PDF
   */
  exportarPDF(): void {
    // TODO: Implementar exportación a PDF
    this.messageService.add({
      severity: 'info',
      summary: 'Exportar',
      detail: 'Funcionalidad de exportación en desarrollo'
    });
  }

  // ===============================
  // MÉTODOS PRIVADOS (LÓGICA DE NEGOCIO)
  // ===============================

  /**
   * Carga el resumen general del inventario
   */
  cargarResumenGeneral(): void {
    this.loading = true;
    const fecha = this.fechaSeleccionada.toISOString().split('T')[0];

    this.inventarioReportesService.getResumenGeneral(fecha).subscribe({
      next: (response) => {
        this.resumenGeneral = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando resumen general:', error);
        this.showErrorMessage('Error al cargar resumen general del inventario');
        this.loading = false;
      }
    });
  }

  /**
   * Muestra mensaje de error
   */
  private showErrorMessage(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }

  // ===============================
  // MÉTODOS HELPER/UTILIDADES
  // ===============================

  /**
   * Formatea valor monetario en soles peruanos
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }

  /**
   * Formatea fecha en formato local peruano
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-PE');
  }

  /**
   * Obtiene el texto de severidad basado en el porcentaje
   */
  getSeverityText(porcentaje: number): string {
    if (porcentaje > this.ALERT_LEVELS.CRITICAL_THRESHOLD) {
      return this.SEVERITY_CONFIG.CRITICAL.text;
    }
    if (porcentaje > this.ALERT_LEVELS.HIGH_THRESHOLD) {
      return this.SEVERITY_CONFIG.HIGH.text;
    }
    return this.SEVERITY_CONFIG.NORMAL.text;
  }

  /**
   * Obtiene la clase CSS de severidad basada en el porcentaje
   */
  getSeverityClass(porcentaje: number): string {
    if (porcentaje > this.ALERT_LEVELS.CRITICAL_THRESHOLD) {
      return this.SEVERITY_CONFIG.CRITICAL.class;
    }
    if (porcentaje > this.ALERT_LEVELS.HIGH_THRESHOLD) {
      return this.SEVERITY_CONFIG.HIGH.class;
    }
    return this.SEVERITY_CONFIG.NORMAL.class;
  }
}
