const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log(req.session);
  });

  router.get("/:organization/manage", (req, res) => {
    res.render("manage");
  });

  return router;
};
