import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageService } from '../../../../core/services/message.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { MovimientoInventario, TipoMovimiento } from '../../models/movimiento-inventario.model';
import { MovimientoInventarioService } from '../../services/movimiento-inventario.service';
import { PrimeNgModule } from '../../../../prime-ng/prime-ng.module';
import { CurrencyPePipe } from '../../../../shared/pipes/currency-pe.pipe';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-ultimo-movimiento-producto',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule,
    CurrencyPePipe,
    TimeAgoPipe
  ],
  templateUrl: './ultimo-movimiento-producto.component.html',
  styleUrl: './ultimo-movimiento-producto.component.css'
})
export class UltimoMovimientoProductoComponent implements OnInit, OnChanges {
  @Input() productoId!: number;
  @Input() mostrarTitulo: boolean = true;
  @Input() vista: 'completa' | 'compacta' = 'completa';

  ultimoMovimiento: MovimientoInventario | null = null;
  isLoading = false;

  // Enum para template
  TipoMovimiento = TipoMovimiento;

  constructor(
    private movimientoInventarioService: MovimientoInventarioService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Obtener productoId de la ruta si no se proporciona como input
    if (!this.productoId) {
      const productoIdFromRoute = this.route.snapshot.paramMap.get('productoId');
      if (productoIdFromRoute) {
        this.productoId = +productoIdFromRoute;
      }
    }

    if (this.productoId) {
      this.cargarUltimoMovimiento();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productoId'] && this.productoId) {
      this.cargarUltimoMovimiento();
    }
  }

  async cargarUltimoMovimiento() {
    try {
      this.isLoading = true;
      if (this.vista === 'completa') {
        this.loadingService.show({ message: 'Cargando último movimiento...' });
      }

      const response = await firstValueFrom(
        this.movimientoInventarioService.obtenerUltimoMovimientoProducto(this.productoId)
      );

      if (response.success) {
        this.ultimoMovimiento = response.data;
      } else {
        if (this.vista === 'completa') {
          this.messageService.add({
            severity: 'info',
            summary: 'Información',
            detail: 'No hay movimientos registrados para este producto'
          });
        }
        this.ultimoMovimiento = null;
      }

    } catch (error: any) {
      console.error('Error cargando último movimiento:', error);
      if (this.vista === 'completa') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el último movimiento del producto'
        });
      }
    } finally {
      this.isLoading = false;
      if (this.vista === 'completa') {
        this.loadingService.hide();
      }
    }
  }

  getTipoMovimientoLabel(tipo: TipoMovimiento): string {
    switch (tipo) {
      case TipoMovimiento.ENTRADA:
        return 'Entrada';
      case TipoMovimiento.SALIDA:
        return 'Salida';
      case TipoMovimiento.AJUSTE:
        return 'Ajuste';
      case TipoMovimiento.TRANSFERENCIA:
        return 'Transferencia';
      default:
        return tipo;
    }
  }

  getTipoMovimientoSeverity(tipo: TipoMovimiento): 'success' | 'danger' | 'warn' | 'info' | 'secondary' {
    switch (tipo) {
      case TipoMovimiento.ENTRADA:
        return 'success';
      case TipoMovimiento.SALIDA:
        return 'danger';
      case TipoMovimiento.AJUSTE:
        return 'warn';
      case TipoMovimiento.TRANSFERENCIA:
        return 'info';
      default:
        return 'secondary';
    }
  }

  // Propiedades para el template que devuelven los valores correctos
  get ultimoMovimientoSeverity(): 'success' | 'danger' | 'warn' | 'info' | 'secondary' {
    return this.ultimoMovimiento ? this.getTipoMovimientoSeverity(this.ultimoMovimiento.tipoMovimiento) : 'secondary';
  }

  getTipoMovimientoIcon(tipo: TipoMovimiento): string {
    switch (tipo) {
      case TipoMovimiento.ENTRADA:
        return 'pi pi-arrow-down-left';
      case TipoMovimiento.SALIDA:
        return 'pi pi-arrow-up-right';
      case TipoMovimiento.AJUSTE:
        return 'pi pi-cog';
      case TipoMovimiento.TRANSFERENCIA:
        return 'pi pi-arrow-right-arrow-left';
      default:
        return 'pi pi-circle';
    }
  }

  calcularTotal(movimiento: MovimientoInventario): number {
    return movimiento.cantidad * movimiento.precioUnitario;
  }

  getStockChangeClass(): string {
    if (!this.ultimoMovimiento) return '';

    if (this.ultimoMovimiento.stockNuevo > this.ultimoMovimiento.stockAnterior) {
      return 'stock-increase';
    } else if (this.ultimoMovimiento.stockNuevo < this.ultimoMovimiento.stockAnterior) {
      return 'stock-decrease';
    } else {
      return 'stock-same';
    }
  }

  getStockChange(): number {
    if (!this.ultimoMovimiento) return 0;
    return this.ultimoMovimiento.stockNuevo - this.ultimoMovimiento.stockAnterior;
  }
}
