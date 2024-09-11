CREATE TABLE source (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE article (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sourceId VARCHAR(50),
  author VARCHAR(100),
  title VARCHAR(1000) NOT NULL,
  description TEXT,
  url VARCHAR(2048) NOT NULL,
  urlToImage VARCHAR(2048),
  publishedAt DATETIME NOT NULL,
  content TEXT,
  FOREIGN KEY (sourceId) REFERENCES source(id)
);

CREATE TABLE tag (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE article_tag (
  articleId INT,
  tagId INT,
  PRIMARY KEY (articleId, tagId),
  FOREIGN KEY (articleId) REFERENCES article(id),
  FOREIGN KEY (tagId) REFERENCES tag(id)
);