CREATE TABLE source (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE article (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source_id VARCHAR(50),
  author VARCHAR(100),
  title VARCHAR(1000) NOT NULL,
  description TEXT,
  url VARCHAR(2048) NOT NULL,
  url_to_image VARCHAR(2048),
  published_at DATETIME NOT NULL,
  content TEXT,
  FOREIGN KEY (source_id) REFERENCES source(id)
);

CREATE TABLE tag (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE article_tag (
  article_id INT,
  tag_id INT,
  PRIMARY KEY (article_id, tag_id),
  FOREIGN KEY (article_id) REFERENCES article(id),
  FOREIGN KEY (tag_id) REFERENCES tag(id)
);