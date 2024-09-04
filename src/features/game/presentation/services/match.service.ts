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

  create(form: Object) {
    return this.http.post<gameResponse>(this.url, form);
  }

  getPendings() {
    return this.http.get<gameResponse[]>(this.url);
  }

  checkCurrentMatch(): Observable<boolean> {
    const matchId = localStorage.getItem('match');
    if (!matchId) return of(false);
    return this.http.get<gameResponse>(`${this.url}/check/${matchId}`).pipe(
      map((resp) => this._setGame(resp)),
      catchError(() => of(false))
    );
  }

  updateScore(
    gameId: string,
    player: 'player1' | 'player2',
    operation: 'add' | 'remove'
  ) {
    return this.http.post<{ score: number }>(`${this.url}/score/${gameId}`, {
      player,
      operation,
    });
  }

  updateMatch(
    gameId: string,
    player: 'player1' | 'player2',
    operation: 'add' | 'remove'
  ) {
    return this.http.post<{ score: number }>(`${this.url}/score/${gameId}`, {
      player,
      operation,
    });
  }

  score1(gameId: string, value: number) {
    return this.http.post<{ score: number }>(`${this.url}/score1/${gameId}`, {
      score: value,
    });
  }

  score2(gameId: string, value: number) {
    return this.http.post<{ score: number }>(`${this.url}/score2/${gameId}`, {
      score: value,
    });
  }

  getNextQuestion(gameId: string, group: string) {
    return this.http.get<questionResponse>(
      `${this.url}/next/${gameId}/${group}`
    );
  }

  answerQuestion(gameId: string, selectedIndex: number) {
    return this.http.post<{ message: string }>(`${this.url}/answer`, {
      gameId: gameId,
      selectedIndex: selectedIndex,
    });
  }

  private _setGame(game: gameResponse): boolean {
    localStorage.setItem('match', game._id);
    this._currentMatch.set(game);
    return true;
  }
}
