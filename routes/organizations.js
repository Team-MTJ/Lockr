const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:organization", (req, res) => {
    res.render("organization");
  });
  return router;
};
