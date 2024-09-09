import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { MatchService } from '../services/match.service';
import { tap } from 'rxjs';

export const matchGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(MatchService)
    .checkCurrentMatch()
    .pipe(
      tap((isConfig) => {
        if (!isConfig) {
          router.navigateByUrl('start');
        }
      })
    );
};
