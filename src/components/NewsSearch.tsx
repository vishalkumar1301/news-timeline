'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Article } from '@/lib/Article'
import NewsTimeline from '@/components/NewsTimeline'

export default function NewsSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Article[]>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Error searching news:', error)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">News Timeline</h1>
      <form onSubmit={handleSearch} className="w-full max-w-md mx-auto mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-20 py-6 text-lg text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-3 text-base transition-colors duration-300"
          >
            Search
          </Button>
        </div>
      </form>
      {searchResults.length > 0 ? (
        <NewsTimeline articles={searchResults} />
      ) : (
        <p className="text-center text-gray-500">No results found. Try a different search query.</p>
      )}
    </div>
  )
}