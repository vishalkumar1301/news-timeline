'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/lib/Article';

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

  // useEffect(() => {
  //   fetchNews();
  // }, []);

  return (
    <div>
      <h1>News Timeline</h1>
      <button onClick={fetchNews}>Refresh News</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {news.length > 0 && (
        <ul>
          {news.map((article, index) => (
            <li key={index}>{article.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
