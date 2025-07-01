import { CategoriesResponse } from '@/components/categories/interfaces';


export interface ICoursesResponse {
  id: string;
  status: boolean;
  creationDate: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  isPublic: boolean;
  categories: CategoriesResponse[];
  createdBy: CreatedBy;
  courseUnderConstruction: boolean;
  estimatedDuration: string;
  difficultyLevel: "Básica" | "Intermedia" | "Avanzada";
}
export interface CreatedBy {
  id: string;
  creationDate: string;
  lastActivity: string;
  isActive: boolean;
  username: string;
  clerkId: string;
  name: string;
  lastName: string;
  phone: null;
  roles: string[];
}
