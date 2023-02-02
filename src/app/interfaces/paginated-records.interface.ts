import { Record } from './record.iterface';

export interface PaginatedRecords {
  content: Record[];
  page: string;
  pageSize: string;
  elementsOnPage: number;
  totalCountOfElements: number;
}
