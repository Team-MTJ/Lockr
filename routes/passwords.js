// For Password display page
// For Password card (individual passwords)

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/cards", (req, res) => {
    res.render("cards");
  });

  // Use for passwords already created, and for new passwords
  // Everything on this page is the same other than the two input fields where a new password/site combo is made (see wireframe)
  router.get("/password", (req, res) => {
    res.render("password");
  })

  return router;
}