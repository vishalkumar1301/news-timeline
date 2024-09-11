import { Article } from '@/lib/Article';
import { NextResponse } from 'next/server';
import { NewsService } from '@/services/NewsService';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { saveNewsToDatabase } from '@/lib/db/dbOperations';
import { NewsAPIRequestParams } from '@/lib/NewsAPIRequestParams';

const newsService = new NewsService();




// Common variables
const ARTICLES_PER_PAGE = 20;
const DEFAULT_QUERY = '';
const DEFAULT_SORT_BY = 'publishedAt';
const API_DELAY = 1000; // 1 second delay between API calls

const DEFAULT_PARAMS: NewsAPIRequestParams = {
  q: DEFAULT_QUERY,
  pageSize: ARTICLES_PER_PAGE,
  sortBy: DEFAULT_SORT_BY,
  from: '2024-09-11',
  to: '2024-09-11',
};






export async function GET() {
  try {
    let allArticles: Article[] = [];
    
    // Fetch the first page to get totalResults
    const firstPageData: NewsAPIResponse = await newsService.fetchNewsFromNewsAPI({
      ...DEFAULT_PARAMS,
      page: 1
    });
    
    allArticles.push(...firstPageData.articles);

    // Calculate total pages
    const totalPages = Math.ceil(firstPageData.totalResults / ARTICLES_PER_PAGE);

    // Fetch remaining pages
    for (let page = 2; page <= totalPages; page++) {
      const newsData: NewsAPIResponse = await newsService.fetchNewsFromNewsAPI({
        ...DEFAULT_PARAMS,
        page
      });
      allArticles.push(...newsData.articles);

      // Add a small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
    }

    // Save all articles to database at once
    try {
      await saveNewsToDatabase({ articles: allArticles, status: 'ok', totalResults: allArticles.length });
      console.log(`Saved all news articles to database`);
    } catch (dbError) {
      console.error(`Database error while saving articles:`, dbError);
      // Continue with the request even if database save fails
    }

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}