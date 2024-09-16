import { Article } from '@/lib/Article';
import { NextResponse } from 'next/server';
import { NewsService } from '@/services/NewsService';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { saveNewsToDatabase } from '@/lib/db/dbOperations';
import { NewsAPIEverythingParams } from '@/lib/NewsAPIRequestParams';

const newsService = new NewsService();
const API_DELAY = 1000;

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: NewsAPIEverythingParams = {
    sources: searchParams.get('sources') || '',
    sortBy: searchParams.get('sortBy') || 'publishedAt',
    pageSize: parseInt(searchParams.get('pageSize') || '20'),
    page: parseInt(searchParams.get('page') || '1'),
    from: searchParams.get('from') || undefined,
    to: searchParams.get('to') || undefined,
    apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY || '',
  };

  const TOTAL_PAGE_LIMIT = parseInt(searchParams.get('TOTAL_PAGE_LIMIT') || '3');

  try {
    const allArticles: Article[] = [];
    
    const firstPageData: NewsAPIResponse = await newsService.fetchEverything(params);
    
    allArticles.push(...firstPageData.articles);
    await saveNewsToDatabase({ articles: firstPageData.articles, status: 'ok', totalResults: firstPageData.articles.length });

    const totalPages = Math.ceil(firstPageData.totalResults / params.pageSize);

    for (let page = 2; page <= totalPages && page <= TOTAL_PAGE_LIMIT; page++) {
      const newsData: NewsAPIResponse = await newsService.fetchEverything({
        ...params,
        page
      });
      allArticles.push(...newsData.articles);
      
      await saveNewsToDatabase({ articles: newsData.articles, status: 'ok', totalResults: newsData.articles.length });
      
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
    }

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}