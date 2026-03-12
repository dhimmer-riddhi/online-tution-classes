export interface ClassContent {
  id?: string;
  standard: string;
  category?: string;
  subjectId: string;
  subjectName: string;

  contents: {
    editing: boolean;      // chapter level
    chapterNo: number;
    chapterName: string;
    expanded?: boolean;

    content?: string;      // <-- ADD THIS

    concepts: {
      id?: string;
      title: string;
      definition?: string;
      example?: string;

      contents: {
        contentTitle: string;
        contentDefinition?: string;
        editing?: boolean;   // content level
        videos: {
          url: string;
          duration: number;
          fileName?: string;
          progress?: number;
          uploading?: boolean;
        }[];
      }[];

      status?: 'pending' | 'completed' | 'locked';
    }[];
  }[];
}
