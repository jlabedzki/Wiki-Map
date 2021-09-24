const db = require('./db');

const listAllMapsNotLoggedIn = () => {
  return db
    .query(`
      SELECT *
      FROM MAPS
      ORDER BY id DESC;
    `)
    .then(res => res.rows)
    .catch(err => err.message);
};

const listAllMaps = (userID) => {
  return db
    .query(`SELECT maps.*
      FROM maps
      WHERE maps.id NOT IN(SELECT maps.id
      FROM maps
      JOIN favorites
      ON maps.id = map_id
      JOIN users
      ON users.id = user_id
      WHERE users.id = $1)
      AND maps.creator_id != $1
      ORDER BY maps.id DESC;
    `, [userID])
    .then(res => res.rows)
    .catch(err => err.message);
};

const listMap = id => {
  return db
    .query(`
      SELECT *
      FROM maps
      WHERE id = $1;
      `, [id])
    .then(res => res.rows)
    .catch(err => err.message);
};

const listAllFavorites = userID => {
  return db
    .query(`
      SELECT maps.*
      FROM maps
      JOIN favorites
      ON maps.id = map_id
      JOIN users
      ON users.id = user_id
      WHERE users.id = $1
      ORDER BY favorites.id DESC;
    `, [userID])
    .then(res => res.rows)
    .catch(err => err.message);
};

const listMyMaps = userID => {
  return db
    .query(`
      SELECT *
      FROM maps
      WHERE creator_id = $1
      ORDER BY maps.id DESC;
    `, [userID])
    .then(res => res.rows)
    .catch(err => err.message);
};

const listMyContributions = userID => {
  return db
    .query(`
      SELECT maps.*
      FROM maps
      JOIN pins ON maps.id = map_id
      JOIN users ON pins.creator_id = $1
      WHERE pins.creator_id != maps.creator_id
      GROUP BY maps.id
      ORDER BY maps.id DESC;
    `, [userID])
    .then(res => res.rows)
    .catch(err => err.message);
};

const listMapsByCategory = category => {
  return db
    .query(`
      SELECT *
      FROM maps
      WHERE category = $1
      ORDER BY maps.id DESC;
    `, [category])
    .then(res => res.rows)
    .catch(err => err.message);
}

const addMapToFavorites = (favorite) => {
  const values = [
    favorite.user_id,
    favorite.map_id
  ]


  return db
    .query(`
      INSERT INTO favorites
      (user_id, map_id)
      VALUES ($1, $2)
      RETURNING *;
    `, values)
    .then(res => res.rows[0])
    .catch(err => err.message);
};

const removeMapFromFavorites = (favorite) => {
  const values = [
    favorite.user_id,
    favorite.map_id
  ]

  return db
    .query(`
      DELETE FROM favorites
      WHERE user_id = $1 AND map_id = $2;
    `, values)
    .catch(err => err.message);
};

const addMap = (map, id) => {

  const values = [
    id,
    map.title,
    map.longitude_1,
    map.latitude_1,
    map.longitude_2,
    map.latitude_2,
    map.category,
  ];

  return db
    .query(`
      INSERT INTO maps
      (creator_id, title, longitude_1, latitude_1, longitude_2, latitude_2, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, values)
    .then(res => {
      res.rows[0]
    })
    .catch(err => err.message);
};

const addPin = (pin, userID) => {

  const values = [
    pin.map_id,
    userID,
    pin.title,
    pin.description,
    pin.image_url,
    pin.longitude,
    pin.latitude
  ];

  return db
    .query(`
      INSERT INTO pins (map_id, creator_id, title, description, image_url, longitude, latitude)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, values)
    .then(res => res.rows[0])
    .catch(err => err.message);
};


const loadPins = mapID => {
  return db
    .query(`
  SELECT *
  FROM pins
  where map_id = $1;
  `, [mapID])
    .then(res => res.rows)
    .catch(err => err.message);
};

const editPin = (pin, userID) => {

  const values = [
    pin.id,
    pin.map_id,
    userID,
    pin.title,
    pin.description,
    pin.image_url,
    pin.longitude,
    pin.latitude
  ];

  return db
    .query(`
      UPDATE pins
      SET map_id = $2, creator_id = $3, title = $4, description = $5, image_url = $6, longitude = $7, latitude = $8
      WHERE id = $1
      RETURNING *;
    `, values)
    .then(res => res.rows[0])
    .catch(err => err.message);
};

const deletePin = (pin) => {

  const values = [pin.pinID];

  return db
    .query(`
      DELETE FROM pins
      WHERE id = $1
      RETURNING *;
    `, values)
    .then(res => res.rows[0])
    .catch(err => err.message);
};


module.exports = { listAllMapsNotLoggedIn, listAllMaps, listMap, listAllFavorites, listMyMaps, listMyContributions, listMapsByCategory, addMapToFavorites, removeMapFromFavorites, addMap, addPin, loadPins, editPin, deletePin };


// We should expect to get back an array of objects.
// it is correct to handle errors here.
