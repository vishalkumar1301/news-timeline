import { Article } from "./Article";

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}
