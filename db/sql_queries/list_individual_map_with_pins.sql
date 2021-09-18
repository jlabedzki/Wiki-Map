SELECT maps.*, COUNT(pins.id)
FROM maps
JOIN pins ON map_id = maps.id
WHERE maps.id = 1 -- whichever map user clicks on;
GROUP BY maps.id;
