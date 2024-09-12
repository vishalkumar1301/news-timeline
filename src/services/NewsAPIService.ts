import axios from 'axios';
import { Article } from '@/lib/Article';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { NewsAPIEverythingParams, NewsAPITopHeadlinesParams } from '@/lib/NewsAPIRequestParams';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const API_BASE_URL = 'https://newsapi.org/v2';

function filterValidArticles(articles: Article[]): Article[] {
  return articles.filter((article: Article) => 
    article.title && article.description &&
    !article.title.includes("[Removed]") &&
    !article.description.includes("[Removed]")
  );
}

function buildApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}?apiKey=${API_KEY}`;
}

function getRequestParams(params: NewsAPIEverythingParams | NewsAPITopHeadlinesParams): Record<string, string | number> {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value != null && key !== 'apiKey' && key !== 'baseRoute' && (typeof value === 'string' || typeof value === 'number')) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string | number>);
}

function createFilteredResponse(response: NewsAPIResponse, filteredArticles: Article[]): NewsAPIResponse {
  return {
    ...response,
    articles: filteredArticles,
    totalResults: response.totalResults,
  };
}

export async function fetchEverything(params: NewsAPIEverythingParams): Promise<NewsAPIResponse> {
  try {
    const url = buildApiUrl('/everything');
    const requestParams = getRequestParams(params);

    const response = await axios.get<NewsAPIResponse>(url, { params: requestParams });
    // console get request url with params
    const filteredArticles = filterValidArticles(response.data.articles);
    return createFilteredResponse(response.data, filteredArticles);
  } catch (error) {
    console.error('Error fetching news from Everything endpoint:', error);
    throw error;
  }
}

export async function fetchTopHeadlines(params: NewsAPITopHeadlinesParams): Promise<NewsAPIResponse> {
  try {
    const url = buildApiUrl('/top-headlines');
    const requestParams = getRequestParams(params);

    
    const response = await axios.get<NewsAPIResponse>(url, { params: requestParams });
    // console get request url with params
    const filteredArticles = filterValidArticles(response.data.articles);
    return createFilteredResponse(response.data, filteredArticles);
  } catch (error) {
    console.error('Error fetching news from Top Headlines endpoint:', error);
    throw error;
  }
}