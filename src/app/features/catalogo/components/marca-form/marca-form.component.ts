import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

import { Marca, MarcaRequest } from '../../models/marca.model';
import { MarcaService } from '../../services/marca.service';
import { ApiResponse } from '../../models/api-response.model';

@Component({
  selector: 'app-marca-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule
  ],
  templateUrl: './marca-form.component.html',
  styleUrl: './marca-form.component.css'
})
export class MarcaFormComponent implements OnInit {
  marcaForm!: FormGroup;
  loading = false;
  isEdit = false;
  marcaId?: number;

  constructor(
    private fb: FormBuilder,
    private marcaService: MarcaService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.marcaForm = this.createForm();
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      logo: ['', [Validators.maxLength(255)]],
      sitioWeb: ['', [Validators.maxLength(255)]],
      contacto: ['', [Validators.maxLength(100)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(20)]]
    });
  }

  private checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.marcaId = +params['id'];
        this.loadMarca();
      }
    });
  }

  private loadMarca(): void {
    if (!this.marcaId) return;

    this.loading = true;
    this.marcaService.buscarPorId(this.marcaId).subscribe({
      next: (response) => {
        const marca = response.data;
        this.marcaForm.patchValue({
          nombre: marca.nombre,
          descripcion: marca.descripcion,
          logo: marca.logo,
          sitioWeb: marca.sitioWeb,
          contacto: marca.contacto,
          email: marca.email,
          telefono: marca.telefono
        });
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar la marca'
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.marcaForm.valid) {
      this.loading = true;
      const marcaData: MarcaRequest = this.marcaForm.value;

      if (this.isEdit && this.marcaId) {
        this.marcaService.actualizar(this.marcaId, marcaData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Actualización Exitosa',
              detail: 'Marca actualizada exitosamente'
            });
            this.router.navigate(['/catalogo/marcas']);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar la marca'
            });
            this.loading = false;
          }
        });
      } else {
        this.marcaService.crear(marcaData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Creación Exitosa',
              detail: 'Marca creada exitosamente'
            });
            this.router.navigate(['/catalogo/marcas']);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear la marca'
            });
            this.loading = false;
          }
        });
      }
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Formulario Incompleto',
        detail: 'Por favor, complete todos los campos requeridos'
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/catalogo/marcas']);
  }

  // Getters para validación de formulario
  get nombre() { return this.marcaForm.get('nombre'); }
  get descripcion() { return this.marcaForm.get('descripcion'); }
  get logo() { return this.marcaForm.get('logo'); }
  get sitioWeb() { return this.marcaForm.get('sitioWeb'); }
  get contacto() { return this.marcaForm.get('contacto'); }
  get email() { return this.marcaForm.get('email'); }
  get telefono() { return this.marcaForm.get('telefono'); }
}
