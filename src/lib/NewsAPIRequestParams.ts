export interface NewsAPIRequestParams {
  q?: string;
  country?: string;
  category?: string;
  pageSize?: number;
  page?: number;
  from?: string;
  to?: string;
  sortBy?: string;
  domains?: string[];
  sources?: string[];
}