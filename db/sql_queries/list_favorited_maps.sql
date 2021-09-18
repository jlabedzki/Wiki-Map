-- For "My Favourites" Home page button. Should display list based on ID.

SELECT maps.id, maps.title
FROM maps
JOIN favorites ON maps.id = map_id
JOIN users ON users.id = user_id
WHERE users.id = 15 -- inject ID later based on cookie
LIMIT 10;
