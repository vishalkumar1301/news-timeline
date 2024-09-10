import { fetchNews } from '@/utils/api';
import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { generateTags } from '@/utils/tagGenerator';
import { Article } from '@/lib/Article';

export class NewsService {
  private addTagsToArticles(articles: Article[]): Article[] {
    return articles.map(article => ({
      ...article,
      tags: generateTags(article.title)
    }));
  }

  async getNews(country: string = 'us', category: string = 'technology', pageSize: number = 10): Promise<NewsAPIResponse> {
    try {
      const newsData: NewsAPIResponse = await fetchNews(country, category, pageSize);
      const articlesWithTags = this.addTagsToArticles(newsData.articles);
      return { ...newsData, articles: articlesWithTags };
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }
}