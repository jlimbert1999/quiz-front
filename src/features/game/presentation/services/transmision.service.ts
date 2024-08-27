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

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }
  }
}
