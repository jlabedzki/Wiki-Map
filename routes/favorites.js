const express = require('express');
const router = express.Router();
const queries = require('../lib/queries')

router.get('/', (req, res) => {
  const userID = req.session.user_id;

  queries.listAllFavorites(userID)
    .then((maps) => {
      res.send({ maps });
    });
});

router.post('/', (req, res) => {
  const favorite = req.body;


  queries.addMapToFavorites(favorite)
    .then((favorite) => {
      res.send({ favorite })
    });
})

router.delete('/', (req, res) => {
  const favorite = req.body

  queries.removeMapFromFavorites(favorite)
    .then((favorite) => {
      res.send({ favorite })
    });
})

module.exports = router;
