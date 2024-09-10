import axios from 'axios';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const API_URL = 'https://newsapi.org/v2/top-headlines';

export async function fetchNews(country = 'us', category = '', pageSize = 20) {
  try {
    const url = `${API_URL}?country=${country}&apiKey=${API_KEY}`;
    const response = await axios.get<NewsAPIResponse>(url, {
      params: {
        ...(category && { category }),
        ...(pageSize && { pageSize }),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}