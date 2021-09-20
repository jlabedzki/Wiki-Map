const db = require('./db')

const listAllMaps = () => {
  return db
    .query(`
      SELECT id, title
      FROM maps
      ORDER BY id DESC
      LIMIT 10;
    `)
    .then(res => res.rows)
    .catch(err => err.message);
}

const listMap = id => {
  return db
    .query(`
      SELECT id, title
      FROM maps
      WHERE id = $1;
      `, [id])
    .then(res => res.rows)
    .catch(err => err.message);
}

const addMap = (map, id) => {

  console.log(map);
  console.log(id);
  const values = [
    id,
    map.title,
    map.longitude_1,
    map.latitude_1,
    map.longitude_2,
    map.latitude_2,
    map.category,
  ];

  console.log(values);

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
        VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7)
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
