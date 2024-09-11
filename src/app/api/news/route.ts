import { NextResponse } from 'next/server';
import { NewsService } from '@/services/NewsService';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { saveNewsToDatabase } from '@/lib/db/dbOperations';
import { Article } from '@/lib/Article';

const newsService = new NewsService();

export async function GET() {
  try {
    let allArticles: Article[] = [];
    
    // Loop through all pages
    for (let page = 1; page <= 5; page++) {  // Reduced to 5 pages to avoid rate limiting
      const newsData: NewsAPIResponse = await newsService.fetchNewsFromNewsAPI('us', '', 20, page);
      
      allArticles.push(...newsData.articles);

      try {
        await saveNewsToDatabase(newsData);
        console.log(`Saved news from page ${page} to database`);
      } catch (dbError) {
        console.error(`Database error on page ${page}:`, dbError);
        // Continue with the next page even if database save fails
      }

      // Add a small delay to avoid hitting rate limits
      // await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}