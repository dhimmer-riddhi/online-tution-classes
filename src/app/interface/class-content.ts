// // src/app/models/class-content.interface.ts

// export interface ClassContent {

//   id?: string;                 // Firestore document ID

//   standard: string;
//   category?: string;        // 9, 10, 11, 12
//   subjectId: string;           // Subject document ID
//   subjectName: string;         // Maths, Science, etc.

//   contents: {
//     chapterNo: number;                  // Chapter No (day = chapter number)
//     chapterName?: string;      // Chapter Name
//     expanded?: boolean;        // Expand/Collapse support

//     concepts: {
//       id: string;
//       title: string;

//       definition?: string;
//       example?: string;

//       // 🔥 Multiple videos support
//       videos?: {
//         url: string;
//         duration: number;
//         fileName?: string;
//         progress?: number;
//         uploading?: boolean;
//       }[];

//       status?: 'pending' | 'completed' | 'locked';
//     }[];

//   }[];

// }
// src/app/models/class-content.interface.ts

export interface ClassContent {

  id?: string;                   // Firestore Document ID

  standard: string;              // 9,10,11,12
  category?: string;             // Commerce / PCM / PCB etc

  subjectId: string;             // Subject ID
  subjectName: string;           // Maths, Science etc


  contents: {

    chapterNo: number;           // Chapter Number
    chapterName: string;         // Chapter Name
    expanded?: boolean;

    concepts: {

      id?: string;

      title: string;             // Concept Title
      definition?: string;       // Concept Definition
      example?: string;

      contents: {

        contentTitle: string;        // Video Title
        contentDefinition?: string;  // Description

        videos: {

          url: string;               // Firebase Video URL
          duration: number;          // seconds
          fileName?: string;

          progress?: number;         // student progress
          uploading?: boolean;       // upload loader

        }[];

      }[];

      status?: 'pending' | 'completed' | 'locked';

    }[];

  }[];

}