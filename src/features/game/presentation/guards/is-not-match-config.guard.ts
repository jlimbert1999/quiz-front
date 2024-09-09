import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { map, tap } from 'rxjs';
import { MatchService } from '../services';

export const isNotMatchConfigGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(MatchService)
    .checkCurrentMatch()
    .pipe(
      tap((isConfig) => {
        if (isConfig) {
          router.navigateByUrl('/game/mode');
        }
      }),
      map((isConfig) => !isConfig)
    );
};
