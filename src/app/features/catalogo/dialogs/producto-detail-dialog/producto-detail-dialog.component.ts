import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-detail-dialog',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, DialogModule, TagModule],
  templateUrl: './producto-detail-dialog.component.html',
  styleUrl: './producto-detail-dialog.component.css'
})
export class ProductoDetailDialogComponent {
  @Input() visible = false;
  @Input() producto: Producto | null = null;
  @Input() loading = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<Producto>();

  onHide(): void {
    this.visibleChange.emit(false);
  }

  onEdit(): void {
    if (this.producto) {
      this.edit.emit(this.producto);
    }
  }

  getEstadoStyleClass(estado: string): string {
    switch (estado) {
      case 'ACTIVO': return 'p-tag tag-success tag-sm';
      case 'INACTIVO': return 'p-tag tag-warning tag-sm';
      case 'ELIMINADO': return 'p-tag tag-danger tag-sm';
      default: return 'p-tag tag-gray tag-sm';
    }
  }

  getStockTextClass(stock: number, stockMinimo: number): string {
    if (stock === 0) return 'text-error';
    if (stock <= stockMinimo) return 'text-warning';
    return 'text-success';
  }
}
