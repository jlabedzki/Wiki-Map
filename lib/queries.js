const db = require('./db')

const listAllMaps = () => {
  return db
    .query(`
      SELECT *
      FROM maps
      ORDER BY id DESC;
    `)
    .then(res => res.rows)
    .catch(err => err.message);
}

const listMap = mapID => {
  return db
    .query(`
      SELECT *
      FROM maps
      WHERE id = $1;
      `, [mapID])
    .then(res => res.rows)
    .catch(err => err.message);
}

const addMap = (map, userID) => {
  const values = [
    userID,
    map.title,
    map.longitude_1,
    map.latitude_1,
    map.logitude_2,
    map.latitude_2,
    map.category
  ];

  return db
    .query(`
      INSERT INTO maps
      VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, values)
    .then(res => res.rows[0])
    .catch(err => err.message);
}

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
        INSERT INTO pins
        VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `, values)
    .then(res => res.rows[0])
    .catch(err => err.message);
  }

const loadPins = mapID => {
  return db
    .query(`
      SELECT *
      FROM pins
      where map_id = $1;
    `, [mapID])
    .then(res => res.rows)
    .catch(err => err.message);
}

module.exports = { listAllMaps, listMap, addMap, addPin, loadPins };

// We should expect to get back an array of objects.
// it is correct to handle errors here.
