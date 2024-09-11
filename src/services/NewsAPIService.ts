import axios from 'axios';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const API_URL = 'https://newsapi.org/v2/top-headlines';

export async function fetchNewsFromAPI(country = '', category = '', pageSize = 20, page = 1): Promise<NewsAPIResponse> {
  try {
    const url = `${API_URL}?country=${country}&apiKey=${API_KEY}`;
    const response = await axios.get<NewsAPIResponse>(url, {
      params: {
        ...(category && { category }),
        ...(pageSize && { pageSize }),
        ...(page && { page }),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news from API:', error);
    throw error;
  }
}