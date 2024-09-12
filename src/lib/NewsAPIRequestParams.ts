export interface NewsAPIEverythingParams {
  apiKey: string;
  q?: string;
  searchIn?: string;
  sources: string;
  domains?: string;
  excludeDomains?: string;
  from?: string;
  to?: string;
  language?: string;
  sortBy?: string;
  pageSize: number;
  page?: number;
}

export interface NewsAPITopHeadlinesParams {
  apiKey: string;
  country?: string;
  category?: string;
  sources: string;
  q?: string;
  pageSize?: number;
  page?: number;
}

// Keep the original interface for backwards compatibility if needed
export interface NewsAPIRequestParams extends NewsAPIEverythingParams {}