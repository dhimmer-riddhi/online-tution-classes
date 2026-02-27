// import { StudentStatus } from "../enums/student-status.enum";

export interface Student {
  id?: string;

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

  // status: StudentStatus;
  createdAt: Date;
}