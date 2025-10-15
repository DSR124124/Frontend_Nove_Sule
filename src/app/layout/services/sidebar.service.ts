import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  routerLink?: string;
  children?: MenuItem[];
  badge?: string;
  badgeClass?: string;
  isActive?: boolean;
  isExpanded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
  public sidebarCollapsed$ = this.sidebarCollapsedSubject.asObservable();

  private menuItemsSubject = new BehaviorSubject<MenuItem[]>(this.getMenuItems());
  public menuItems$ = this.menuItemsSubject.asObservable();

  constructor() { }

  toggleSidebar(): void {
    this.sidebarCollapsedSubject.next(!this.sidebarCollapsedSubject.value);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsedSubject.next(collapsed);
  }

  getMenuItems(): MenuItem[] {
    return [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
        isActive: true
      },
      {
        id: 'catalogo',
        label: 'Catálogo',
        icon: 'pi pi-box',
        children: [
          {
            id: 'productos',
            label: 'Productos',
            icon: 'pi pi-shopping-bag',
            routerLink: '/catalogo/productos'
          },
          {
            id: 'categorias',
            label: 'Categorías',
            icon: 'pi pi-tags',
            routerLink: '/catalogo/categorias'
          },
          {
            id: 'proveedores',
            label: 'Proveedores',
            icon: 'pi pi-truck',
            routerLink: '/catalogo/proveedores'
          }
        ]
      },
      {
        id: 'inventario',
        label: 'Inventario',
        icon: 'pi pi-warehouse',
        children: [
          {
            id: 'stock',
            label: 'Stock',
            icon: 'pi pi-box',
            routerLink: '/inventario/stock'
          },
          {
            id: 'ajustes',
            label: 'Ajustes',
            icon: 'pi pi-cog',
            routerLink: '/inventario/ajustes'
          },
          {
            id: 'traslados',
            label: 'Traslados',
            icon: 'pi pi-arrows-h',
            routerLink: '/inventario/traslados'
          },
          {
            id: 'kardex',
            label: 'Kardex',
            icon: 'pi pi-chart-line',
            routerLink: '/inventario/kardex'
          }
        ]
      },
      {
        id: 'ventas',
        label: 'Ventas',
        icon: 'pi pi-shopping-cart',
        children: [
          {
            id: 'pos',
            label: 'Punto de Venta',
            icon: 'pi pi-credit-card',
            routerLink: '/ventas/pos'
          },
          {
            id: 'comprobantes',
            label: 'Comprobantes',
            icon: 'pi pi-file',
            routerLink: '/ventas/comprobantes'
          },
          {
            id: 'carrito',
            label: 'Carrito',
            icon: 'pi pi-shopping-cart',
            routerLink: '/ventas/carrito'
          }
        ]
      },
      {
        id: 'compras',
        label: 'Compras',
        icon: 'pi pi-shopping-bag',
        children: [
          {
            id: 'ordenes-compra',
            label: 'Órdenes de Compra',
            icon: 'pi pi-file-edit',
            routerLink: '/compras/ordenes'
          },
          {
            id: 'facturas-compra',
            label: 'Facturas de Compra',
            icon: 'pi pi-file',
            routerLink: '/compras/facturas'
          },
          {
            id: 'recepcion',
            label: 'Recepción',
            icon: 'pi pi-check-circle',
            routerLink: '/compras/recepcion'
          }
        ]
      },
      {
        id: 'contabilidad',
        label: 'Contabilidad',
        icon: 'pi pi-calculator',
        children: [
          {
            id: 'asientos',
            label: 'Asientos Contables',
            icon: 'pi pi-book',
            routerLink: '/contabilidad/asientos'
          },
          {
            id: 'plan-cuentas',
            label: 'Plan de Cuentas',
            icon: 'pi pi-list',
            routerLink: '/contabilidad/plan-cuentas'
          },
          {
            id: 'caja-diaria',
            label: 'Caja Diaria',
            icon: 'pi pi-money-bill',
            routerLink: '/contabilidad/caja-diaria'
          },
          {
            id: 'conciliacion',
            label: 'Conciliación Bancaria',
            icon: 'pi pi-bank',
            routerLink: '/contabilidad/conciliacion'
          }
        ]
      },
      {
        id: 'reportes',
        label: 'Reportes',
        icon: 'pi pi-chart-bar',
        children: [
          {
            id: 'ventas-dia',
            label: 'Ventas por Día',
            icon: 'pi pi-calendar',
            routerLink: '/reportes/ventas-dia'
          },
          {
            id: 'flujo-caja',
            label: 'Flujo de Caja',
            icon: 'pi pi-chart-line',
            routerLink: '/reportes/flujo-caja'
          },
          {
            id: 'margen-producto',
            label: 'Margen por Producto',
            icon: 'pi pi-percentage',
            routerLink: '/reportes/margen-producto'
          },
          {
            id: 'rotacion-inventario',
            label: 'Rotación de Inventario',
            icon: 'pi pi-refresh',
            routerLink: '/reportes/rotacion-inventario'
          }
        ]
      },
      {
        id: 'usuarios',
        label: 'Usuarios',
        icon: 'pi pi-users',
        children: [
          {
            id: 'gestion-usuarios',
            label: 'Gestión de Usuarios',
            icon: 'pi pi-user-edit',
            routerLink: '/usuarios/gestion'
          }
        ]
      }
    ];
  }

  updateMenuItemActive(menuId: string): void {
    const menuItems = this.menuItemsSubject.value;
    this.updateMenuItemsActive(menuItems, menuId);
    this.menuItemsSubject.next([...menuItems]);
  }

  private updateMenuItemsActive(menuItems: MenuItem[], activeId: string): void {
    menuItems.forEach(item => {
      item.isActive = item.id === activeId;
      if (item.children) {
        this.updateMenuItemsActive(item.children, activeId);
      }
    });
  }

  toggleMenuItemExpanded(menuId: string): void {
    const menuItems = this.menuItemsSubject.value;
    this.toggleMenuItemsExpanded(menuItems, menuId);
    this.menuItemsSubject.next([...menuItems]);
  }

  private toggleMenuItemsExpanded(menuItems: MenuItem[], menuId: string): void {
    menuItems.forEach(item => {
      if (item.id === menuId) {
        item.isExpanded = !item.isExpanded;
      }
      if (item.children) {
        this.toggleMenuItemsExpanded(item.children, menuId);
      }
    });
  }
}
