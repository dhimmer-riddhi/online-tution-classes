export interface Quiz {
  id?: string;
  quizName: string;
  standard: string;
  category?: string;
  subjectId: string;
  subjectName: string;
  chapters: {
    chapterNo: number;
    chapterName: string;
    totalMarks: number;
    questions: {
      question: string;
      options: string[];
      correctAnswer: string;
      marks: number;
    }[];
  }[];
  totalQuizMarks: number;
  updatedAt?: any;
  [key: string]: any; // Ye line compiler errors ko prevent karegi
}