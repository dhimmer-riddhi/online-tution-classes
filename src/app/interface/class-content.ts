export interface ClassContent {
  id?: string;
  standard: string;
  category?: string;
  subjectId: string;
  subjectName: string;

  contents: {
    chapterNo: number;
    chapterName: string;
    expanded?: boolean;

    concepts: {
      id?: string;
      title: string;
      definition?: string;
      example?: string;

      contents: {
        contentTitle: string;
        contentDefinition?: string;
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