const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Use for passwords already created, and for new passwords

  router.get("/password", (req, res) => {
    res.render("password");
  })

  return router;
}