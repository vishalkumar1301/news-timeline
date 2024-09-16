import { Article } from '@/lib/Article';
import { NextResponse } from 'next/server';
import { NewsService } from '@/services/NewsService';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { saveNewsToDatabase } from '@/lib/db/dbOperations';
import { NewsAPITopHeadlinesParams } from '@/lib/NewsAPIRequestParams';

const newsService = new NewsService();
const API_DELAY = 1000;

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: NewsAPITopHeadlinesParams = {
    sources: searchParams.get('sources') || '',
    pageSize: parseInt(searchParams.get('pageSize') || '20'),
    page: parseInt(searchParams.get('page') || '1'),
    apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY || '',
  };

  const TOTAL_PAGE_LIMIT = parseInt(searchParams.get('TOTAL_PAGE_LIMIT') || '1');

  try {
    const allArticles: Article[] = [];
    
    const firstPageData: NewsAPIResponse = await newsService.fetchTopHeadlines(params);
    
    allArticles.push(...firstPageData.articles);

    const totalPages = Math.ceil(firstPageData.totalResults / (params.pageSize || 20));

    for (let page = 2; page <= totalPages && page <= TOTAL_PAGE_LIMIT; page++) {
      const newsData: NewsAPIResponse = await newsService.fetchTopHeadlines({
        ...params,
        page
      });
      allArticles.push(...newsData.articles);

      await new Promise(resolve => setTimeout(resolve, API_DELAY));
    }

    await saveNewsToDatabase({ articles: allArticles, status: 'ok', totalResults: allArticles.length });

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}