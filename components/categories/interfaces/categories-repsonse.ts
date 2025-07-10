import { CreatedBy } from "../../../interfaces/courses-response";

export interface CategoriesResponse {
  id:            string;
  status:        boolean;
  visible:       boolean;
  creationDate:  string;
  title:         string;
  slug:          string;
  createdBy:     CreatedBy;
}
