import axios from 'axios';
import { Article } from '@/lib/Article';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const API_URL = 'https://newsapi.org/v2/top-headlines';

function filterValidArticles(articles: Article[]): Article[] {
  return articles.filter((article: Article) => 
    article.title && article.description && article.content &&
    !article.title.includes("[Removed]") &&
    !article.description.includes("[Removed]") &&
    !article.content.includes("[Removed]")
  );
}

function buildApiUrl(country: string): string {
  return `${API_URL}?country=${country}&apiKey=${API_KEY}`;
}

function getRequestParams(category: string, pageSize: number, page: number) {
  return {
    ...(category && { category }),
    ...(pageSize && { pageSize }),
    ...(page && { page }),
  };
}

function createFilteredResponse(response: NewsAPIResponse, filteredArticles: Article[]): NewsAPIResponse {
  return {
    ...response,
    articles: filteredArticles,
    totalResults: filteredArticles.length,
  };
}

export async function fetchNewsFromAPI(country = '', category = '', pageSize = 20, page = 1): Promise<NewsAPIResponse> {
  try {
    const url = buildApiUrl(country);
    const params = getRequestParams(category, pageSize, page);
    const response = await axios.get<NewsAPIResponse>(url, { params });

    const filteredArticles = filterValidArticles(response.data.articles);
    return createFilteredResponse(response.data, filteredArticles);
  } catch (error) {
    console.error('Error fetching news from API:', error);
    throw error;
  }
}