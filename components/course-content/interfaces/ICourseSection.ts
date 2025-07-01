import { CreatedBy, ICoursesResponse } from "@/interfaces";

export interface ICourseSection {
  id: string;
  status: boolean;
  creationDate: string;
  title: string;
  slug: string;
  description: string;
  positionOrder?: number;
  course?: ICoursesResponse;
  createdBy: CreatedBy;
  price?: number;
  isPublic?: boolean;
}
