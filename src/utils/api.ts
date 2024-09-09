import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const API_URL = 'https://newsapi.org/v2/top-headlines';

export async function fetchNews(country = 'us', category = '', pageSize = 20) {
  console.log('API Key:', API_KEY); // Keep this for debugging
  try {
    const url = `${API_URL}?country=${country}&apiKey=${API_KEY}`;
    const response = await axios.get(url, {
      params: {
        ...(category && { category }),
        ...(pageSize && { pageSize }),
      },
    });
    console.log('Request URL:', response.config.url); // Log the full URL
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}