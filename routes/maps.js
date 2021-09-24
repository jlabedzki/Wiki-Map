/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const queries = require('../lib/queries');


router.get('/notloggedin', (req, res) => {
  queries.listAllMapsNotLoggedIn()
    .then(maps => {
      res.send({ maps })
    });
})

// GET /maps/
router.get('/', (req, res) => {
  const userID = req.session.user_id;

  queries.listAllMaps(userID)
    .then((maps) => {
      res.send({ maps });
    });
});

// Get /maps/mymaps/
router.get('/mymaps', (req, res) => {
  const userID = req.session.user_id;

  queries.listMyMaps(userID)
    .then((maps) => {
      res.send({ maps });
    })
})

// get /maps/contributions
router.get('/contributions', (req, res) => {
  const userID = req.session.user_id;

  queries.listMyContributions(userID)
    .then((maps) => {
      res.send({ maps });
    });
})

//GET /maps/categories/:category (filter list of maps by category)
router.get('/categories/:category', (req, res) => {
  const category = req.params.category;

  queries.listMapsByCategory(category)
    .then((maps) => {
      res.send({ maps });
    });
})

// GET /maps/:id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  queries.listMap(id)
    .then((map) => {
      res.send({ map });
    });
});

// POST /maps
router.post('/', (req, res) => {

  const userID = req.session.user_id;
  const map = req.body;

  queries.addMap(map, userID)
    .then(res.redirect('/'));
});

// //GET /maps/:id/pins
// router.get('/:id/pins', (req, res) => {
//   queries.loadPins(mapID)
//     .then(pins => res.json(pins));
// });

// // POST /maps/:id/pin
// router.post('/:id/pin', (req, res) => {
//   const userID = 1; // !!VALUE TO BE REPLACED WITH A COOKIE
//   const pin = { // !!OBJECT TO BE REPLACED WITH req.body
//     map_id: 1,
//     creator_id: userID,
//     title: 'Hello World',
//     description: "Welcome to Vancouver!",
//     image_url: null,
//     longitude: 49.2827,
//     latitude: -123.1207
//   }

//   queries.addPin(pin, userId)
//     .then(res.send('Pin dropped successfully!'))
//     .then(console.log(pin));

// });

module.exports = router;
