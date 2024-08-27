import { gameResponse } from '../../infrastructure';

interface matchProps {
  id: string;
  status: string;
  player1: player;
  player2: player;
  currentQuestion?: question;
}

interface question {
  id: string;
  text: string;
  group: string;
  imageUrl?: string;
  options: optionQuestion[];
}

interface player {
  name: string;
  score: number;
}

interface optionQuestion {
  text: string;
  imageUrl?: string;
  isCorrect: boolean;
  isSelected: boolean;
}

export class MatchModel {
  id: string;
  status: string;
  player1: player;
  player2: player;
  currentQuestion?: question;

  static fromResponse(response: gameResponse) {
    return new MatchModel({
      id: response._id,
      player1: response.player1,
      player2: response.player2,
      status: response.status,
      ...(response.currentQuestion && {
        ...response.currentQuestion,
        options: response.currentQuestion.options.map((el) => ({
          ...el,
          isSelected: false,
        })),
      }),
    });
  }

  constructor({ id, status, player1, player2, currentQuestion }: matchProps) {
    this.id = id;
    this.status = status;
    this.player1 = player1;
    this.player2 = player2;
    this.currentQuestion = currentQuestion;
  }
}
