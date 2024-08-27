export interface questionResponse {
  _id: string;
  text: string;
  group: string;
  imageUrl?: string;
  isActive: boolean;
  correctAnswer: number;
  options: questionOptionResponse[];
}

export interface questionOptionResponse {
  text: string;
  imageUrl?: string;
  isCorrect: boolean;
}
