import { NewsAPIResponse } from '@/lib/NewsAPIResponse';
import { generateTags } from '@/utils/tagGenerator';
import { Article } from '@/lib/Article';
import { NewsAPIEverythingParams, NewsAPITopHeadlinesParams } from '@/lib/NewsAPIRequestParams';
import { fetchEverything, fetchTopHeadlines } from './NewsAPIService';

export class NewsService {
  private addTagsToArticles(articles: Article[]): Article[] {
    return articles.map(article => ({
      ...article,
      tags: generateTags(article.title + ' ' + article.description)
    }));
  }

  async fetchEverything(params: NewsAPIEverythingParams): Promise<NewsAPIResponse> {
    try {
      const newsData = await fetchEverything(params);
      const articlesWithTags = this.addTagsToArticles(newsData.articles);
      return { ...newsData, articles: articlesWithTags };
    } catch (error) {
      console.error('Error fetching and processing everything news:', error);
      throw error;
    }
  }

  async fetchTopHeadlines(params: NewsAPITopHeadlinesParams): Promise<NewsAPIResponse> {
    try {
      const newsData = await fetchTopHeadlines(params);
      const articlesWithTags = this.addTagsToArticles(newsData.articles);
      return { ...newsData, articles: articlesWithTags };
    } catch (error) {
      console.error('Error fetching and processing top headlines:', error);
      throw error;
    }
  }

  filterArticlesByGeneratedTags(articles: Article[], searchQuery: string): Article[] {
    try {
      const searchTags = generateTags(searchQuery);
      return articles.filter(article => 
        article.tags?.some(tag => searchTags.includes(tag))
      );
    } catch (error) {
      console.error('Error filtering articles by generated tags:', error);
      throw error;
    }
  }
}