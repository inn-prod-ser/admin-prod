import { CreatedBy } from "./courses-response";

export interface Category {
  id: string;
  status: boolean;
  visible: boolean;
  creationDate: string;
  title: string;
  slug: string;
  createdBy: CreatedBy;
}
