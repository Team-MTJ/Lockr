const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.get("/", (req, res) => {
    res.render("index");
  });

  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).send("Error logging in!");
    }

    dbHelpers
      .login(email, password)
      .then((user) => {
        if (!user) {
          return res.status(400).send("Error logging in!");
        }
        req.session.userId = user.id;
        return res.send("Logged in!");
      })
      .catch((e) => res.send(e));
  });

  router.get("/register", (req, res) => {
    res.render("register");
  });

  return router;
};
