import { NewsAPIEverythingParams, NewsAPITopHeadlinesParams } from "@/lib/NewsAPIRequestParams";

export const THE_VERGE_SETTINGS = {
    // everything
  TOTAL_PAGE_LIMIT: 1,
  params: {
    apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
    sources: "the-verge",
    pageSize: 100,
    sortBy: "publishedAt",
    page: 1,
    from: "2024-09-10",
    to: "2024-09-11",
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