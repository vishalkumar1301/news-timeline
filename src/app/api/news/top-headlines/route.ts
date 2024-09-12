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

export async function GET() {
  console.log('Starting GET request for top headlines');
  try {
    let allArticles: Article[] = [];
    
    console.log('Fetching first page of top headlines');
    const firstPageData: NewsAPIResponse = await newsService.fetchTopHeadlines({
      ...params,
      page: 1
    } as NewsAPITopHeadlinesParams);
    
    allArticles.push(...firstPageData.articles);

    const totalPages = Math.ceil(firstPageData.totalResults / (params.pageSize || 20));
    console.log(`Total pages: ${totalPages}, TOTAL_PAGE_LIMIT: ${TOTAL_PAGE_LIMIT}`);

    for (let page = 2; page <= totalPages && page <= TOTAL_PAGE_LIMIT; page++) {
      console.log(`Fetching page ${page} of top headlines`);
      const newsData: NewsAPIResponse = await newsService.fetchTopHeadlines({
        ...params,
        page
      } as NewsAPITopHeadlinesParams);
      allArticles.push(...newsData.articles);

      console.log(`Waiting ${API_DELAY}ms before next API call`);
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
    }

    console.log(`Total articles fetched: ${allArticles.length}`);

    try {
      console.log('Saving articles to database');
      await saveNewsToDatabase({ articles: allArticles, status: 'ok', totalResults: allArticles.length });
      console.log('Articles saved successfully');
    } catch (dbError) {
      console.error('Database error while saving articles:', dbError);
    }

    console.log('Returning response with all articles');
    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}