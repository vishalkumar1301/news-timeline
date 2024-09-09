CREATE TABLE source (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE article (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source_id VARCHAR(255),
  author VARCHAR(255),
  title VARCHAR(512) NOT NULL,
  description TEXT,
  url VARCHAR(2048) NOT NULL,
  url_to_image VARCHAR(2048),
  published_at DATETIME NOT NULL,
  content TEXT,
  FOREIGN KEY (source_id) REFERENCES source(id)
);