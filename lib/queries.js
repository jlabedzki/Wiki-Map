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

module.exports = { listAllMaps };

// We should expect to get back an array of objects.
// it is correct to handle errors here.
