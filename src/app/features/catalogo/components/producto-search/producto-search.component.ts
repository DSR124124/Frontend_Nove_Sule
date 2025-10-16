import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoBusqueda } from '../../models/producto.model';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-producto-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule
  ],
  templateUrl: './producto-search.component.html',
  styleUrl: './producto-search.component.css'
})
export class ProductoSearchComponent {
  @Input() categoriaOptions: any[] = [];
  @Input() marcaOptions: any[] = [];
  @Input() proveedorOptions: any[] = [];
  @Output() searchEvent = new EventEmitter<ProductoBusqueda>();
  @Output() clearEvent = new EventEmitter<void>();

  busqueda: ProductoBusqueda = {
    texto: '',
    precioMin: undefined,
    precioMax: undefined,
    categoriaId: undefined,
    marcaId: undefined,
    proveedorId: undefined
  };

  onSearch(): void {
    this.searchEvent.emit(this.busqueda);
  }

  onClear(): void {
    this.busqueda = {
      texto: '',
      precioMin: undefined,
      precioMax: undefined,
      categoriaId: undefined,
      marcaId: undefined,
      proveedorId: undefined
    };
    this.clearEvent.emit();
  }
}
