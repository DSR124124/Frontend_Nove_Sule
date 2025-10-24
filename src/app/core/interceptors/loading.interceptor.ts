import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../../shared/services/loading.service';

/**
 * Interceptor que maneja automáticamente el estado de loading
 * para todas las peticiones HTTP
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // URLs que deben ser excluidas del loading automático
  const excludedUrls = [
    '/health',
    '/ping',
    '/status'
  ];

  // Verificar si la URL debe ser excluida
  const shouldExclude = excludedUrls.some(url => req.url.includes(url));

  // Si la petición tiene el header 'X-Skip-Loading', no mostrar loading
  const skipLoading = req.headers.has('X-Skip-Loading');

  if (shouldExclude || skipLoading) {
    return next(req);
  }

  // Generar ID único para esta petición
  const requestId = `http-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Determinar el tipo de loading basado en el método HTTP
  let loadingOptions: {
    id: string;
    size: 'small' | 'medium' | 'large';
    message: string;
    overlay?: boolean;
  } = {
    id: requestId,
    size: 'small',
    message: getLoadingMessage(req.method)
  };

  // Para operaciones importantes, usar loading más prominente
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    loadingOptions = {
      ...loadingOptions,
      size: 'medium',
      overlay: true
    };
  }

  // Mostrar loading
  loadingService.show(loadingOptions);

  // Procesar la petición y ocultar loading al finalizar
  return next(req).pipe(
    finalize(() => {
      loadingService.hide(requestId);
    })
  );
};

/**
 * Obtiene el mensaje de loading apropiado según el método HTTP
 */
function getLoadingMessage(method: string): string {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'Cargando datos...';
    case 'POST':
      return 'Guardando información...';
    case 'PUT':
    case 'PATCH':
      return 'Actualizando datos...';
    case 'DELETE':
      return 'Eliminando registro...';
    default:
      return 'Procesando solicitud...';
  }
}
