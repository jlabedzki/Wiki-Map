SELECT maps.id AS id, maps.title AS title
FROM users
JOIN pins ON pins.creator_id = users.id
JOIN maps ON map_id = maps.id
WHERE users.id != maps.creator_id AND users.id = 2;
