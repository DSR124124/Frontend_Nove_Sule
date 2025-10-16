import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { MarcaService } from '../../services/marca.service';
import { ProveedorService } from '../../services/proveedor.service';
import { MessageService } from '../../../../core/services/message.service';
import { ProductoRequest, CategoriaBasica, MarcaBasica, ProveedorBasico } from '../../models/producto.model';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-producto-form',
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
    ProgressSpinnerModule
  ],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent implements OnInit {
  productoForm: FormGroup;
  loading = false;
  isEdit = false;
  productoId: number | null = null;

  // Opciones para dropdowns
  categoriaOptions: any[] = [];
  marcaOptions: any[] = [];
  proveedorOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
    private proveedorService: ProveedorService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productoForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadDropdownOptions();
    this.checkEditMode();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      precioCompra: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      stockMinimo: [0, [Validators.required, Validators.min(0)]],
      stockMaximo: [null, [Validators.min(0)]],
      codigoBarras: ['', [Validators.maxLength(50)]],
      categoriaId: [null, [Validators.required]],
      marcaId: [null],
      proveedorId: [null],
      unidad: ['UNIDAD', [Validators.required, Validators.maxLength(20)]],
      peso: [null, [Validators.min(0)]],
      largo: [null, [Validators.min(0)]],
      ancho: [null, [Validators.min(0)]],
      alto: [null, [Validators.min(0)]],
      afectoIgv: [true],
      tipoIgv: ['GRAVADO'],
      ubicacion: ['', [Validators.maxLength(50)]],
      lote: ['', [Validators.maxLength(50)]],
      fechaVencimiento: [null],
      tags: [[]],
      imagen: ['', [Validators.maxLength(255)]],
      imagenes: [[]],
      observaciones: [''],
      estado: ['ACTIVO']
    });
  }

  private loadDropdownOptions(): void {
    // Cargar categorías
    this.categoriaService.listar().subscribe({
      next: (response) => {
        this.categoriaOptions = response.data.content.map((cat: any) => ({
          label: cat.nombre,
          value: cat.id
        }));
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
      }
    });

    // Cargar marcas
    this.marcaService.listar().subscribe({
      next: (response) => {
        this.marcaOptions = response.data.content.map((marca: any) => ({
          label: marca.nombre,
          value: marca.id
        }));
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
      }
    });

    // Cargar proveedores
    this.proveedorService.listar().subscribe({
      next: (response) => {
        this.proveedorOptions = response.data.content.map((prov: any) => ({
          label: prov.nombre,
          value: prov.id
        }));
      },
      error: (error) => {
        this.messageService.handleHttpError(error);
      }
    });
  }

  private checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.productoId = +params['id'];
        this.loadProducto();
      }
    });
  }

  private loadProducto(): void {
    if (!this.productoId) return;

    this.loading = true;
    this.productoService.buscarPorId(this.productoId).subscribe({
      next: (response) => {
        const producto = response.data;
        this.productoForm.patchValue({
          codigo: producto.codigo,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          precioCompra: producto.precioCompra,
          stock: producto.stock,
          stockMinimo: producto.stockMinimo,
          stockMaximo: producto.stockMaximo,
          codigoBarras: producto.codigoBarras,
          categoriaId: producto.categoria.id,
          marcaId: producto.marca?.id,
          proveedorId: producto.proveedor?.id,
          unidad: producto.unidad || 'UNIDAD',
          peso: producto.peso,
          largo: producto.largo,
          ancho: producto.ancho,
          alto: producto.alto,
          afectoIgv: producto.afectoIgv ?? true,
          tipoIgv: producto.tipoIgv || 'GRAVADO',
          ubicacion: producto.ubicacion,
          lote: producto.lote,
          fechaVencimiento: producto.fechaVencimiento,
          tags: producto.tags || [],
          imagen: producto.imagen,
          imagenes: producto.imagenes || [],
          observaciones: producto.observaciones,
          estado: producto.estado || 'ACTIVO'
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
    if (this.productoForm.valid) {
      this.loading = true;
      const productoData: ProductoRequest = this.productoForm.value;

      if (this.isEdit && this.productoId) {
        this.productoService.actualizar(this.productoId, productoData).subscribe({
          next: (response) => {
            this.messageService.success('Producto actualizado exitosamente', 'Actualización Exitosa');
            this.router.navigate(['/catalogo/productos']);
          },
          error: (error) => {
            this.messageService.handleHttpError(error);
            this.loading = false;
          }
        });
      } else {
        this.productoService.crear(productoData).subscribe({
          next: (response) => {
            this.messageService.success('Producto creado exitosamente', 'Creación Exitosa');
            this.router.navigate(['/catalogo/productos']);
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
    this.router.navigate(['/catalogo/productos']);
  }

  // Getters para validación de formulario
  get codigo() { return this.productoForm.get('codigo'); }
  get nombre() { return this.productoForm.get('nombre'); }
  get descripcion() { return this.productoForm.get('descripcion'); }
  get precio() { return this.productoForm.get('precio'); }
  get precioCompra() { return this.productoForm.get('precioCompra'); }
  get stock() { return this.productoForm.get('stock'); }
  get stockMinimo() { return this.productoForm.get('stockMinimo'); }
  get stockMaximo() { return this.productoForm.get('stockMaximo'); }
  get codigoBarras() { return this.productoForm.get('codigoBarras'); }
  get categoriaId() { return this.productoForm.get('categoriaId'); }
  get marcaId() { return this.productoForm.get('marcaId'); }
  get proveedorId() { return this.productoForm.get('proveedorId'); }
  get imagenUrl() { return this.productoForm.get('imagenUrl'); }
}
