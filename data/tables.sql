DROP TABLE IF EXISTS rovers;
DROP TABLE IF EXISTS weather;

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  image VARCHAR(255),
  name VARCHAR(255),
  sol INT,
  date VARCHAR(10),
  camera VARCHAR(255) 
);

CREATE TABLE weather (
  id SERIAL PRIMARY KEY,
  sol INT,
  date DATE,
  max FLOAT,
  min FLOAT,
  avg FLOAT
);
