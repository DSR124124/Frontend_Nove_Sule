import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, ProductoStockBajo } from '../../models/producto.model';

@Component({
  selector: 'app-producto-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-stock.component.html',
  styleUrl: './producto-stock.component.css'
})
export class ProductoStockComponent {
  @Input() productos: Producto[] = [];
  @Input() productosStockBajo: ProductoStockBajo[] = [];
  @Input() loading = false;
  @Output() updateStockEvent = new EventEmitter<{id: number, nuevoStock: number}>();
  @Output() refreshEvent = new EventEmitter<void>();

  stockUpdate: { [key: number]: number } = {};

  onStockChange(productoId: number, nuevoStock: number): void {
    this.stockUpdate[productoId] = nuevoStock;
  }

  onUpdateStock(productoId: number): void {
    const nuevoStock = this.stockUpdate[productoId];
    if (nuevoStock !== undefined && nuevoStock >= 0) {
      this.updateStockEvent.emit({ id: productoId, nuevoStock });
      delete this.stockUpdate[productoId];
    }
  }

  onRefresh(): void {
    this.refreshEvent.emit();
  }

  getStockStatus(stock: number, stockMinimo: number): string {
    if (stock === 0) return 'sin-stock';
    if (stock <= stockMinimo) return 'stock-bajo';
    return 'stock-normal';
  }

  getStockStatusText(stock: number, stockMinimo: number): string {
    if (stock === 0) return 'Sin Stock';
    if (stock <= stockMinimo) return 'Stock Bajo';
    return 'Stock Normal';
  }
}
