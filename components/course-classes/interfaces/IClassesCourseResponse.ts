import { CreatedBy } from "@/interfaces";

export interface ICourseClassesResponse {
  id: string;
  status: boolean;
  creationDate: string;
  title: string;
  description: string;
  slug: string;
  positionOrder?: number;
  courseSection?: ICourseClassesResponse;
  createdBy: CreatedBy;
  course?: ICourseClassesResponse;
  price?: number;
  isPublic?: boolean;
}
