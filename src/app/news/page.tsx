'use client';

import { useState } from 'react';
import NewsTimeline from '@/components/NewsTimeline';
import { Article } from '@/lib/Article';

export default function NewsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);

  const handleFetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError('Failed to fetch news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Click the button for daily magic</h1>
      <button
        onClick={handleFetchNews}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch News'}
      </button>
      {error && <p className="text-red-500 mt-4 mb-8">{error}</p>}
      {articles.length > 0 && <NewsTimeline articles={articles} />}
    </div>
  );
}