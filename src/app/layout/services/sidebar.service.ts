import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { SidebarItem, SidebarSubItem } from '../models/sidebar-item.model';



@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
  public sidebarCollapsed$ = this.sidebarCollapsedSubject.asObservable();

  private menuItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Catálogo',
      icon: 'pi pi-box',
      items: [
        { label: 'Productos', icon: 'pi pi-shopping-bag', routerLink: '/catalogo/productos' },
        { label: 'Categorías', icon: 'pi pi-tags', routerLink: '/catalogo/categorias' },
        { label: 'Marcas', icon: 'pi pi-tag', routerLink: '/catalogo/marcas' },
        { label: 'Proveedores', icon: 'pi pi-truck', routerLink: '/catalogo/proveedores' }
      ]
    },
    {
      label: 'Inventario',
      icon: 'pi pi-warehouse',
      items: [
        { label: 'Stock', icon: 'pi pi-box', routerLink: '/inventario/stock' },
        { label: 'Ajustes', icon: 'pi pi-cog', routerLink: '/inventario/ajustes' },
        { label: 'Traslados', icon: 'pi pi-arrows-h', routerLink: '/inventario/traslados' },
        { label: 'Kardex', icon: 'pi pi-chart-line', routerLink: '/inventario/kardex' }
      ]
    },
    {
      label: 'Ventas',
      icon: 'pi pi-shopping-cart',
      items: [
        { label: 'Punto de Venta', icon: 'pi pi-credit-card', routerLink: '/ventas/pos' },
        { label: 'Comprobantes', icon: 'pi pi-file', routerLink: '/ventas/comprobantes' },
        { label: 'Carrito', icon: 'pi pi-shopping-cart', routerLink: '/ventas/carrito' }
      ]
    },
    {
      label: 'Compras',
      icon: 'pi pi-shopping-bag',
      items: [
        { label: 'Órdenes de Compra', icon: 'pi pi-file-edit', routerLink: '/compras/ordenes' },
        { label: 'Facturas de Compra', icon: 'pi pi-file', routerLink: '/compras/facturas' },
        { label: 'Recepción', icon: 'pi pi-check-circle', routerLink: '/compras/recepcion' }
      ]
    },
    {
      label: 'Contabilidad',
      icon: 'pi pi-calculator',
      items: [
        { label: 'Asientos Contables', icon: 'pi pi-book', routerLink: '/contabilidad/asientos' },
        { label: 'Plan de Cuentas', icon: 'pi pi-list', routerLink: '/contabilidad/plan-cuentas' },
        { label: 'Caja Diaria', icon: 'pi pi-money-bill', routerLink: '/contabilidad/caja-diaria' },
        { label: 'Conciliación Bancaria', icon: 'pi pi-bank', routerLink: '/contabilidad/conciliacion' }
      ]
    },
    {
      label: 'Reportes',
      icon: 'pi pi-chart-bar',
      items: [
        { label: 'Ventas por Día', icon: 'pi pi-calendar', routerLink: '/reportes/ventas-dia' },
        { label: 'Flujo de Caja', icon: 'pi pi-chart-line', routerLink: '/reportes/flujo-caja' },
        { label: 'Margen por Producto', icon: 'pi pi-percentage', routerLink: '/reportes/margen-producto' },
        { label: 'Rotación de Inventario', icon: 'pi pi-refresh', routerLink: '/reportes/rotacion-inventario' }
      ]
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      items: [
        { label: 'Gestión de Usuarios', icon: 'pi pi-user-edit', routerLink: '/usuarios/gestion' }
      ]
    }
  ];

  constructor() { }

  toggleSidebar(): void {
    this.sidebarCollapsedSubject.next(!this.sidebarCollapsedSubject.value);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsedSubject.next(collapsed);
  }

  /**
   * Obtiene todos los elementos del menú del sidebar
   */
  getMenuItems(): Observable<SidebarItem[]> {
    return of([...this.menuItems]);
  }

  /**
   * Obtiene un elemento específico del menú por su ruta
   */
  getMenuItemByRoute(route: string): SidebarItem | undefined {
    const normalizedRoute = route.startsWith('/') ? route : `/${route}`;

    return this.menuItems.find(item =>
      item.routerLink === normalizedRoute ||
      item.items?.some(subItem => subItem.routerLink === normalizedRoute)
    );
  }

  /**
   * Obtiene elementos del menú por categoría (con o sin submenús)
   */
  getMenuItemsByCategory(hasSubmenu: boolean): SidebarItem[] {
    return this.menuItems.filter(item =>
      hasSubmenu ? (item.items && item.items.length > 0) : (!item.items || item.items.length === 0)
    );
  }

  /**
   * Busca elementos del menú por texto
   */
  searchMenuItems(searchTerm: string): SidebarItem[] {
    const term = searchTerm.toLowerCase();
    return this.menuItems.filter(item =>
      item.label.toLowerCase().includes(term) ||
      item.items?.some(subItem => subItem.label.toLowerCase().includes(term))
    );
  }

  /**
   * Agrega un nuevo elemento al menú
   */
  addMenuItem(menuItem: SidebarItem): void {
    this.menuItems.push(menuItem);
  }

  /**
   * Actualiza un elemento existente del menú
   */
  updateMenuItem(route: string, updatedItem: SidebarItem): void {
    const index = this.menuItems.findIndex(item => item.routerLink === route);
    if (index !== -1) {
      this.menuItems[index] = updatedItem;
    }
  }

  /**
   * Elimina un elemento del menú
   */
  removeMenuItem(route: string): void {
    const index = this.menuItems.findIndex(item => item.routerLink === route);
    if (index !== -1) {
      this.menuItems.splice(index, 1);
    }
  }

  /**
   * Obtiene elementos del menú con badges
   */
  getMenuItemsWithBadges(): SidebarItem[] {
    return this.menuItems.filter(item => item.badge);
  }

  /**
   * Actualiza el badge de un elemento del menú
   */
  updateMenuItemBadge(route: string, badge: string): void {
    const item = this.menuItems.find(item => item.routerLink === route);
    if (item) {
      item.badge = badge;
    }
  }
}
