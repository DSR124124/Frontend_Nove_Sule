import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoBusqueda } from '../../models/producto.model';

@Component({
  selector: 'app-producto-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-search.component.html',
  styleUrl: './producto-search.component.css'
})
export class ProductoSearchComponent {
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
