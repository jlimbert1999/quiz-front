import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { gameResponse, questionResponse } from '../../infrastructure';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private readonly url = `${environment.base_url}/match`;
  private http = inject(HttpClient);
  private _currentMatch = signal<gameResponse | null>(null);
  currentMatch = computed(() => this._currentMatch());

  constructor() {}

  checkCurrentMatch(): Observable<boolean> {
    const matchId = localStorage.getItem('match');
    if (!matchId) return of(false);
    return this.http.get<gameResponse>(`${this.url}/check/${matchId}`).pipe(
      map((resp) => this._setGame(resp)),
      catchError(() => of(false))
    );
  }

  getNextQuestion(gameId: string, group: string) {
    return this.http.get<questionResponse>(
      `${this.url}/next/${gameId}/${group}`
    );
  }

  private _setGame(game: gameResponse): boolean {
    localStorage.setItem('match', game._id);
    this._currentMatch.set(game);
    return true;
  }
}
