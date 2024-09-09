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