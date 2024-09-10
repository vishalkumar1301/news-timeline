'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">News Timeline</h1>
      <form onSubmit={handleSearch} className="w-full max-w-md">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Button
            type="submit"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1 text-sm transition-colors duration-300"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  )
}