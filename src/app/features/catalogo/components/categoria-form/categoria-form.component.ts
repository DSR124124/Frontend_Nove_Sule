import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { MessageService } from '../../../../core/services/message.service';
import { CategoriaRequest, Categoria } from '../../models/categoria.model';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule
  ],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.css'
})
export class CategoriaFormComponent implements OnInit {
  categoriaForm: FormGroup;
  loading = false;
  isEdit = false;
  categoriaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoriaForm = this.createForm();
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      imagen: ['', [Validators.maxLength(255)]],
      color: ['', [Validators.maxLength(7), Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]]
    });
  }

  private checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.categoriaId = +params['id'];
        this.loadCategoria();
      }
    });
  }

  private loadCategoria(): void {
    if (!this.categoriaId) return;

    this.loading = true;
    this.categoriaService.buscarPorId(this.categoriaId).subscribe({
      next: (response) => {
        const categoria = response.data;
        this.categoriaForm.patchValue({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
          imagen: categoria.imagen,
          color: categoria.color
        });
        this.loading = false;
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.categoriaForm.valid) {
      this.loading = true;
      const categoriaData: CategoriaRequest = {
        ...this.categoriaForm.value,
        estado: 'ACTIVO' // Estado automático
        // El orden se maneja automáticamente en el backend
      };

      if (this.isEdit && this.categoriaId) {
        this.categoriaService.actualizar(this.categoriaId, categoriaData).subscribe({
          next: (response) => {
            this.messageService.success('Categoría actualizada exitosamente', 'Actualización Exitosa');
            this.router.navigate(['/catalogo/categorias']);
          },
          error: (error) => {
            this.messageService.handleHttpError(error);
            this.loading = false;
          }
        });
      } else {
        this.categoriaService.crear(categoriaData).subscribe({
          next: (response) => {
            this.messageService.success('Categoría creada exitosamente', 'Creación Exitosa');
            this.router.navigate(['/catalogo/categorias']);
          },
          error: (error) => {
            this.messageService.handleHttpError(error);
            this.loading = false;
          }
        });
      }
    } else {
      this.messageService.info('Por favor, complete todos los campos requeridos', 'Formulario Incompleto');
    }
  }

  onCancel(): void {
    this.router.navigate(['/catalogo/categorias']);
  }

  // Getters para validación de formulario
  get nombre() { return this.categoriaForm.get('nombre'); }
  get descripcion() { return this.categoriaForm.get('descripcion'); }
  get imagen() { return this.categoriaForm.get('imagen'); }
  get color() { return this.categoriaForm.get('color'); }
}
