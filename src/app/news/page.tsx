'use client';

import { useState } from 'react';

export default function NewsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      console.log('Fetched news:', data);
      // You can handle the fetched data here (e.g., display it or store it in state)
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
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch News'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}