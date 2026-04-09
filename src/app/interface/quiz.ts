export interface Quiz {
  id?: string;
  standard: string;
  subject: string;
  videoSet: number;
  questions: Question[];
  createdAt?: any;
}

export interface Question {
  question: string;
  options: string[];
  correct: string;
}