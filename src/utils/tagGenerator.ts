const stopwords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'or', 'but']);

export function generateTags(title: string): string[] {
  // Convert to lowercase and split into words
  const tokens = title.toLowerCase().split(/\W+/);
  
  // Filter out stopwords and short words, then remove duplicates
  const tags = Array.from(new Set(
    tokens.filter(token => token.length > 2 && !stopwords.has(token))
  ));

  return tags;
}