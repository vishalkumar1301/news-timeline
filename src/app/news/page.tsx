'use client';

import { useState } from 'react';
import NewsTimeline from '@/components/NewsTimeline';
import { Article } from '@/lib/Article';

export default function NewsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);

  const handleFetchNews = async (endpoint: 'everything' | 'top-headlines') => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/news/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch news from ${endpoint}`);
      }
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError(`Failed to fetch news from ${endpoint}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Click a button for daily magic</h1>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => handleFetchNews('everything')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Everything'}
        </button>
        <button
          onClick={() => handleFetchNews('top-headlines')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Top Headlines'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-4 mb-8">{error}</p>}
      {articles.length > 0 && <NewsTimeline articles={articles} />}
    </div>
  );
}