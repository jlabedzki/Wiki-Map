const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
  req.session.user_id = req.params.id;
  res.redirect('/');
});

module.exports = router;
