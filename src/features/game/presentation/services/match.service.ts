import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { gameResponse, questionResponse } from '../../infrastructure';
import { environment } from '../../../../environments/environment';

interface updateMatchSettingsProps {
  status?: string;
  incrementBy?: number;
  timer?: number;
}
@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private readonly url = `${environment.base_url}/match`;
  private http = inject(HttpClient);
  private _currentMatch = signal<gameResponse | null>(null);
  currentMatch = computed(() => this._currentMatch());
  private audio: HTMLAudioElement | null = null;

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

  updateSettings(gameId: string, settings: updateMatchSettingsProps) {
    return this.http.patch<gameResponse>(
      `${this.url}/settings/${gameId}`,
      settings
    );
  }

  getNextQuestion(gameId: string, group: string) {
    return this.http.get<questionResponse>(
      `${this.url}/next/${gameId}/${group}`
    );
  }

  restartQuestions() {
    return this.http.get<{ message: string }>(`${this.url}/restart`);
  }

  showQuestionOptions(gameId: string) {
    return this.http.get<{ status: string }>(`${this.url}/show/${gameId}`);
  }

  playAudio(type: 'answer' | 'error' | 'clock', loop = false): void {
    if (!this.audio) {
      this.audio = new Audio(`../../../../assets/${type}.mp3`);
      if (loop) {
        this.audio.loop = true; // Activar el bucle
      }
      this.audio.play();
    }
  }

  stopAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0; // Reinicia el audio al inicio
      this.audio = null; // Liberar el recurso de audio
    }
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
