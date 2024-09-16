'use client';

import { useState } from 'react';
import { Article } from '@/lib/Article';
import NewsTimeline from '@/components/NewsTimeline';
import FetchEverything from '@/components/FetchEverything';
import FetchTopHeadlines from '@/components/FetchTopHeadlines';

export default function NewsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);

  const handleSetArticles = (newArticles: Article[]) => {
    setArticles(prev => [...prev, ...newArticles]);
  }

  const handleSetError = (message: string) => {
    setError(message);
  }

  const handleSetLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  }

  return (
    <div className="container mx-auto p-4 max-w-xl gap-4 flex flex-col">
      <FetchEverything 
        onFetchSuccess={handleSetArticles} 
        onFetchError={handleSetError} 
        onFetchLoading={handleSetLoading} 
      />
      <FetchTopHeadlines 
        onFetchSuccess={handleSetArticles} 
        onFetchError={handleSetError} 
        onFetchLoading={handleSetLoading} 
      />
      {error && <p className="text-red-500 mt-4 mb-8">{error}</p>}
      {articles.length > 0 && <NewsTimeline articles={articles} />}
    </div>
  );
}