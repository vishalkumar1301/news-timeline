import { NextResponse } from 'next/server';
import { searchArticlesInDatabase } from '@/lib/db/dbOperations';
import { generateTags } from '@/utils/tagGenerator';
import { Article } from '@/lib/Article';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const searchTags = generateTags(query);
    if (searchTags.length === 0) {
      return NextResponse.json({ error: 'No valid search terms found' }, { status: 400 });
    }
    const searchResults: Article[] = await searchArticlesInDatabase(searchTags);
    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Error in search API route:', error);
    return NextResponse.json({ error: 'Failed to search articles' }, { status: 500 });
  }
}