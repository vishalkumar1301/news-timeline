import { Article } from '@/lib/Article';
import { NextResponse } from 'next/server';
import { NewsService } from '@/services/NewsService';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { saveNewsToDatabase } from '@/lib/db/dbOperations';
import { NewsAPIEverythingParams } from '@/lib/NewsAPIRequestParams';
import { THE_VERGE_SETTINGS } from '@/config/newsSourceSettings';

const newsService = new NewsService();

const { params, TOTAL_PAGE_LIMIT } = THE_VERGE_SETTINGS;
const API_DELAY = 1000; // 1 second delay between API calls

export async function GET() {
  try {
    const allArticles: Article[] = [];
    
    const firstPageData: NewsAPIResponse = await newsService.fetchEverything({
      ...params,
      page: 1
    } as NewsAPIEverythingParams);
    
    allArticles.push(...firstPageData.articles);

    const totalPages = Math.ceil(firstPageData.totalResults / (params.pageSize || 20));

    for (let page = 2; page <= totalPages && page <= TOTAL_PAGE_LIMIT; page++) {
      const newsData: NewsAPIResponse = await newsService.fetchEverything({
        ...params,
        page
      } as NewsAPIEverythingParams);
      allArticles.push(...newsData.articles);

      await new Promise(resolve => setTimeout(resolve, API_DELAY));
    }

    await saveNewsToDatabase({ articles: allArticles, status: 'ok', totalResults: allArticles.length });

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}