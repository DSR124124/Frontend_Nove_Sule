/**
 * Constantes para endpoints de la API
 */

// Base URL de la API del backend
export const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Endpoints de autenticación
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  VALIDATE: '/auth/validate'
} as const;

/**
 * Endpoints de usuarios
 */
export const USER_ENDPOINTS = {
  BASE: '/usuarios',
  CREATE: '/usuarios',
  UPDATE: (id: number) => `/usuarios/${id}`,
  DELETE: (id: number) => `/usuarios/${id}`,
  GET_BY_ID: (id: number) => `/usuarios/${id}`,
  GET_ALL: '/usuarios',
  SEARCH: '/usuarios/buscar'
} as const;

/**
 * Endpoints de catálogo
 */
export const CATALOG_ENDPOINTS = {
  // Categorías
  CATEGORIAS: '/categorias',
  CATEGORIAS_ACTIVAS: '/categorias/activas',
  CATEGORIA_BY_ID: (id: number) => `/categorias/${id}`,

  // Productos
  PRODUCTOS: '/productos',
  PRODUCTO_BY_ID: (id: number) => `/productos/${id}`,
  PRODUCTOS_ACTIVOS: '/productos/activos',
  PRODUCTOS_SEARCH: '/productos/buscar',

  // Marcas
  MARCAS: '/marcas',
  MARCAS_ACTIVAS: '/marcas/activas',
  MARCA_BY_ID: (id: number) => `/marcas/${id}`,

  // Proveedores
  PROVEEDORES: '/proveedores',
  PROVEEDORES_ACTIVOS: '/proveedores/activos',
  PROVEEDOR_BY_ID: (id: number) => `/proveedores/${id}`
} as const;

/**
 * Endpoints de ventas
 */
export const SALES_ENDPOINTS = {
  BASE: '/ventas',
  CREATE: '/ventas',
  GET_BY_ID: (id: number) => `/ventas/${id}`,
  GET_ALL: '/ventas',
  SEARCH: '/ventas/buscar',
  ANULAR: (id: number) => `/ventas/${id}/anular`
} as const;

/**
 * Endpoints de compras
 */
export const PURCHASE_ENDPOINTS = {
  BASE: '/compras',
  CREATE: '/compras',
  GET_BY_ID: (id: number) => `/compras/${id}`,
  GET_ALL: '/compras',
  SEARCH: '/compras/buscar',
  ANULAR: (id: number) => `/compras/${id}/anular`
} as const;

/**
 * Endpoints de inventario
 */
export const INVENTORY_ENDPOINTS = {
  BASE: '/inventario',
  MOVIMIENTOS: '/inventario/movimientos',
  AJUSTE: '/inventario/ajuste',
  KARDEX: (productoId: number) => `/inventario/kardex/${productoId}`,
  STOCK_MINIMO: '/inventario/stock-minimo'
} as const;

/**
 * Endpoints de reportes
 */
export const REPORT_ENDPOINTS = {
  BASE: '/reportes',
  VENTAS: '/reportes/ventas',
  COMPRAS: '/reportes/compras',
  INVENTARIO: '/reportes/inventario',
  FINANCIERO: '/reportes/financiero'
} as const;

/**
 * Endpoints de contabilidad
 */
export const ACCOUNTING_ENDPOINTS = {
  BASE: '/contabilidad',
  CUENTAS: '/contabilidad/cuentas',
  ASIENTOS: '/contabilidad/asientos',
  BALANCE: '/contabilidad/balance',
  ESTADO_RESULTADOS: '/contabilidad/estado-resultados'
} as const;

/**
 * Construye la URL completa para un endpoint
 * @param endpoint Endpoint relativo
 * @returns URL completa
 */
export function buildApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

/**
 * Headers estándar para las peticiones
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
} as const;
