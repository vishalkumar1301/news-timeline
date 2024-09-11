import { fetchNewsFromAPI } from './NewsAPIService';
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

  async fetchNewsFromNewsAPI(country: string = '', category: string = '', pageSize: number = 20): Promise<NewsAPIResponse> {
    try {
      const newsData: NewsAPIResponse = await fetchNewsFromAPI(country, category, pageSize);
      const articlesWithTags = this.addTagsToArticles(newsData.articles);
      return { ...newsData, articles: articlesWithTags };
    } catch (error) {
      console.error('Error fetching and processing news:', error);
      throw error;
    }
  }

  filterArticlesByGeneratedTags(articles: Article[], searchQuery: string): Article[] {
    const searchTags = generateTags(searchQuery);
    return articles.filter(article => 
      article.tags?.some(tag => searchTags.includes(tag))
    );
  }
}