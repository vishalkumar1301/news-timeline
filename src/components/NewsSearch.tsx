'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Article } from '@/lib/Article'

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
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">News Timeline</h1>
      <form onSubmit={handleSearch} className="w-full max-w-md">
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
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <ul className="space-y-4">
            {searchResults.map((article, index) => (
              <li key={index} className="border-b pb-4">
                <h3 className="font-semibold">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}