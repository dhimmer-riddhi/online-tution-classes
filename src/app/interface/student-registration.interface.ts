export interface StudentRegistration {
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  city: string;
  state: string;

  standard: string;
  board: string;
  stream: string;
  scienceGroup?: string;
  subjects: string;

  createdAt: Date;
}