import { CanActivateFn } from '@angular/router';

export const cashierGuard: CanActivateFn = (route, state) => {
  return true;
};
