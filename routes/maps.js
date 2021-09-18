/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const queries = require('../lib/queries')


//original code before the break. >>>>>>>>>>>>>

// module.exports = () => {
//   router.get("/", (req, res) => {
//     queries.listAllMaps()
//       .then((maps) => {
//         res.json(maps);
//       })
//   });

//   return router;
// };

// Example code RD // >>>>>>>>>>>>>>>>>>>>>>>

// GET /maps/
router.get('/', (req, res) => {
  queries.listAllMaps()
    .then((maps) => {
      res.json(maps);
    });
});

// Another Route could be....
// GET /maps/:maps_id etc.

module.exports = router;
