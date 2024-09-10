'use client';

import NewsSearch from '@/components/NewsSearch';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <NewsSearch />
    </div>
  );
}
