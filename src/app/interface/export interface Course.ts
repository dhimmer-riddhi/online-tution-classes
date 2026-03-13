export interface Course {
  id?: string;

  class: string;     // 9,10,11,12
  board?: string;    // GSEB / CBSE
  stream?: string;   // Commerce / PCM / PCB

  title: string;
  description: string;
  fees: string;
  duration: string;
  mode?: string;

  teacher: {
    name: string;
    profile: string;
    details: string;
    bio: string;
  };

  chapters: string[];

  buttons: {
    text: string;
    type: string;
    action?: string;
  }[];
}