import { Doctor } from './doctor.interface';

export interface Record {
  id?: string;
  patientFullName: string;
  doctor: Doctor | string;
  receptionDate: string;
  complaints: string;
}
