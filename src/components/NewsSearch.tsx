'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Article } from '@/lib/Article'
import NewsTimeline from '@/components/NewsTimeline'
import Spinner from '@/components/ui/spinner'

export default function NewsSearch() {
  // State to manage the search query input
  const [searchQuery, setSearchQuery] = useState('')

  // State to store the search results
  const [searchResults, setSearchResults] = useState<Article[]>([])

  // State to track if a search has been performed
  const [hasSearched, setHasSearched] = useState(false)

  // State to track if the search is currently loading
  const [isLoading, setIsLoading] = useState(false)

  // State to store any error messages
  const [error, setError] = useState<string | null>(null)

  // Handler for the search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    // Trim the search query to remove unnecessary whitespace
    const trimmedQuery = searchQuery.trim()

    // If the search query is empty after trimming, do nothing
    if (!trimmedQuery) return

    // Update state to reflect that a search has been initiated
    setHasSearched(true)
    setIsLoading(true)
    setError(null) // Reset any previous errors

    try {
      // Make a fetch request to the search API with the encoded query
      const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`)

      // If the response is not OK (e.g., status 4xx or 5xx), throw an error
      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }

      // Parse the JSON data from the response
      const data = await response.json()

      // Update the search results state with the fetched data
      setSearchResults(data)
    } catch (error) {
      // Log the error to the console for debugging
      console.error('Error searching news:', error)

      // Update the error state to display an error message to the user
      setError('An error occurred while searching. Please try again later.')
    } finally {
      // Regardless of success or failure, stop the loading state
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">News Timeline</h1>
      
      {/* Search Form */}
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

      {/* Conditional Rendering Based on State */}
      <div className="mt-4">
        {/* Initial State: Encourage users to perform a search */}
        {!hasSearched && (
          <p className="text-center text-gray-500">
            Welcome! Search for something and we will show you a timeline on that topic.
          </p>
        )}

        {/* Loading State: Show a loading spinner */}
        {isLoading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}

        {/* Error State: Display an error message */}
        {error && (
          <p className="text-center text-red-500">
            {error}
          </p>
        )}

        {/* Display search results if available and not loading or error */}
        {!isLoading && !error && hasSearched && (
          <>
            {searchResults.length > 0 ? (
              <NewsTimeline articles={searchResults} />
            ) : (
              <p className="text-center text-gray-500">
                No results found. Try a different search query.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
