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

module.exports = router;
