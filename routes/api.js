const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.get("/", (req, res) => {
    res.send("Response from localhost");
  });

  return router;
};
