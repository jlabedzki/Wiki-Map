-- Drop and recreate Favorites table

DROP TABLE IF EXISTS favorites CASCADE;

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  map_id INTEGER UNIQUE REFERENCES maps(id) ON DELETE CASCADE
);
