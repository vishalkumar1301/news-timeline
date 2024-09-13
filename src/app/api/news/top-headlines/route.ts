import { Article } from '@/lib/Article';
import { NextResponse } from 'next/server';
import { NewsService } from '@/services/NewsService';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { saveNewsToDatabase } from '@/lib/db/dbOperations';
import { NewsAPITopHeadlinesParams } from '@/lib/NewsAPIRequestParams';
import { REUTERS_SETTINGS } from '@/config/newsSourceSettings';

const newsService = new NewsService();

const { params, TOTAL_PAGE_LIMIT } = REUTERS_SETTINGS;
const API_DELAY = 1000; // 1 second delay between API calls

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allArticles: Article[] = [];
    
    const firstPageData: NewsAPIResponse = await newsService.fetchTopHeadlines({
      ...params,
      page: 1
    } as NewsAPITopHeadlinesParams);
    
    allArticles.push(...firstPageData.articles);

    const totalPages = Math.ceil(firstPageData.totalResults / (params.pageSize || 20));

    for (let page = 2; page <= totalPages && page <= TOTAL_PAGE_LIMIT; page++) {
      const newsData: NewsAPIResponse = await newsService.fetchTopHeadlines({
        ...params,
        page
      } as NewsAPITopHeadlinesParams);
      allArticles.push(...newsData.articles);

      await new Promise(resolve => setTimeout(resolve, API_DELAY));
    }

    await saveNewsToDatabase({ articles: allArticles, status: 'ok', totalResults: allArticles.length });

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Error in API route:', error);
    throw error;
  }
}