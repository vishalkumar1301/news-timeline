import { NextResponse } from 'next/server';
import { fetchNews } from '@/utils/api';
import { saveNewsToDatabase } from '@/lib/db/dbOperations';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { generateTags } from '@/utils/tagGenerator';

export async function GET() {
  try {
    const newsData: NewsAPIResponse = await fetchNews('us', 'technology', 10);
    
    // Generate tags for each article
    const articlesWithTags = newsData.articles.map(article => ({
      ...article,
      tags: generateTags(article.title)
    }));

    try {
      // Update saveNewsToDatabase function to handle tags
      await saveNewsToDatabase({ ...newsData, articles: articlesWithTags });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue with the request even if database save fails
    }

    return NextResponse.json(articlesWithTags);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}