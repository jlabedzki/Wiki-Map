/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const queries = require('../lib/queries')


// GET /maps/
router.get('/', (req, res) => {
  queries.listAllMaps()
    .then((maps) => {
      res.json(maps);
    });
});

// Another Route could be....
// GET /maps/:maps_id etc.

router.get('/:id', (req, res) => {
  const id = req.params.id;
  queries.listMap(id)
    .then((map) => {
      res.json(map);
    });
});

module.exports = router;
