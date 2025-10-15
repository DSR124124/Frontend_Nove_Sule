export interface SidebarItem {
  label: string;
  icon: string;
  routerLink?: string;
  items?: SidebarSubItem[];
  badge?: string;
}

export interface SidebarSubItem {
  label: string;
  icon: string;
  routerLink: string;
}
