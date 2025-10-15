import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.generateBreadcrumbs(event.url);
      });

    // Generate initial breadcrumbs
    this.generateBreadcrumbs(this.router.url);
  }

  private generateBreadcrumbs(url: string): void {
    this.breadcrumbs = [];

    // Always start with Dashboard
    this.breadcrumbs.push({
      label: 'Dashboard',
      url: '/dashboard',
      icon: 'pi pi-home'
    });

    // Parse URL segments
    const segments = url.split('/').filter(segment => segment);

    if (segments.length === 0) {
      return;
    }

    // Remove 'dashboard' if it's the first segment
    if (segments[0] === 'dashboard') {
      segments.shift();
    }

    // Generate breadcrumbs for each segment
    let currentPath = '/dashboard';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      const breadcrumb: BreadcrumbItem = {
        label: this.formatLabel(segment),
        url: currentPath,
        icon: this.getIconForSegment(segment, index)
      };

      this.breadcrumbs.push(breadcrumb);
    });
  }

  private formatLabel(segment: string): string {
    // Convert kebab-case to Title Case
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getIconForSegment(segment: string, index: number): string {
    const iconMap: { [key: string]: string } = {
      'catalogo': 'pi pi-box',
      'productos': 'pi pi-shopping-bag',
      'categorias': 'pi pi-tags',
      'proveedores': 'pi pi-truck',
      'inventario': 'pi pi-warehouse',
      'stock': 'pi pi-box',
      'ajustes': 'pi pi-cog',
      'traslados': 'pi pi-arrows-h',
      'kardex': 'pi pi-chart-line',
      'ventas': 'pi pi-shopping-cart',
      'pos': 'pi pi-credit-card',
      'comprobantes': 'pi pi-file',
      'carrito': 'pi pi-shopping-cart',
      'compras': 'pi pi-shopping-bag',
      'ordenes': 'pi pi-file-edit',
      'facturas': 'pi pi-file',
      'recepcion': 'pi pi-check-circle',
      'contabilidad': 'pi pi-calculator',
      'asientos': 'pi pi-book',
      'plan-cuentas': 'pi pi-list',
      'caja-diaria': 'pi pi-money-bill',
      'conciliacion': 'pi pi-bank',
      'reportes': 'pi pi-chart-bar',
      'ventas-dia': 'pi pi-calendar',
      'flujo-caja': 'pi pi-chart-line',
      'margen-producto': 'pi pi-percentage',
      'rotacion-inventario': 'pi pi-refresh',
      'usuarios': 'pi pi-users',
      'gestion': 'pi pi-user-edit'
    };

    return iconMap[segment] || 'pi pi-circle-fill';
  }
}
