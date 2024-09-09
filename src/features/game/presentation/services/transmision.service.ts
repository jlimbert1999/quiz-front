import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

import { environment } from '../../../../environments/environment';
import { questionResponse } from '../../infrastructure';

interface scoreProps {
  score: number;
  player: 'player1' | 'player2';
}
@Injectable({
  providedIn: 'root',
})
export class TransmisionService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.base_url);
  }

  listenNextQuestion(): Observable<questionResponse> {
    return new Observable((observable) => {
      this.socket.on('next-question', (question: questionResponse) => {
        observable.next(question);
      });
    });
  }

  listenAnswerQuestion(): Observable<number> {
    return new Observable((observable) => {
      this.socket.on('answer-question', (index: number) => {
        observable.next(index);
      });
    });
  }

  listenDisplayOptions(): Observable<void> {
    return new Observable((observable) => {
      this.socket.on('show-options', () => {
        observable.next();
      });
    });
  }

  showwinner(gameId: string) {
    this.socket.emit('winner', gameId);
  }

  listenWinner(): Observable<void> {
    return new Observable((observable) => {
      this.socket.on('show-winner', () => {
        observable.next();
      });
    });
  }

  listenScore() {
    return new Observable<scoreProps>((observable) => {
      this.socket.on('score', (data: scoreProps) => {
        observable.next(data);
      });
    });
  }

  listenNewMatch() {
    return new Observable((observable) => {
      this.socket.on('new-match', () => {
        observable.next();
      });
    });
  }

  listenSettings() {
    return new Observable<{ incrementBy: number; timer: number }>(
      (observable) => {
        this.socket.on('match-settings', (data) => {
          observable.next(data);
        });
      }
    );
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }
  }
}
