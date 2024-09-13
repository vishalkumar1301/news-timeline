import { NewsAPIEverythingParams, NewsAPITopHeadlinesParams } from "@/lib/NewsAPIRequestParams";

export const THE_VERGE_SETTINGS = {
    // everything
  TOTAL_PAGE_LIMIT: 3,
  params: {
    apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
    sources: "the-verge",
    pageSize: 20,
    sortBy: "publishedAt",
    page: 1,
    from: "2024-09-09",
    to: "2024-09-12",
  } as NewsAPIEverythingParams,
};


export const REUTERS_SETTINGS = {
    // top-headlines
  TOTAL_PAGE_LIMIT: 1,
  params: {
    apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
    sources: "reuters",
    sortBy: "popularity",
    pageSize: 10,
    page: 1,
  } as NewsAPITopHeadlinesParams,
};