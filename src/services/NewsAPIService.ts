import axios from 'axios';
import { Article } from '@/lib/Article';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { NewsAPIRequestParams } from '@/lib/NewsAPIRequestParams';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const API_URL = 'https://newsapi.org/v2/everything';

function filterValidArticles(articles: Article[]): Article[] {
  return articles.filter((article: Article) => 
    article.title && article.description && article.content &&
    !article.title.includes("[Removed]") &&
    !article.description.includes("[Removed]") &&
    !article.content.includes("[Removed]")
  );
}

function buildApiUrl(): string {
  return `${API_URL}?apiKey=${API_KEY}`;
}

function getRequestParams(params: NewsAPIRequestParams) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value) acc[key] = value;
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

export async function fetchNewsFromAPI(params: NewsAPIRequestParams): Promise<NewsAPIResponse> {
  try {
    const url = buildApiUrl();
    const requestParams = getRequestParams(params);
    
    // Log the URL and request parameters
    console.log('Fetching news from API');
    console.log('URL:', url);
    console.log('Request Params:', requestParams);

    const response = await axios.get<NewsAPIResponse>(url, { params: requestParams });

    // Log the raw response data
    // console.log('Raw Response Data:', response.data);

    const filteredArticles = filterValidArticles(response.data.articles);
    const filteredResponse = createFilteredResponse(response.data, filteredArticles);

    // Log the filtered response data
    // console.log('Filtered Response Data:', filteredResponse);

    return filteredResponse;
  } catch (error) {
    // Log the error
    console.error('Error fetching news from API:', error);
    throw error;
  }
}