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

@Component({
  selector: 'app-movimientos-orden-compra',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule,
    CurrencyPePipe
  ],
  templateUrl: './movimientos-orden-compra.component.html',
  styleUrl: './movimientos-orden-compra.component.css'
})
export class MovimientosOrdenCompraComponent implements OnInit, OnChanges {
  @Input() ordenCompraId!: number;
  @Input() mostrarTitulo: boolean = true;

  movimientos: MovimientoInventario[] = [];
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
    // Obtener ordenCompraId de la ruta si no se proporciona como input
    if (!this.ordenCompraId) {
      const ordenCompraIdFromRoute = this.route.snapshot.paramMap.get('ordenCompraId');
      if (ordenCompraIdFromRoute) {
        this.ordenCompraId = +ordenCompraIdFromRoute;
      }
    }

    if (this.ordenCompraId) {
      this.cargarMovimientos();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ordenCompraId'] && this.ordenCompraId) {
      this.cargarMovimientos();
    }
  }

  async cargarMovimientos() {
    try {
      this.isLoading = true;
      this.loadingService.show({ message: 'Cargando movimientos de la orden...' });

      const response = await firstValueFrom(
        this.movimientoInventarioService.listarMovimientosOrdenCompra(this.ordenCompraId)
      );

      if (response.success) {
        this.movimientos = response.data;
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: response.message || 'No se pudieron cargar los movimientos'
        });
      }

    } catch (error: any) {
      console.error('Error cargando movimientos de orden de compra:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar los movimientos de la orden de compra'
      });
    } finally {
      this.isLoading = false;
      this.loadingService.hide();
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

  getTipoMovimientoSeverity(tipo: TipoMovimiento): string {
    switch (tipo) {
      case TipoMovimiento.ENTRADA:
        return 'success';
      case TipoMovimiento.SALIDA:
        return 'danger';
      case TipoMovimiento.AJUSTE:
        return 'warning';
      case TipoMovimiento.TRANSFERENCIA:
        return 'info';
      default:
        return 'secondary';
    }
  }

  calcularTotal(movimiento: MovimientoInventario): number {
    return movimiento.cantidad * movimiento.precioUnitario;
  }

  getTotalMovimientos(): number {
    return this.movimientos.reduce((total, mov) => total + this.calcularTotal(mov), 0);
  }
}
