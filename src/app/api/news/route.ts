import { NextResponse } from 'next/server';
import { NewsService } from '@/services/NewsService';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { saveNewsToDatabase } from '@/lib/db/dbOperations';




const newsService = new NewsService();




export async function GET() {
  try {
    const newsData: NewsAPIResponse = await newsService.fetchNewsFromNewsAPI('us', '', 20);

    try {
      await saveNewsToDatabase(newsData);
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    return NextResponse.json(newsData.articles);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}