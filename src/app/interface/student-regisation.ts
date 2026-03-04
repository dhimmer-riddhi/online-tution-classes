export enum StudentRegistrationStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}

export interface StudentRegistration {
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

  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}