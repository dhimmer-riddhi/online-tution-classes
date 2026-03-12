export interface Assignment {

  id?: string;

  standard: string;
  category?: string;
  subjectId: string;
  subjectName: string;

  chapters: {
    chapterNo: number;
    chapterName: string;

    assignments: {
      title: string;

      files: {
        fileName: string;
        fileUrl: string;
        fileSize: number;
      }[];

      dueDate?: string;
      totalMarks?: number;
    }[];

  }[];

}