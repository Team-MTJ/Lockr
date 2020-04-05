const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Use for passwords already created, and for new passwords
  const dbHelpers = require("./helpers/db_helpers")(db);

  return router;
};