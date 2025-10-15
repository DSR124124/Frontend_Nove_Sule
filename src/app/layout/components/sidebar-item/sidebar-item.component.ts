import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SidebarItem, SidebarSubItem } from '../../models/sidebar-item.model';

@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.css'
})
export class SidebarItemComponent implements OnInit, OnDestroy {
  @Input() item!: SidebarItem;
  @Input() isCollapsed: boolean = false;
  @Input() level: number = 0;
  @Output() itemClick = new EventEmitter<SidebarItem>();
  @Output() toggleExpanded = new EventEmitter<string>();

  expanded = false;
  private destroy$ = new Subject<void>();

  constructor(public router: Router) {
    // Suscribirse a los eventos de navegación para actualizar el estado activo
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateActiveState();
      });
  }

  ngOnInit() {
    this.updateActiveState();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isActive(): boolean {
    if (!this.item.routerLink) return false;
    const currentUrl = this.router.url;
    const itemRoute = this.item.routerLink;

    // Si es la ruta exacta, está activo
    if (currentUrl === itemRoute) return true;

    // Para items padre con subitems, nunca están activos por sí mismos
    if (this.hasChildren()) return false;

    return false;
  }

  hasChildren(): boolean {
    return !!(this.item.items && this.item.items.length > 0);
  }

  isSubmenuActive(): boolean {
    if (!this.hasChildren()) return false;

    // Verificar si algún subitem está activo
    const hasActiveSubItem = this.item.items!.some(child => this.isSubItemActive(child));

    // Si hay un subitem activo, expandir automáticamente
    if (hasActiveSubItem && !this.expanded) {
      this.expanded = true;
    }

    return hasActiveSubItem;
  }

  toggleSubmenu(): void {
    if (this.hasChildren()) {
      this.expanded = !this.expanded;
      this.toggleExpanded.emit(this.item.label);
    }
  }

  navigateTo(route: string): void {
    if (!route) return;

    const routeArray = route.split('/').filter(segment => segment.length > 0);
    this.router.navigate(routeArray);
  }

  onItemClick(item: SidebarItem): void {
    if (this.hasChildren()) {
      // Si tiene hijos, expandir/contraer el submenú
      this.toggleSubmenu();
    } else if (item.routerLink) {
      // Si no tiene hijos y tiene routerLink, navegar
      this.navigateTo(item.routerLink);
    } else {
      // Emitir evento para manejo personalizado
      this.itemClick.emit(item);
    }
  }

  onChildClick(child: SidebarSubItem): void {
    if (child.routerLink) {
      this.navigateTo(child.routerLink);
    }
  }



  private updateActiveState(): void {
    this.isSubmenuActive();
  }

  getItemClass(): string {
    let classes = 'sidebar-item';

    if (this.isCollapsed) {
      classes += ' collapsed';
    }

    if (this.isActive()) {
      classes += ' active';
    }

    if (this.hasChildren()) {
      classes += ' has-children';
    }

    if (this.isSubmenuActive()) {
      classes += ' submenu-active';
    }

    return classes;
  }

  getSubmenuClass(): string {
    let classes = 'item-children';

    if (this.expanded) {
      classes += ' expanded';
    }

    return classes;
  }

  isSubItemActive(subItem: SidebarSubItem): boolean {
    if (!subItem.routerLink) return false;
    const currentUrl = this.router.url;
    const subItemRoute = subItem.routerLink;

    if (currentUrl === subItemRoute) return true;
    if (currentUrl.startsWith(subItemRoute + '/')) return true;

    return false;
  }

}
