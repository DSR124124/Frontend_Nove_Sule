import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SidebarItemComponent } from '../sidebar-item/sidebar-item.component';
import { SidebarItem } from '../../models/sidebar-item.model';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isCollapsed = false;
  menuItems: SidebarItem[] = [];

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    // Subscribe to sidebar collapse state
    this.sidebarService.sidebarCollapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(collapsed => {
        this.isCollapsed = collapsed;
      });

    // Subscribe to menu items
    this.sidebarService.getMenuItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.menuItems = items;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onItemClick(item: SidebarItem): void {
    // El estado activo se maneja automáticamente por el router
  }

  onToggleExpanded(itemId: string): void {
    // Se maneja en el sidebar-item component
  }
}
