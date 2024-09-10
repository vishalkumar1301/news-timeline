import { NextResponse } from 'next/server';
import { fetchNews } from '@/utils/api';
import { saveNewsToDatabase } from '@/lib/db/dbOperations';

export async function GET() {
  try {
    const newsData = await fetchNews('us', 'technology', 10);
    try {
      await saveNewsToDatabase(newsData);
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue with the request even if database save fails
    }
    return NextResponse.json(newsData.articles);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}