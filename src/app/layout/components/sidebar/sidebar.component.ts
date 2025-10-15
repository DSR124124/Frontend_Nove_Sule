import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SidebarService, MenuItem } from '../../services/sidebar.service';
import { SidebarItemComponent } from '../sidebar-item/sidebar-item.component';

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
  menuItems: MenuItem[] = [];

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    // Subscribe to sidebar collapse state
    this.sidebarService.sidebarCollapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(collapsed => {
        this.isCollapsed = collapsed;
      });

    // Subscribe to menu items
    this.sidebarService.menuItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.menuItems = items;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onItemClick(item: MenuItem): void {
    this.sidebarService.updateMenuItemActive(item.id);
  }

  onToggleExpanded(itemId: string): void {
    this.sidebarService.toggleMenuItemExpanded(itemId);
  }
}
