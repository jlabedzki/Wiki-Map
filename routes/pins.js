const express = require('express');
const router = express.Router();
const queries = require('../lib/queries');

router.get('/:id', (req, res) => {
  const mapID = req.params.id;

  queries.loadPins(mapID)
    .then((pins) => {
      res.send({pins});
    });
});

//add
router.post('/', (req, res) => {
  const userID = req.session.user_id;
  const pin = req.body;
  console.log('userID: ', userID);
  console.log('pini: ', pin);

  queries.addPin(pin, userID)
    .then((pin) => {
      res.send({pin});
    });
})

//edit
router.post('/edit/:id', (req, res) => {
  const userID = req.session.user_id;
  const pin = req.body;
  console.log('userID: ', userID);
  console.log('pini: ', pin);
  queries.editPin(pin, userID)
    .then((pin) => {
      res.send({pin});
    });
})

//delete
// router.post();

module.exports = router;
