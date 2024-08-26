import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { gameResponse } from '../../infrastructure';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private http = inject(HttpClient);

  private _currentGame = signal<gameResponse | null>(null);
  currentGame = computed(() => this._currentGame());

  constructor() {}

  checkCurrentMatch(): Observable<boolean> {
    const matchId = localStorage.getItem('match');
    if (!matchId) return of(false);
    return this.http
      .get<gameResponse>(`${environment.base_url}/game/current/${matchId}`)
      .pipe(
        map((resp) => this._setGame(resp)),
        catchError(() => of(false))
      );
  }

  private _setGame(game: gameResponse): boolean {
    console.log(game);
    localStorage.setItem('match', game._id);
    this._currentGame.set(game);
    return true;
  }
}
