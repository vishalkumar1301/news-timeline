import { Article } from '@/lib/Article';
import { NextResponse } from 'next/server';
import { NewsService } from '@/services/NewsService';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { saveNewsToDatabase } from '@/lib/db/dbOperations';
import { NewsAPIRequestParams } from '@/lib/NewsAPIRequestParams';

const newsService = new NewsService();




// Common variables
const ARTICLES_PER_PAGE = 20;
const DEFAULT_QUERY = 'tech';
const DEFAULT_SORT_BY = 'publishedAt';
const API_DELAY = 1000; // 1 second delay between API calls

const DEFAULT_PARAMS: NewsAPIRequestParams = {
  q: DEFAULT_QUERY,
  pageSize: ARTICLES_PER_PAGE,
  sortBy: DEFAULT_SORT_BY,
  from: '2024-09-10',
  to: '2024-09-11',
};






export async function GET() {
  console.log('Starting GET request for news articles');
  try {
    let allArticles: Article[] = [];
    
    console.log('Fetching first page with params:', DEFAULT_PARAMS);
    const firstPageData: NewsAPIResponse = await newsService.fetchNewsFromNewsAPI({
      ...DEFAULT_PARAMS,
      page: 1
    });

    // console.log('First page data:', firstPageData);
    
    console.log(`First page fetched. Total results: ${firstPageData.totalResults}`);
    allArticles.push(...firstPageData.articles);

    const totalPages = Math.ceil(firstPageData.totalResults / ARTICLES_PER_PAGE);
    console.log(`Total pages to fetch: ${totalPages}`);

    for (let page = 2; page <= 3; page++) {
      console.log(`Fetching page ${page} of ${totalPages}`);
      const newsData: NewsAPIResponse = await newsService.fetchNewsFromNewsAPI({
        ...DEFAULT_PARAMS,
        page
      });
      console.log(`Page ${page} fetched. Articles received: ${newsData.articles.length}`);
      allArticles.push(...newsData.articles);

      console.log(`Waiting for ${API_DELAY}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
    }

    console.log(`Total articles fetched: ${allArticles.length}`);

    try {
      console.log('Attempting to save articles to database');
      await saveNewsToDatabase({ articles: allArticles, status: 'ok', totalResults: allArticles.length });
      console.log(`Successfully saved all news articles to database`);
    } catch (dbError) {
      console.error(`Database error while saving articles:`, dbError);
    }

    console.log('Returning response with all articles');
    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}