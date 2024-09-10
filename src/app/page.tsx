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
    <>
      <NewsSearch />
      {/* <button onClick={fetchNews} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Refresh News
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>} */}
      {/* {news.length > 0 && (
        <ul className="mt-4 space-y-2">
          {news.map((article, index) => (
            <li key={index} className="p-2 bg-gray-100 rounded">{article.title}</li>
          ))}
        </ul>
      )} */}
    </>
  );
}
