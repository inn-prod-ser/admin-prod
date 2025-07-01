import { CreatedBy } from "@/interfaces";

export interface IClassCourseResponse {
  creationDate: string;
  title: string;
  description: string;
  slug: string;
  positionOrder?: number;
  createdBy: CreatedBy;
  courseSection?: IClassCourseResponse;
  id: string;
  status: boolean;
  course?: IClassCourseResponse;
  price?: number;
  isPublic?: boolean;
}
