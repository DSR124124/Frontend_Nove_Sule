import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

// Servicios y modelos
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor, ProveedorRequest } from '../../models/proveedor.model';
import { ApiResponse } from '../../models/api-response.model';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
    InputNumberModule, SelectModule, CardModule, DividerModule,
    ProgressSpinnerModule
  ],
  templateUrl: './proveedor-form.component.html',
  styleUrl: './proveedor-form.component.css'
})
export class ProveedorFormComponent implements OnInit {
  // ===== PROPIEDADES =====
  proveedorForm!: FormGroup;
  loading = false;
  isEditMode = false;
  proveedorId: number | null = null;

  // Opciones para dropdowns
  opcionesTipoCuenta = [
    { label: 'Seleccionar tipo', value: null },
    { label: 'Ahorros', value: 'AHORROS' },
    { label: 'Corriente', value: 'CORRIENTE' }
  ];

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.proveedorForm = this.createForm();
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  // ===== MÉTODOS DE FORMULARIO =====

  private createForm(): FormGroup {
    return this.fb.group({
      // Información básica
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      razonSocial: ['', [Validators.maxLength(150)]],
      ruc: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^\d{11}$/)]],

      // Ubicación
      direccion: ['', [Validators.required]],
      distrito: ['', [Validators.required, Validators.maxLength(50)]],
      provincia: ['', [Validators.required, Validators.maxLength(50)]],
      departamento: ['', [Validators.required, Validators.maxLength(50)]],
      codigoPostal: ['', [Validators.maxLength(10)]],

      // Contacto
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      sitioWeb: ['', [Validators.maxLength(255)]],
      contacto: ['', [Validators.required, Validators.maxLength(100)]],
      cargo: ['', [Validators.maxLength(50)]],

      // Información bancaria
      banco: ['', [Validators.maxLength(50)]],
      numeroCuenta: ['', [Validators.maxLength(20)]],
      tipoCuenta: [null],

      // Términos comerciales
      plazoPago: [30, [Validators.min(1), Validators.max(365)]],
      descuento: [0, [Validators.min(0), Validators.max(100)]],
      limiteCredito: [0, [Validators.min(0)]],
      observaciones: ['']
    });
  }

  // ===== MÉTODOS DE INICIALIZACIÓN =====

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.proveedorId = +id;
      this.loadProveedor();
    }
  }

  private loadProveedor(): void {
    if (!this.proveedorId) return;

    this.loading = true;
    this.proveedorService.buscarPorId(this.proveedorId).subscribe({
      next: (response: ApiResponse<Proveedor>) => {
        if (response.success && response.data) {
          this.proveedorForm.patchValue({
            nombre: response.data.nombre,
            razonSocial: response.data.razonSocial || '',
            ruc: response.data.ruc,
            direccion: response.data.direccion,
            distrito: response.data.distrito,
            provincia: response.data.provincia,
            departamento: response.data.departamento,
            codigoPostal: response.data.codigoPostal || '',
            telefono: response.data.telefono,
            email: response.data.email,
            sitioWeb: response.data.sitioWeb || '',
            contacto: response.data.contacto,
            cargo: response.data.cargo || '',
            banco: response.data.banco || '',
            numeroCuenta: response.data.numeroCuenta || '',
            tipoCuenta: response.data.tipoCuenta || null,
            plazoPago: response.data.plazoPago || 30,
            descuento: response.data.descuento || 0,
            limiteCredito: response.data.limiteCredito || 0,
            observaciones: response.data.observaciones || ''
          });
        } else {
          this.messageService.add({
            severity: 'error', summary: 'Error',
            detail: 'No se pudo cargar la información del proveedor'
          });
          this.router.navigate(['/catalogo/proveedores']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar proveedor:', error);
        this.messageService.add({
          severity: 'error', summary: 'Error',
          detail: 'Error al cargar la información del proveedor'
        });
        this.loading = false;
        this.router.navigate(['/catalogo/proveedores']);
      }
    });
  }

  // ===== MÉTODOS DE ACCIONES =====

  onSubmit(): void {
    if (this.proveedorForm.valid) {
      this.loading = true;
      const proveedorData: ProveedorRequest = this.proveedorForm.value;

      if (this.isEditMode && this.proveedorId) {
        this.proveedorService.actualizar(this.proveedorId, proveedorData).subscribe({
          next: (response: ApiResponse<Proveedor>) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success', summary: 'Actualización Exitosa',
                detail: 'Proveedor actualizado correctamente'
              });
              this.router.navigate(['/catalogo/proveedores']);
            } else {
              this.messageService.add({
                severity: 'error', summary: 'Error',
                detail: response.message || 'Error al actualizar el proveedor'
              });
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al actualizar proveedor:', error);
            this.messageService.add({
              severity: 'error', summary: 'Error',
              detail: 'Error al actualizar el proveedor'
            });
            this.loading = false;
          }
        });
      } else {
        this.proveedorService.crear(proveedorData).subscribe({
          next: (response: ApiResponse<Proveedor>) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success', summary: 'Creación Exitosa',
                detail: 'Proveedor creado correctamente'
              });
              this.router.navigate(['/catalogo/proveedores']);
            } else {
              this.messageService.add({
                severity: 'error', summary: 'Error',
                detail: response.message || 'Error al crear el proveedor'
              });
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al crear proveedor:', error);
            this.messageService.add({
              severity: 'error', summary: 'Error',
              detail: 'Error al crear el proveedor'
            });
            this.loading = false;
          }
        });
      }
    } else {
      this.messageService.add({
        severity: 'warn', summary: 'Formulario Inválido',
        detail: 'Por favor, completa todos los campos requeridos correctamente'
      });
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/catalogo/proveedores']);
  }

  // ===== MÉTODOS DE UTILIDAD =====

  private markFormGroupTouched(): void {
    Object.keys(this.proveedorForm.controls).forEach(key => {
      const control = this.proveedorForm.get(key);
      control?.markAsTouched();
    });
  }

  // ===== GETTERS PARA VALIDACIÓN =====

  get nombre() { return this.proveedorForm.get('nombre'); }
  get razonSocial() { return this.proveedorForm.get('razonSocial'); }
  get ruc() { return this.proveedorForm.get('ruc'); }
  get direccion() { return this.proveedorForm.get('direccion'); }
  get distrito() { return this.proveedorForm.get('distrito'); }
  get provincia() { return this.proveedorForm.get('provincia'); }
  get departamento() { return this.proveedorForm.get('departamento'); }
  get codigoPostal() { return this.proveedorForm.get('codigoPostal'); }
  get telefono() { return this.proveedorForm.get('telefono'); }
  get email() { return this.proveedorForm.get('email'); }
  get sitioWeb() { return this.proveedorForm.get('sitioWeb'); }
  get contacto() { return this.proveedorForm.get('contacto'); }
  get cargo() { return this.proveedorForm.get('cargo'); }
  get banco() { return this.proveedorForm.get('banco'); }
  get numeroCuenta() { return this.proveedorForm.get('numeroCuenta'); }
  get tipoCuenta() { return this.proveedorForm.get('tipoCuenta'); }
  get plazoPago() { return this.proveedorForm.get('plazoPago'); }
  get descuento() { return this.proveedorForm.get('descuento'); }
  get limiteCredito() { return this.proveedorForm.get('limiteCredito'); }
  get observaciones() { return this.proveedorForm.get('observaciones'); }
}
