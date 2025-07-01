import { CreatedBy, ICoursesResponse } from '@/interfaces';

export interface IClassContentResponse {
  id:           string;
  status:       boolean;
  creationDate: string;
  contentType:  string;
  content:      string;
  courseClass:  ICoursesResponse;
  createdBy:    CreatedBy;
}
