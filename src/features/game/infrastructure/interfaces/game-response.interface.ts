import { questionResponse } from './question-response.interface';

export interface gameResponse {
  _id: string;
  status: string;
  player1: playerResponse;
  player2: playerResponse;
  currentQuestion?: questionResponse;
  timer: number;
  incrementBy: number;
}

export interface playerResponse {
  name: string;
  score: number;
}
