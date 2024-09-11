import { Source } from './Source';

export interface Article {
  sourceId: string;
  source: Source;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
  tags?: string[];
}