import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { MatchService } from '../services/match.service';
import { tap } from 'rxjs';

export const gameGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(MatchService)
    .checkCurrentMatch()
    .pipe(
      tap((isSelect) => {
        if (!isSelect) {
          localStorage.removeItem('token');
          router.navigateByUrl('menu');
        }
      })
    );
};
