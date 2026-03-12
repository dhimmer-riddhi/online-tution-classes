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
 board: string;         //CBSE/GSEB
  stream: string;       //COMMERCE/SCIENCE
  scienceGroup?: string;  //PCM/PCB

  subjects: string[];

  status: 'pending' | 'approved' | 'rejected';

  createdAt: Date;
}