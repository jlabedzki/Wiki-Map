-- Drop and recreate Maps table

DROP TABLE IF EXISTS maps CASCADE;
CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  longitude_1 DECIMAL NOT NULL,
  latitude_1 DECIMAL NOT NULL,
  longitude_2 DECIMAL NOT NULL,
  latitude_2 DECIMAL NOT NULL,
  category VARCHAR(255) NOT NULL
);
