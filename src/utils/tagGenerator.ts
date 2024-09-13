export function generateTags(title: string): string[] {
  // Define a simple tokenizer using regular expressions
  const tokens = title.toLowerCase().split(/\W+/);
  const stopwords = new Set([
    'the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'or', 'but',
  ]);

  const tags = tokens.filter(
    (token) => token.length > 2 && !stopwords.has(token)
  );

  return Array.from(new Set(tags)); // Remove duplicates
}
