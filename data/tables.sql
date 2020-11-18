DROP TABLE IF EXISTS rovers;
DROP TABLE IF EXISTS weather;

CREATE TABLE rovers (
  id SERIAL PRIMARY KEY,
  roverName VARCHAR(255),
  sol INT,
  photoTotal INT
);

CREATE TABLE weather (
  id SERIAL PRIMARY KEY,
  sol INT, 
  tempHigh FLOAT,
  tempLow FLOAT
);