import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.css'
})
export class SidebarItemComponent {
  @Input() item!: MenuItem;
  @Input() isCollapsed: boolean = false;
  @Input() level: number = 0;
  @Output() itemClick = new EventEmitter<MenuItem>();
  @Output() toggleExpanded = new EventEmitter<string>();

  onItemClick(item: MenuItem): void {
    this.itemClick.emit(item);
  }

  onToggleExpanded(event: Event, itemId: string): void {
    event.stopPropagation();
    this.toggleExpanded.emit(itemId);
  }

  onChildToggleExpanded(itemId: string): void {
    this.toggleExpanded.emit(itemId);
  }

  hasChildren(): boolean {
    return !!(this.item.children && this.item.children.length > 0);
  }

  getIndentClass(): string {
    return `level-${this.level}`;
  }
}
