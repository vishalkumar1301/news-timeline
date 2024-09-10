'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/lib/Article';
import NewsSearch from '@/components/NewsSearch';

export default function Home() {
  const [news, setNews] = useState<Article[]>([]);
  const [error, setError] = useState('');

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      setNews(data);
      setError('');
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    // <div>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <NewsSearch />
    </div>

  );
}
