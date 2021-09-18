SELECT maps.id AS id, maps.title AS title
FROM maps
JOIN users ON users.id = creator_id
WHERE users.id = 2;
