import mysql from 'mysql2/promise';
import { NewsAPIResponse } from '../NewsAPIResponse';
import { Article } from '../Article';

let pool: mysql.Pool | null = null;

async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 55000,
      connectionLimit: 10,
    });
  }
  return pool;
}

async function insertOrUpdateSource(connection: mysql.Connection, source: Article['source']) {
  await connection.execute(
    'INSERT INTO source (id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = ?',
    [source.id || 'unknown', source.name, source.name]
  );
}

async function insertArticle(connection: mysql.Connection, article: Article): Promise<number> {
  const [result] = await connection.execute(
    'INSERT INTO article (source_id, author, title, description, url, url_to_image, published_at, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      article.source.id || 'unknown',
      article.author,
      article.title,
      article.description,
      article.url,
      article.urlToImage,
      new Date(article.publishedAt),
      article.content,
    ]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

async function insertTag(connection: mysql.Connection, tag: string): Promise<number> {
  await connection.execute('INSERT IGNORE INTO tag (name) VALUES (?)', [tag]);
  const [tagResult] = await connection.execute('SELECT id FROM tag WHERE name = ?', [tag]);
  return (tagResult as any)[0].id;
}

async function linkArticleToTag(connection: mysql.Connection, articleId: number, tagId: number) {
  await connection.execute(
    'INSERT IGNORE INTO article_tag (article_id, tag_id) VALUES (?, ?)',
    [articleId, tagId]
  );
}

async function saveArticleWithTags(connection: mysql.Connection, article: Article) {
  await insertOrUpdateSource(connection, article.source);
  const articleId = await insertArticle(connection, article);

  if (article.tags && article.tags.length > 0) {
    for (const tag of article.tags) {
      const tagId = await insertTag(connection, tag);
      await linkArticleToTag(connection, articleId, tagId);
    }
  }
}

export async function saveNewsToDatabase(newsData: NewsAPIResponse) {
  let connection;
  try {
    const pool = await getPool();
    connection = await pool.getConnection();
    
    await connection.beginTransaction();

    for (const article of newsData.articles) {
      await saveArticleWithTags(connection, article);
    }

    await connection.commit();
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error saving news to database:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}