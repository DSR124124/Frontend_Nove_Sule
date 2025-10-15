import { HttpInterceptorFn } from '@angular/common/http';

export const uthInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
