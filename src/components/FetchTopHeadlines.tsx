import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { Article } from '@/lib/Article'

const sourceOptions = [
  { label: "The Verge", value: "the-verge" },
  { label: "Reuters", value: "reuters" },
]

type FetchTopHeadlinesProps = {
  onFetchSuccess: (articles: Article[]) => void;
  onFetchError: (message: string) => void;
}

export default function FetchTopHeadlines({ onFetchSuccess, onFetchError }: FetchTopHeadlinesProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [settings, setSettings] = useState({
    TOTAL_PAGE_LIMIT: 1,
    params: {
      sources: [] as string[],
      sortBy: "popularity",
      pageSize: 10,
      page: 1,
    }
  })

  const handleChange = (field: string, value: string | number | string[]) => {
    console.log('handleChange called:', { field, value });
    setSettings(prev => {
      const newSettings = {
        ...prev,
        params: {
          ...prev.params,
          [field]: value
        }
      };
      console.log('New settings:', newSettings);
      return newSettings;
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams()
      query.append('sources', settings.params.sources.join(','))
      query.append('sortBy', settings.params.sortBy)
      query.append('pageSize', settings.params.pageSize.toString())
      query.append('page', settings.params.page.toString())

      const response = await fetch(`/api/news/top-headlines?${query.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch news from top-headlines`);
      }
      const data = await response.json();
      onFetchSuccess(data);
    } catch (err) {
      const errorMessage = `Failed to fetch news from top-headlines`;
      setError(errorMessage);
      onFetchError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  console.log('Render settings:', settings);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-background rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Fetch Top Headlines</h2>
      
      <div>
        <Label htmlFor="sources">Sources</Label>
        <MultiSelect
          options={sourceOptions}
          selected={settings.params.sources}
          onChange={(selected: string[]) => handleChange('sources', selected)}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalPageLimit">Total Page Limit</Label>
          <Input 
            id="totalPageLimit" 
            type="number" 
            value={settings.TOTAL_PAGE_LIMIT} 
            onChange={(e) => setSettings(prev => ({ ...prev, TOTAL_PAGE_LIMIT: parseInt(e.target.value) }))}
          />
        </div>
        
        <div>
          <Label htmlFor="pageSize">Page Size</Label>
          <Input 
            id="pageSize" 
            type="number" 
            value={settings.params.pageSize} 
            onChange={(e) => handleChange('pageSize', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="sortBy">Sort By</Label>
        <Select onValueChange={(value) => handleChange('sortBy', value)} defaultValue={settings.params.sortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Select sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="publishedAt">Published At</SelectItem>
            <SelectItem value="relevancy">Relevancy</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Top Headlines'}
      </Button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  )
}