import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService as CoreMessageService } from '../../../../core/services/message.service';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';

import { MovimientoInventarioRequest, TipoMovimiento } from '../../models/movimiento-inventario.model';
import { MovimientoInventarioService } from '../../services/movimiento-inventario.service';
import { ApiResponse } from '../../../catalogo/models/api-response.model';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    MessageModule
  ],
  providers: [MessageService],
  templateUrl: './movimiento-form.component.html',
  styleUrl: './movimiento-form.component.css'
})
export class MovimientoFormComponent implements OnInit {
  movimientoForm: FormGroup;
  loading = false;
  isEdit = false;
  movimientoId: number | null = null;

  // Opciones para dropdowns
  tipoMovimientoOptions = [
    { label: 'Entrada', value: TipoMovimiento.ENTRADA },
    { label: 'Salida', value: TipoMovimiento.SALIDA },
    { label: 'Ajuste', value: TipoMovimiento.AJUSTE },
    { label: 'Transferencia', value: TipoMovimiento.TRANSFERENCIA }
  ];

  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoInventarioService,
    private messageService: MessageService,
    private coreMessageService: CoreMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.movimientoForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.movimientoId = +params['id'];
        this.cargarMovimiento();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      productoId: ['', [Validators.required, Validators.min(1)]],
      tipoMovimiento: ['', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.min(0.01)]],
      precioUnitario: ['', [Validators.required, Validators.min(0.01)]],
      motivo: ['', [Validators.required, Validators.maxLength(255)]],
      observaciones: ['', [Validators.maxLength(500)]],
      ordenCompraId: [''],
      comprobanteVentaId: ['']
    });
  }

  private cargarMovimiento(): void {
    if (!this.movimientoId) return;

    this.loading = true;
    this.movimientoService.buscarPorId(this.movimientoId).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.success && response.data) {
          this.movimientoForm.patchValue({
            productoId: response.data.productoId,
            tipoMovimiento: response.data.tipoMovimiento,
            cantidad: response.data.cantidad,
            precioUnitario: response.data.precioUnitario,
            motivo: response.data.motivo,
            observaciones: response.data.observaciones,
            ordenCompraId: response.data.ordenCompraId,
            comprobanteVentaId: response.data.comprobanteVentaId
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.coreMessageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.movimientoForm.valid) {
      this.loading = true;
      const movimientoData: MovimientoInventarioRequest = this.movimientoForm.value;

      if (this.isEdit && this.movimientoId) {
        // Lógica para editar (si se implementa en el futuro)
        this.coreMessageService.info('La edición de movimientos no está disponible', 'Función no disponible');
        this.loading = false;
      } else {
        this.movimientoService.registrarMovimiento(movimientoData).subscribe({
          next: (response: ApiResponse<any>) => {
            this.coreMessageService.success('Movimiento registrado exitosamente', 'Registro Exitoso');
            this.router.navigate(['/inventario/movimientos']);
            this.loading = false;
          },
          error: (error) => {
            this.coreMessageService.handleHttpError(error);
            this.loading = false;
          }
        });
      }
    } else {
      this.marcarCamposComoTocados();
      this.coreMessageService.error('Por favor, complete todos los campos requeridos', 'Formulario Inválido');
    }
  }

  onCancel(): void {
    this.router.navigate(['/inventario/movimientos']);
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.movimientoForm.controls).forEach(key => {
      this.movimientoForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.movimientoForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a 0`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} excede la longitud máxima`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      productoId: 'ID del Producto',
      tipoMovimiento: 'Tipo de Movimiento',
      cantidad: 'Cantidad',
      precioUnitario: 'Precio Unitario',
      motivo: 'Motivo',
      observaciones: 'Observaciones',
      ordenCompraId: 'ID de Orden de Compra',
      comprobanteVentaId: 'ID de Comprobante de Venta'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.movimientoForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
