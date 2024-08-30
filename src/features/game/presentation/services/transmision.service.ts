import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

import { environment } from '../../../../environments/environment';
import { questionResponse } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class TransmisionService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.base_url, {
      auth: { chanel: localStorage.getItem('match') },
    });
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

  showQuestionOptions(gameId: string) {
    this.socket.emit('show-options', gameId);
  }

  listenDisplayOptions(): Observable<void> {
    return new Observable((observable) => {
      this.socket.on('display-options', () => {
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

  listenScore1() {
    return new Observable<number>((observable) => {
      this.socket.on('score1', (value: number) => {
        observable.next(value);
      });
    });
  }

  listenScore2() {
    return new Observable<number>((observable) => {
      this.socket.on('score2', (value: number) => {
        observable.next(value);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }
  }
}
