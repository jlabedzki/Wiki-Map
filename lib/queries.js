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
  const values = [
    id,
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

module.exports = { listAllMaps, listMap, addMap };

// We should expect to get back an array of objects.
// it is correct to handle errors here.
