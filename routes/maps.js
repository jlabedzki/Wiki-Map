/*
 * All routes for Maps are defined here
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

// GET /maps/:id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  queries.listMap(id)
    .then((map) => {
      res.json(map);
    });
});

// POST /maps/:id
router.post('/', (req, res) => {
  const userId = 2; // change to cookie later
  const map = {
    creator_id: 2,
    title: 'hi',
    longitude_1: '4.4',
    latitude_1: '4.4',
    longitude_2: '4.4',
    latitude_2: '4.4',
    category: 'hi'
  }
  // const map = req.body.map; //assuming map comes from req.body =D

  queries.addMap(map, userId)
    .then(res.send('Map created successfully!'))
    .then(console.log(map));
});

// POST /maps/pin

router.post('/pin', (req, res) => {
  const userID = 1; // !!VALUE TO BE REPLACED WITH A COOKIE
  const pin = { // !!OBJECT TO BE REPLACED WITH req.body
    map_id: 1,
    creator_id: 1,
    title: 'Hello World',
    description: "Welcome to Vancouver!",
    image_url: null,
    longitude: 49.2827,
    latitude: -123.1207
  }

  queries.addPin(pin, userId)
  .then(res.send('Pin dropped successfully!'))
  .then(console.log(pin));

});

module.exports = router;
