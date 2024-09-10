import mysql from 'mysql2/promise';
import { NewsAPIResponse } from '../NewsAPIResponse';

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

export async function saveNewsToDatabase(newsData: NewsAPIResponse) {
  let connection;
  try {
    const pool = await getPool();
    connection = await pool.getConnection();
    
    await connection.beginTransaction();

    for (const article of newsData.articles) {
      // Insert or update source
      await connection.execute(
        'INSERT INTO source (id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = ?',
        [article.source.id || 'unknown', article.source.name, article.source.name]
      );

      // Insert article
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

      const articleId = (result as mysql.ResultSetHeader).insertId;

      // Insert tags and link them to the article
      if (article.tags) {
        for (const tag of article.tags) {
          await connection.execute(
            'INSERT IGNORE INTO tag (name) VALUES (?)',
            [tag]
          );
          const [tagResult] = await connection.execute('SELECT id FROM tag WHERE name = ?', [tag]);
          const tagId = (tagResult as any)[0].id;
          
          await connection.execute(
            'INSERT IGNORE INTO article_tag (article_id, tag_id) VALUES (?, ?)',
            [articleId, tagId]
          );
        }
      }
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