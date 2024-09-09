'use client';

import { useState } from 'react';
import { fetchNews } from '@/utils/api';
import axios from 'axios';

export default function Home() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');

  const handleFetchNews = async () => {
    try {
      const articles = await fetchNews('us', 'technology', 10);
      setNews(articles);
      setError('');
    } catch (error) {
      console.error('Error fetching news:', error);
      if (axios.isAxiosError(error)) {
        setError(`Axios error: ${error.message}\nResponse: ${JSON.stringify(error.response?.data)}`);
      } else {
        setError(`Unknown error: ${error}`);
      }
    }
  };

  return (
    <div>
      <h1>News Timeline</h1>
      <button onClick={handleFetchNews}>Fetch News</button>
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
