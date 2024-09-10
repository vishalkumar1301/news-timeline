import natural from 'natural';

const tokenizer = new natural.WordTokenizer();
const stopwords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'or', 'but']);

export function generateTags(title: string): string[] {
  const tokens = tokenizer.tokenize(title.toLowerCase());
  const tags = tokens
    .filter(token => token.length > 2 && !stopwords.has(token));

  return Array.from(new Set(tags)); // Remove duplicates
}