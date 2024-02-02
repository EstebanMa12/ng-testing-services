import { ResolveFn } from '@angular/router';

export const mapsResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
