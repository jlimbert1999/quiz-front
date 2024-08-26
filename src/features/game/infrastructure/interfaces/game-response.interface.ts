import { questionResponse } from './question-response.interface';

export interface gameResponse {
  _id: string;
  player1: playerResponse;
  player2: playerResponse;
  currentQuestion?: questionResponse;
  status: string;
}

export interface playerResponse {
  name: string;
  score: number;
}
