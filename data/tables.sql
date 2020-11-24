DROP TABLE IF EXISTS favorites;

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  image VARCHAR(255),
  name VARCHAR(255),
  sol INT,
  date VARCHAR(10),
  camera VARCHAR(255) 
);

