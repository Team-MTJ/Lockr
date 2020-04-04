const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.get("/", (req, res) => {
    res.render("index");
  });

  router.get("/login", (req, res) => {
    dbHelpers.getUsers().then((data) => {
      console.log(data);
    });
    res.render("login");
  });

  router.get("/register", (req, res) => {
    res.render("register");
  });

  return router;
};
