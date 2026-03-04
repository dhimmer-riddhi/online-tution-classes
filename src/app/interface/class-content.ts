// src/app/models/class-content.interface.ts

export interface ClassContent {

  id?: string;                 // Firestore document ID

  standard: string;    
  category?: string;        // 9, 10, 11, 12
  subjectId: string;           // Subject document ID
  subjectName: string;         // Maths, Science, etc.

  contents: {
    day: number;               // Chapter No (day = chapter number)
    chapterName?: string;      // Chapter Name
    expanded?: boolean;        // Expand/Collapse support

    concepts: {
      id: string;
      title: string;

      definition?: string;
      example?: string;

      // 🔥 Multiple videos support
      videos?: {
        url: string;
        duration: string;
        fileName?: string;
        progress?: number;
        uploading?: boolean;
      }[];
  
      status?: 'pending' | 'completed' | 'locked';
    }[];

  }[];

}